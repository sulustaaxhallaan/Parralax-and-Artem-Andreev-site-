"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "framer-motion";

/* Поворотная лента нарезана из видео скриптом scripts/hero-frames.py.
   Фон в кадрах сохранён: он почти совпадает с фоном сайта, а стык
   растворяет маска EDGE_MASK ниже. */

const FRAMES = 180; // шаг 2°
const W = 282;
const H = 800;

/** опорные кадры держим в памяти всегда — всегда есть что нарисовать */
const PINNED_STRIDE = 12;
/** сверх опорных: 180 распакованных кадров заняли бы больше 250 МБ */
const CACHE_LIMIT = 24;

/** кадров за тик простоя: полный оборот примерно за 40 секунд */
const IDLE_SPEED = 0.075;
/** кадров на пиксель перетаскивания */
const SENSITIVITY = 0.22;
/** затухание броска */
const FRICTION = 0.92;

/* Фон кадров темнее фона сайта, и мягкой кромкой эту разницу спрятать
   не выходило: растушёвка размазывает стык, но не убирает разницу в
   середине пятна. Поэтому граница сделана намеренной — светящаяся
   рамка. Она читается как приём, а не как артефакт, и одинаково
   работает и на тёмных, и на светлых участках фона. */
const FRAME_GLOW = [
    "0 0 0 1px rgba(191,228,245,0.35)",
    "0 0 16px rgba(127,210,240,0.55)",
    "0 0 44px rgba(127,210,240,0.32)",
    "0 0 110px rgba(127,210,240,0.16)",
    "inset 0 0 30px rgba(127,210,240,0.12)",
].join(", ");

const frameSrc = (i: number) => `/hero/turn/f${String(i).padStart(3, "0")}.webp`;

const wrap = (i: number) => ((i % FRAMES) + FRAMES) % FRAMES;

const blockSelect = (e: Event) => e.preventDefault();

type Props = {
    active: boolean;
    /** размеры и место в компоновке задаёт Hero */
    className?: string;
};

export default function HeroModel({ active, className = "" }: Props) {
    const reduced = useReducedMotion();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bitmaps = useRef(new Map<number, ImageBitmap>());
    const queue = useRef<number[]>([]);
    const loading = useRef(new Set<number>());

    const pos = useRef(0); // дробный номер кадра
    const velocity = useRef(0);
    const drag = useRef({ on: false, lastX: 0 });

    const [dragging, setDragging] = useState(false);
    const [ready, setReady] = useState(false);

    /* --- подгрузка кадра с вытеснением самых старых --- */
    const request = useCallback((i: number) => {
        if (bitmaps.current.has(i) || loading.current.has(i)) return;
        loading.current.add(i);

        fetch(frameSrc(i))
            .then((r) => r.blob())
            .then(createImageBitmap)
            .then((bm) => {
                bitmaps.current.set(i, bm);
                if (i % PINNED_STRIDE !== 0) {
                    queue.current.push(i);
                    while (queue.current.length > CACHE_LIMIT) {
                        const old = queue.current.shift()!;
                        bitmaps.current.get(old)?.close();
                        bitmaps.current.delete(old);
                    }
                }
                if (!ready) setReady(true);
            })
            .catch(() => {})
            .finally(() => loading.current.delete(i));
    }, [ready]);

    // опорный набор — сразу, чтобы крутить можно было не дожидаясь остального
    useEffect(() => {
        for (let i = 0; i < FRAMES; i += PINNED_STRIDE) request(i);

        const cache = bitmaps.current;
        return () => {
            cache.forEach((bm) => bm.close());
            cache.clear();
        };
    }, [request]);

    /** ближайший к позиции уже распакованный кадр */
    const nearestReady = useCallback((p: number) => {
        const base = wrap(Math.round(p));
        for (let d = 0; d < FRAMES; d++) {
            for (const c of d === 0 ? [base] : [base + d, base - d]) {
                const i = wrap(c);
                if (bitmaps.current.has(i)) return i;
            }
        }
        return -1;
    }, []);

    /* --- цикл отрисовки. Пока секция не на экране, он не крутится:
       вечная анимация на первом экране грела бы телефон всю прокрутку. --- */
    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        let raf = 0;
        let last = performance.now();
        let shown = -1;

        const tick = (now: number) => {
            const dt = Math.min(64, now - last) / 16.67;
            last = now;

            if (!drag.current.on) {
                velocity.current *= Math.pow(FRICTION, dt);
                if (Math.abs(velocity.current) < 0.002) velocity.current = 0;
                pos.current +=
                    velocity.current * dt + (reduced ? 0 : IDLE_SPEED * dt);
            }

            // текущий кадр и небольшой задел по ходу движения
            const here = wrap(Math.round(pos.current));
            request(here);
            const dir = velocity.current >= 0 ? 1 : -1;
            for (let k = 1; k <= 4; k++) request(wrap(here + dir * k));

            const i = nearestReady(pos.current);
            if (i >= 0 && i !== shown) {
                shown = i;
                ctx.drawImage(bitmaps.current.get(i)!, 0, 0, W, H);
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active, reduced, nearestReady, request]);

    /* --- перетаскивание.
       touch-action: pan-y отдаёт вертикаль странице, поэтому палец
       листает сайт как обычно, а вбок — крутит фигуру. --- */

    /* Без этого браузер заодно выделяет текст страницы. preventDefault
       на pointerdown Chrome для выделения не учитывает, а одного
       user-select мало: уже начатое выделение он не отменяет. Поэтому
       на время перетаскивания глушим ещё и сам selectstart. */
    const freezeSelection = (frozen: boolean) => {
        document.body.style.userSelect = frozen ? "none" : "";
        if (frozen) {
            document.addEventListener("selectstart", blockSelect);
        } else {
            document.removeEventListener("selectstart", blockSelect);
            window.getSelection()?.removeAllRanges();
        }
    };

    useEffect(() => () => freezeSelection(false), []);

    const onPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
        if (e.button !== 0) return;
        drag.current = { on: true, lastX: e.clientX };
        velocity.current = 0;
        setDragging(true);
        freezeSelection(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
        if (!drag.current.on) return;
        const dx = e.clientX - drag.current.lastX;
        drag.current.lastX = e.clientX;

        const step = -dx * SENSITIVITY;
        pos.current += step;
        velocity.current = step;
    };

    const endDrag = (e: ReactPointerEvent<HTMLCanvasElement>) => {
        if (!drag.current.on) return;
        drag.current.on = false;
        setDragging(false);
        freezeSelection(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    return (
        /* Фигура стоит в общем потоке рядом с текстом, а не поверх него,
           поэтому перехватывать чужие клики ей нечем. */
        <div
            className={`pointer-events-none relative aspect-[282/800] shrink-0 ${className}`}
        >
            {/* Свечение рисует box-shadow: собственный overflow элемента
                его не режет, поэтому ореол свободно выходит за рамку */}
            <div
                className="relative h-full w-full overflow-hidden rounded-[1.6rem] border sm:rounded-[1.9rem] sm:border-2"
                style={{
                    borderColor: "rgba(191,228,245,0.85)",
                    boxShadow: FRAME_GLOW,
                }}
            >
                <canvas
                    ref={canvasRef}
                    width={W}
                    height={H}
                    aria-label="Трёхмерная модель: потяните, чтобы повернуть"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    onDragStart={(e) => e.preventDefault()}
                    /* Ловим курсор только пока секция на экране: иначе
                       гаснущий Hero перехватывал бы перетаскивание */
                    className={`block h-full w-full touch-pan-y select-none transition-opacity duration-700 ${
                        active ? "pointer-events-auto" : "pointer-events-none"
                    } ${ready ? "opacity-100" : "opacity-0"} ${
                        dragging ? "cursor-grabbing" : "cursor-grab"
                    }`}
                />
            </div>
        </div>
    );
}

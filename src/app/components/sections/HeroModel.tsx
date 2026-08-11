"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { useReducedMotion } from "framer-motion";

/* Поворотная лента нарезана из видео скриптом scripts/hero-frames.py:
   36 кадров по кругу, шаг 10°, фон снят. Крутим их на canvas —
   так нет ни мигания при подмене src, ни 36 растров в памяти. */

const FRAMES = 36;
const W = 384;
const H = 1000;

/** каждый третий кадр грузим первым — крутить можно почти сразу */
const FIRST_PASS = 3;

/** кадров за тик простоя: полный оборот примерно за 40 секунд */
const IDLE_SPEED = 0.015;
/** кадров на пиксель перетаскивания */
const SENSITIVITY = 0.045;
/** затухание броска */
const FRICTION = 0.92;

const frameSrc = (i: number) => `/hero/turn/f${String(i).padStart(2, "0")}.webp`;

const wrap = (i: number) => ((i % FRAMES) + FRAMES) % FRAMES;

const blockSelect = (e: Event) => e.preventDefault();

export default function HeroModel({ active }: { active: boolean }) {
    const reduced = useReducedMotion();

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const images = useRef<(HTMLImageElement | null)[]>(
        Array(FRAMES).fill(null),
    );

    const pos = useRef(0); // дробный номер кадра
    const velocity = useRef(0);
    const drag = useRef({ on: false, lastX: 0 });

    const [dragging, setDragging] = useState(false);
    const [ready, setReady] = useState(false);

    /* --- загрузка: сначала каждый третий кадр, потом остальные --- */
    useEffect(() => {
        let cancelled = false;

        const load = (i: number) =>
            new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    if (!cancelled) {
                        images.current[i] = img;
                        if (i === 0) setReady(true);
                    }
                    resolve();
                };
                img.onerror = () => resolve();
                img.src = frameSrc(i);
            });

        const all = Array.from({ length: FRAMES }, (_, i) => i);

        (async () => {
            await Promise.all(all.filter((i) => i % FIRST_PASS === 0).map(load));
            if (cancelled) return;
            await Promise.all(all.filter((i) => i % FIRST_PASS !== 0).map(load));
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    /** ближайший к позиции уже загруженный кадр */
    const nearestLoaded = useCallback((p: number) => {
        const base = wrap(Math.round(p));
        for (let d = 0; d < FRAMES; d++) {
            for (const candidate of d === 0 ? [base] : [base + d, base - d]) {
                const i = wrap(candidate);
                if (images.current[i]) return i;
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
                if (Math.abs(velocity.current) < 0.0005) velocity.current = 0;
                pos.current +=
                    velocity.current * dt + (reduced ? 0 : IDLE_SPEED * dt);
            }

            const i = nearestLoaded(pos.current);
            if (i >= 0 && i !== shown) {
                shown = i;
                ctx.clearRect(0, 0, W, H);
                ctx.drawImage(images.current[i]!, 0, 0, W, H);
            }

            raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [active, reduced, nearestLoaded]);

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
        /* С lg фигура стоит рядом с текстом и поднимается над ним, чтобы
           ловить курсор: текстовый блок Hero растянут на всю секцию и
           иначе перехватывал бы перетаскивание. На узких экранах она
           остаётся фоновой фактурой позади текста и не кликается. */
        <div
            className="pointer-events-none absolute bottom-0 right-0 z-0 aspect-[384/1000] h-[58%] translate-x-[6%] opacity-40 sm:h-[68%] sm:translate-x-[2%] sm:opacity-55 lg:z-20 lg:h-[78%] lg:translate-x-0 lg:opacity-100 xl:h-[86%]"
        >
            {/* Свечение под фигурой — иначе она выглядит наклеенной */}
            <div
                aria-hidden
                className="absolute left-[-40%] top-[10%] h-[70%] w-[180%] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle, rgba(45,120,190,0.40) 0%, rgba(20,60,110,0.16) 45%, rgba(0,0,0,0) 72%)",
                    filter: "blur(70px)",
                }}
            />

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
                /* Ловим курсор только пока секция на экране: иначе гаснущий
                   Hero продолжал бы перехватывать перетаскивание */
                className={`relative h-full w-full touch-pan-y select-none transition-opacity duration-700 ${
                    active
                        ? "pointer-events-none lg:pointer-events-auto"
                        : "pointer-events-none"
                } ${ready ? "opacity-100" : "opacity-0"} ${
                    dragging ? "cursor-grabbing" : "cursor-grab"
                }`}
            />
        </div>
    );
}

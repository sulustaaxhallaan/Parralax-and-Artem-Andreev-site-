"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";

import { cases, type CaseItem } from "@/content/site";
import TypeLine from "../motion/TypeLine";
import Reveal from "../motion/Reveal";
import Lightbox from "../Lightbox";

/** насколько резко лента догоняет цель при прокрутке колесом */
const EASE = 0.18;
/** сдвиг мыши, после которого это уже перетаскивание, а не клик */
const DRAG_THRESHOLD = 6;
/**
 * Допуск на «край ленты», px.
 *
 * Ширина колонок дробная, поэтому scrollLeft упирается на пиксель
 * раньше вычисленного максимума. Без запаса лента считает, что ехать
 * ещё есть куда, забирает колесо себе — и на секции можно застрять.
 */
const EDGE = 2;

/**
 * Размер карточки в ленте.
 *
 * Бокс у всех один и тот же, а работа вписывается внутрь целиком:
 * иначе широкий логотип 3384×786 растянулся бы на пол-ленты рядом с
 * квадратным. Обрезать нельзя — половина обложек это логотипы, у них
 * поля часть композиции.
 */
const BOX = "w-[clamp(150px,34vh,520px)]";

export default function Cases({ active }: { active: boolean }) {
    const railRef = useRef<HTMLDivElement>(null);
    const yearRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [current, setCurrent] = useState(0);
    const [dragging, setDragging] = useState(false);

    // Открытый кейс: какие работы показывать и с какой начали
    const [view, setView] = useState<CaseItem | null>(null);

    // Плавная докрутка: колесо и клики по годам двигают не саму ленту,
    // а цель, к которой она подтягивается покадрово.
    const target = useRef(0);
    const frame = useRef<number | null>(null);
    const easing = useRef(false);

    const stopEasing = useCallback(() => {
        easing.current = false;
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = null;
    }, []);

    const startEasing = useCallback(() => {
        if (frame.current !== null) return;

        const step = () => {
            const el = railRef.current;
            if (!el || !easing.current) {
                frame.current = null;
                return;
            }

            const finish = () => {
                target.current = el.scrollLeft;
                frame.current = null;
                easing.current = false;
            };

            const diff = target.current - el.scrollLeft;
            if (Math.abs(diff) < 1) {
                el.scrollLeft = target.current;
                finish();
                return;
            }

            // Шаг меньше пикселя браузер округлит до нуля, и цикл будет
            // крутиться вечно, продолжая тянуть ленту к старой цели.
            // Поэтому у последних пикселей идём ровно по одному.
            const shift = diff * EASE;
            const before = el.scrollLeft;
            el.scrollLeft += Math.abs(shift) < 1 ? Math.sign(shift) : shift;

            // Не сдвинулись вообще — значит упёрлись в край ленты
            if (el.scrollLeft === before) {
                finish();
                return;
            }

            frame.current = requestAnimationFrame(step);
        };

        easing.current = true;
        frame.current = requestAnimationFrame(step);
    }, []);

    /* --- колесо мыши: забираем его себе, только пока лента может ехать.
       Доехав до края, отдаём событие странице — иначе на секции можно
       было бы застрять навсегда. --- */
    useEffect(() => {
        const el = railRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            const max = el.scrollWidth - el.clientWidth;
            if (max <= 0) return;

            const delta =
                Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (delta === 0) return;

            // Край проверяем по фактическому положению ленты, а не по цели
            // докрутки: цель отстаёт на кадры, а ленту могли подвинуть
            // мышью, пальцем или кликом по году — тогда она устаревает.
            const real = el.scrollLeft;
            const atEdge =
                (delta > 0 && real >= max - EDGE) ||
                (delta < 0 && real <= EDGE);

            if (atEdge) {
                stopEasing();
                return; // край ленты — пусть страница листает секции
            }

            e.preventDefault();

            // Пока докрутка идёт, продолжаем от цели — так частые щелчки
            // колеса складываются. Но если цель уехала дальше экрана от
            // реального положения, она протухла: считаем от ленты.
            const stale = Math.abs(target.current - real) > el.clientWidth;
            const base = easing.current && !stale ? target.current : real;

            target.current = Math.max(0, Math.min(max, base + delta));
            startEasing();
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [startEasing, stopEasing]);

    /* --- подсветка текущего года в шкале --- */
    useEffect(() => {
        const el = railRef.current;
        if (!el) return;

        let queued = false;

        const onScroll = () => {
            if (queued) return;
            queued = true;

            requestAnimationFrame(() => {
                queued = false;
                const x = el.scrollLeft + 48;
                let next = 0;
                yearRefs.current.forEach((g, i) => {
                    if (g && g.offsetLeft <= x) next = i;
                });
                setCurrent((prev) => (prev === next ? prev : next));
            });
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => stopEasing, [stopEasing]);

    /* --- перетаскивание мышью.
       Палец не трогаем: на телефоне лента и так свайпается нативно. --- */
    const drag = useRef({
        active: false,
        startX: 0,
        startLeft: 0,
        moved: 0,
        captured: false,
    });

    const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        const el = railRef.current;
        if (!el) return;

        stopEasing();
        drag.current = {
            active: true,
            startX: e.clientX,
            startLeft: el.scrollLeft,
            moved: 0,
            captured: false,
        };
        setDragging(true);
        /* Захват указателя здесь НЕ ставим. Пока палец (мышь) не сдвинулся,
           это ещё может оказаться обычным кликом, а браузер уводит click
           на элемент с захватом — карточка перестала бы открываться.
           Ставим захват ниже, когда движение уже точно перетаскивание. */
    };

    const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!drag.current.active) return;
        const el = railRef.current;
        if (!el) return;

        const dx = e.clientX - drag.current.startX;
        drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));

        // Перетаскивание началось — теперь захват нужен, иначе лента
        // перестанет ехать, стоит курсору выйти за её пределы
        if (!drag.current.captured && drag.current.moved > DRAG_THRESHOLD) {
            drag.current.captured = true;
            el.setPointerCapture(e.pointerId);
        }

        el.scrollLeft = drag.current.startLeft - dx;
    };

    const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!drag.current.active) return;
        drag.current.active = false;
        setDragging(false);

        if (drag.current.captured) {
            drag.current.captured = false;
            railRef.current?.releasePointerCapture(e.pointerId);
        }
    };

    // После перетаскивания не должен срабатывать клик по карточке
    const onClickCapture = (e: React.MouseEvent) => {
        if (drag.current.moved > DRAG_THRESHOLD) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    const goToYear = (index: number) => {
        const el = railRef.current;
        const group = yearRefs.current[index];
        if (!el || !group) return;

        const max = el.scrollWidth - el.clientWidth;
        target.current = Math.max(0, Math.min(max, group.offsetLeft - 24));
        startEasing();
    };

    return (
        /* Низкие окна (телефон боком) — поджимаем поля, иначе лента
           не помещается в кадр */
        <div className="flex h-full w-full flex-col justify-center py-[8vh] [@media(max-height:560px)]:py-[3vh]">
            <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
                <Reveal active={active} y={14}>
                    <p className="eyebrow">{cases.eyebrow}</p>
                </Reveal>

                <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <TypeLine
                        as="h2"
                        active={active}
                        text={cases.title}
                        speed={55}
                        delay={180}
                        className="display block text-[clamp(1.7rem,4vw,4rem)]"
                    />

                    <Reveal active={active} delay={0.9}>
                        <p className="max-w-sm text-[0.8rem] leading-5 text-ink-dim sm:max-w-md sm:text-[0.92rem] sm:leading-6">
                            {cases.lead}
                        </p>
                    </Reveal>
                </div>
            </div>

            {/* Лента: собственный горизонтальный скроллер */}
            <div
                ref={railRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onClickCapture={onClickCapture}
                className={`no-scrollbar relative mt-8 w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [@media(max-height:560px)]:mt-4 ${
                    dragging ? "cursor-grabbing select-none" : "cursor-grab"
                }`}
            >
                <div className="flex w-max items-stretch gap-14 px-6 sm:px-10">
                    {cases.years.map((group, gi) => (
                        <div
                            key={group.year}
                            ref={(el) => {
                                yearRefs.current[gi] = el;
                            }}
                            className="flex shrink-0 items-start gap-8"
                        >
                            {/* Метка года */}
                            <div className="flex w-[clamp(9.5rem,16vw,14rem)] shrink-0 flex-col border-l border-line pl-5">
                                <span className="display text-[clamp(2rem,4vw,3.5rem)] leading-none">
                                    {group.year}
                                </span>
                                {/* На низких окнах возвращаем компактный кегль:
                                    там ширина десктопная, а высоты нет */}
                                <span className="mt-3 text-[0.82rem] leading-5 text-accent sm:text-[0.95rem] sm:leading-6 [@media(max-height:560px)]:text-[0.82rem] [@media(max-height:560px)]:leading-5">
                                    {group.caption}
                                </span>
                                {group.note ? (
                                    <span className="mt-3 text-[0.74rem] leading-5 text-ink-faint sm:text-[0.85rem] sm:leading-6 [@media(max-height:560px)]:text-[0.74rem] [@media(max-height:560px)]:leading-5">
                                        {group.note}
                                    </span>
                                ) : null}
                            </div>

                            <div className="flex items-start gap-6">
                                {group.items.map((item) => (
                                    <CaseCard
                                        key={item.shots[0].src}
                                        item={item}
                                        onOpen={() => setView(item)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Хвост, чтобы последний кейс не упирался в край */}
                    <div className="w-[10vw] shrink-0" aria-hidden />
                </div>
            </div>

            {/* Шкала лет + подсказка, что лентой можно управлять */}
            <div className="mx-auto mt-8 w-full max-w-6xl px-6 sm:px-10 [@media(max-height:560px)]:mt-4">
                <Reveal active={active} delay={1.1}>
                    <div className="relative">
                        <div className="h-px w-full bg-line" />

                        <div className="mt-3 flex items-center justify-between gap-4">
                            <ul className="flex flex-1 justify-between">
                                {cases.years.map((group, i) => (
                                    <li key={group.year}>
                                        <button
                                            type="button"
                                            onClick={() => goToYear(i)}
                                            className={`text-[0.68rem] tracking-[0.16em] transition-colors duration-300 sm:text-[0.78rem] ${
                                                i === current
                                                    ? "text-accent"
                                                    : "text-ink-faint hover:text-ink-dim"
                                            }`}
                                        >
                                            {group.year}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* На тачскрине про мышь писать незачем */}
                        <p className="mt-4 text-[0.66rem] tracking-[0.14em] text-ink-faint sm:text-[0.76rem] [@media(max-height:560px)]:mt-2 [@media(max-height:560px)]:text-[0.66rem]">
                            <span className="hidden [@media(hover:hover)]:inline">
                                Тяните ленту мышью или крутите колесо над ней.
                                Клик по работе — открыть в полном размере
                            </span>
                            <span className="[@media(hover:hover)]:hidden">
                                Листайте ленту вбок. Нажмите на работу, чтобы
                                увеличить
                            </span>
                        </p>
                    </div>
                </Reveal>
            </div>

            <Lightbox
                shots={view?.shots ?? []}
                index={view ? 0 : null}
                title={view?.title ?? ""}
                onClose={() => setView(null)}
            />
        </div>
    );
}

function CaseCard({ item, onOpen }: { item: CaseItem; onOpen: () => void }) {
    const cover = item.shots[0];
    const more = item.shots.length;

    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.title} — открыть в полном размере`}
            className={`group shrink-0 text-left ${BOX}`}
        >
            <div className="glass relative aspect-square w-full overflow-hidden rounded-xl transition-colors duration-300 group-hover:border-[rgba(127,210,240,0.45)]">
                <Image
                    src={cover.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 45vw, 400px"
                    draggable={false}
                    className="object-contain p-2.5 transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* Сколько работ внутри — иначе не видно, что кейс не один кадр */}
                {more > 1 ? (
                    <span className="pointer-events-none absolute bottom-2 right-2 rounded-full border border-line bg-[rgba(3,6,13,0.72)] px-2 py-0.5 text-[0.62rem] tracking-[0.1em] text-ink-dim backdrop-blur-sm sm:text-[0.7rem]">
                        {more}
                    </span>
                ) : null}
            </div>

            <div className="mt-3.5">
                <h3 className="text-[0.9rem] font-medium leading-5 text-accent sm:text-[1.02rem] sm:leading-6 [@media(max-height:560px)]:text-[0.9rem] [@media(max-height:560px)]:leading-5">
                    {item.title}
                </h3>
                {item.description ? (
                    <p className="mt-1.5 text-[0.76rem] leading-5 text-ink-dim sm:text-[0.88rem] sm:leading-6 [@media(max-height:560px)]:text-[0.76rem] [@media(max-height:560px)]:leading-5">
                        {item.description}
                    </p>
                ) : null}
            </div>
        </button>
    );
}

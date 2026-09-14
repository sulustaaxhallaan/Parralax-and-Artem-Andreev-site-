"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { cases, type CaseItem } from "@/content/design/site";
import Lightbox from "../Lightbox";

/**
 * Кейсы на телефоне — карусель.
 *
 * На десктопе работы лежат в общей ленте, сгруппированные по годам, и
 * листаются колесом. Пальцем так не походишь: лента длиной в 10 000px
 * превращается в бесконечное протаскивание. Здесь работы идут по одной,
 * прокрутка прилипает к карточке, а год и счётчик показывают, где ты.
 *
 * Позицию считаем из scrollLeft самого контейнера, без наблюдателей:
 * карточки одинаковой ширины, и деление даёт индекс точнее и дешевле.
 */

type Flat = CaseItem & { year: string; caption: string };

const WORKS: Flat[] = cases.years.flatMap((group) =>
    group.items.map((item) => ({
        ...item,
        year: group.year,
        caption: group.caption,
    })),
);

export default function CasesCarousel() {
    const railRef = useRef<HTMLDivElement>(null);
    const [current, setCurrent] = useState(0);
    const [view, setView] = useState<Flat | null>(null);

    useEffect(() => {
        const el = railRef.current;
        if (!el) return;

        let queued = false;
        const onScroll = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => {
                queued = false;
                const card = el.firstElementChild as HTMLElement | null;
                if (!card) return;
                // шаг = ширина карточки вместе с отступом между ними
                const step =
                    card.offsetWidth +
                    parseFloat(getComputedStyle(el).columnGap || "0");
                const i = Math.round(el.scrollLeft / step);
                setCurrent(Math.max(0, Math.min(WORKS.length - 1, i)));
            });
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    const goTo = (i: number) => {
        const el = railRef.current;
        const card = el?.firstElementChild as HTMLElement | null;
        if (!el || !card) return;
        const step =
            card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
        el.scrollTo({ left: i * step, behavior: "smooth" });
    };

    const work = WORKS[current];

    return (
        <div>
            {/* Год и подпись меняются на ходу — они и служат ориентиром
                вместо шкалы лет, которая на телефоне не помещается */}
            <div className="flex items-baseline justify-between gap-4 px-5">
                <div>
                    <span className="display text-[1.6rem] leading-none">
                        {work.year}
                    </span>
                    <span className="mt-1 block text-[0.8rem] leading-5 text-ink-faint">
                        {work.caption}
                    </span>
                </div>
                <span className="shrink-0 text-[0.78rem] tabular-nums text-ink-faint">
                    {current + 1} / {WORKS.length}
                </span>
            </div>

            <div
                ref={railRef}
                className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-1"
            >
                {WORKS.map((item) => (
                    <article
                        key={item.shots[0].src}
                        className="w-[82vw] shrink-0 snap-start"
                    >
                        <button
                            type="button"
                            onClick={() => setView(item)}
                            aria-label={`${item.title} — открыть в полном размере`}
                            className="block w-full text-left"
                        >
                            <div className="glass relative aspect-[4/5] overflow-hidden rounded-2xl">
                                <Image
                                    src={item.shots[0].src}
                                    alt={item.title}
                                    fill
                                    sizes="82vw"
                                    className="object-contain p-3"
                                />

                                {item.shots.length > 1 ? (
                                    <span className="absolute bottom-2.5 right-2.5 rounded-full border border-line bg-[rgba(3,6,13,0.72)] px-2.5 py-1 text-[0.7rem] text-ink-dim">
                                        {item.shots.length}
                                    </span>
                                ) : null}
                            </div>

                            <h3 className="mt-3.5 text-[0.98rem] font-medium leading-snug text-accent">
                                {item.title}
                            </h3>
                            {item.description ? (
                                <p className="mt-1.5 text-[0.86rem] leading-[1.65] text-ink-faint">
                                    {item.description}
                                </p>
                            ) : null}
                        </button>
                    </article>
                ))}
            </div>

            {/* Полоска вместо точек: работ двадцать с лишним, точки
                выродились бы в неразличимую строчку */}
            <div className="mt-5 px-5">
                <div className="h-px w-full bg-line">
                    <div
                        className="h-px bg-accent transition-[width] duration-300"
                        style={{
                            width: `${((current + 1) / WORKS.length) * 100}%`,
                        }}
                    />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <NavButton
                        label="Предыдущая работа"
                        disabled={current === 0}
                        onClick={() => goTo(current - 1)}
                    >
                        ←
                    </NavButton>

                    <span className="text-[0.72rem] uppercase tracking-[0.2em] text-ink-faint">
                        Листайте вбок
                    </span>

                    <NavButton
                        label="Следующая работа"
                        disabled={current === WORKS.length - 1}
                        onClick={() => goTo(current + 1)}
                    >
                        →
                    </NavButton>
                </div>
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

function NavButton({
    children,
    label,
    disabled,
    onClick,
}: {
    children: React.ReactNode;
    label: string;
    disabled: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink-dim transition-opacity duration-200 disabled:opacity-30"
        >
            {children}
        </button>
    );
}

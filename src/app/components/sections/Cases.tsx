"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    motion,
    useMotionValueEvent,
    useTransform,
    type MotionValue,
} from "framer-motion";

import { cases, type CaseItem } from "@/content/site";
import TypeLine from "../motion/TypeLine";
import Reveal from "../motion/Reveal";

type Props = {
    active: boolean;
    /** 0..1 — прогресс внутри секции, ведёт ленту по горизонтали */
    inner: MotionValue<number>;
    /** перейти к нужному году (значение 0..1 внутри секции) */
    onSeek?: (fraction: number) => void;
};

export default function Cases({ active, inner, onSeek }: Props) {
    const railRef = useRef<HTMLDivElement>(null);
    const yearRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [distance, setDistance] = useState(0);
    const [marks, setMarks] = useState<number[]>([]);
    const [current, setCurrent] = useState(0);

    // Измеряем ленту: сколько нужно проехать и где начинается каждый год
    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return;

        const measure = () => {
            const total = rail.scrollWidth;
            const visible = rail.parentElement?.clientWidth ?? window.innerWidth;
            const travel = Math.max(0, total - visible);
            setDistance(travel);

            setMarks(
                yearRefs.current.map((el) => {
                    if (!el || travel === 0) return 0;
                    return Math.min(1, Math.max(0, el.offsetLeft / travel));
                }),
            );
        };

        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(rail);
        if (rail.parentElement) ro.observe(rail.parentElement);
        window.addEventListener("resize", measure);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    const x = useTransform(inner, [0, 1], [0, -distance]);

    // Подсветка текущего года в нижней шкале
    useMotionValueEvent(inner, "change", (v) => {
        let next = 0;
        for (let i = 0; i < marks.length; i++) {
            if (v >= marks[i] - 0.02) next = i;
        }
        if (next !== current) setCurrent(next);
    });

    return (
        <div className="flex h-full w-full flex-col justify-center py-[8vh]">
            {/* Шапка секции — стоит на месте, пока едет лента */}
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
                        className="display block text-[clamp(1.7rem,4vw,3rem)]"
                    />

                    <Reveal active={active} delay={0.9}>
                        <p className="max-w-sm text-[0.8rem] leading-5 text-ink-dim">
                            {cases.lead}
                        </p>
                    </Reveal>
                </div>
            </div>

            {/* Лента: движется горизонтально за вертикальной прокруткой */}
            <div className="relative mt-8 w-full overflow-hidden">
                <motion.div
                    ref={railRef}
                    style={{ x }}
                    className="flex w-max items-stretch gap-14 px-6 sm:px-10"
                >
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
                                <span className="mt-3 text-[0.82rem] leading-5 text-accent">
                                    {group.caption}
                                </span>
                                {group.note ? (
                                    <span className="mt-3 text-[0.74rem] leading-5 text-ink-faint">
                                        {group.note}
                                    </span>
                                ) : null}
                            </div>

                            <div className="flex items-start gap-6">
                                {group.items.map((item) => (
                                    <CaseCard key={item.image} item={item} />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Хвост, чтобы последний кейс не упирался в край */}
                    <div className="w-[10vw] shrink-0" aria-hidden />
                </motion.div>
            </div>

            {/* Шкала лет */}
            <div className="mx-auto mt-8 w-full max-w-6xl px-6 sm:px-10">
                <Reveal active={active} delay={1.1}>
                    <div className="relative">
                        <div className="h-px w-full bg-line" />
                        <ul className="mt-3 flex justify-between">
                            {cases.years.map((group, i) => (
                                <li key={group.year}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSeek?.(marks[i] ?? 0)
                                        }
                                        className={`text-[0.68rem] tracking-[0.16em] transition-colors duration-300 ${
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
                </Reveal>
            </div>
        </div>
    );
}

function CaseCard({ item }: { item: CaseItem }) {
    const card = (
        <>
            <div className="glass overflow-hidden rounded-xl p-1.5">
                <Image
                    src={item.image}
                    alt={item.title}
                    width={item.w}
                    height={item.h}
                    sizes="(max-width: 768px) 70vw, 40vw"
                    className="h-[clamp(180px,34vh,420px)] w-auto rounded-lg object-cover"
                />
            </div>

            <div className="mt-3.5 max-w-[34ch]">
                <h3 className="text-[0.9rem] font-medium leading-5 text-accent">
                    {item.title}
                </h3>
                {item.description ? (
                    <p className="mt-1.5 text-[0.76rem] leading-5 text-ink-dim">
                        {item.description}
                    </p>
                ) : null}
            </div>
        </>
    );

    // href появится, когда сделаешь страницы кейсов — тогда карточка станет ссылкой
    if (item.href) {
        return (
            <a
                href={item.href}
                className="group block shrink-0 transition-opacity duration-300 hover:opacity-90"
            >
                {card}
            </a>
        );
    }

    return <article className="shrink-0">{card}</article>;
}

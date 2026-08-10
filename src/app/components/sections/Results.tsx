"use client";

import { useEffect } from "react";
import {
    animate,
    motion,
    useMotionValue,
    useReducedMotion,
    useTransform,
} from "framer-motion";

import { results } from "@/content/site";
import TypeLine from "../motion/TypeLine";
import Reveal from "../motion/Reveal";

export default function Results({ active }: { active: boolean }) {
    return (
        <div className="w-full max-w-5xl px-6 text-center sm:px-10">
            <Reveal active={active} y={14}>
                <p className="eyebrow">{results.eyebrow}</p>
            </Reveal>

            <TypeLine
                as="h2"
                active={active}
                text={results.title}
                speed={65}
                delay={200}
                className="display mt-5 block text-[clamp(2rem,5.5vw,4rem)]"
            />

            <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
                {results.items.map((item, i) => (
                    <Reveal
                        key={item.label}
                        active={active}
                        delay={0.9 + i * 0.18}
                        y={26}
                    >
                        <p className="text-[0.78rem] leading-5 text-ink-dim">
                            {item.prefix}
                        </p>

                        <p className="display mt-1 text-[clamp(3rem,9vw,6rem)] leading-none">
                            <Counter
                                value={item.value}
                                active={active}
                                delay={0.9 + i * 0.18}
                            />
                        </p>

                        <p className="mt-2 text-[0.9rem] leading-5 text-ink">
                            {item.label}
                        </p>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}

/** Число «набирается» счётчиком, когда секция выходит на экран. */
function Counter({
    value,
    active,
    delay,
}: {
    value: string;
    active: boolean;
    delay: number;
}) {
    const reduced = useReducedMotion();
    const target = Number(value);
    const still = reduced || Number.isNaN(target);

    // Значение живёт в MotionValue — так счётчик крутится без ре-рендеров
    const raw = useMotionValue(still ? target : 0);
    const rounded = useTransform(raw, (v) => String(Math.round(v)));

    useEffect(() => {
        if (still) return;

        if (!active) {
            raw.set(0);
            return;
        }

        const controls = animate(raw, target, {
            duration: 1.4,
            delay,
            ease: [0.16, 1, 0.3, 1],
        });

        return () => controls.stop();
    }, [active, target, delay, still, raw]);

    if (Number.isNaN(target)) return <>{value}</>;

    return <motion.span>{rounded}</motion.span>;
}

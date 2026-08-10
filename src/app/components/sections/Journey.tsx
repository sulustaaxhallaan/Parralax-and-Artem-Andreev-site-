"use client";

import { motion, useReducedMotion } from "framer-motion";

import { journey } from "@/content/site";
import TypeLine from "../motion/TypeLine";
import RevealWords from "../motion/RevealWords";
import Reveal from "../motion/Reveal";

export default function Journey({ active }: { active: boolean }) {
    const reduced = useReducedMotion();

    return (
        <div className="w-full max-w-6xl px-6 sm:px-10">
            <div className="text-center">
                <Reveal active={active} y={14}>
                    <p className="eyebrow">{journey.eyebrow}</p>
                </Reveal>

                <TypeLine
                    as="h2"
                    active={active}
                    text={journey.title}
                    speed={70}
                    delay={200}
                    className="display mt-5 block text-[clamp(2rem,5vw,3.6rem)]"
                />

                <RevealWords
                    active={active}
                    text={journey.lead}
                    delay={0.9}
                    step={0.016}
                    className="mx-auto mt-3 max-w-2xl text-[0.78rem] leading-5 tracking-[0.04em] text-ink-dim sm:mt-4 sm:text-base sm:leading-6"
                />
            </div>

            <div className="relative mt-7 sm:mt-12">
                <ol className="relative grid gap-6 sm:gap-10 md:grid-cols-3 md:gap-8">
                    {journey.steps.map((step, i) => (
                        <li key={step.company} className="relative">
                            <Reveal
                                active={active}
                                delay={1.2 + i * 0.25}
                                y={26}
                            >
                                {/* Узел на линии */}
                                <div className="flex items-center gap-3">
                                    <motion.span
                                        aria-hidden
                                        className="block h-2.5 w-2.5 shrink-0 rounded-full bg-accent"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: active ? 1 : 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 320,
                                            damping: 18,
                                            delay: active ? 1.4 + i * 0.25 : 0,
                                        }}
                                        style={{
                                            boxShadow:
                                                "0 0 0 4px rgba(127,210,240,0.15)",
                                        }}
                                    />
                                    <span className="whitespace-nowrap text-[0.7rem] uppercase tracking-[0.24em] text-ink-faint">
                                        {step.date}
                                    </span>

                                    {/* Пунктир тянется к следующей точке —
                                        путь из черновика */}
                                    <motion.span
                                        aria-hidden
                                        className="hidden h-px flex-1 border-t border-dashed border-[rgba(191,228,245,0.4)] md:block"
                                        initial={{ opacity: 0, scaleX: 0 }}
                                        animate={{
                                            opacity: active ? 1 : 0,
                                            scaleX: active ? 1 : 0,
                                        }}
                                        transition={{
                                            duration: 0.9,
                                            ease: "easeOut",
                                            delay: active ? 1.5 + i * 0.25 : 0,
                                        }}
                                        style={{ transformOrigin: "left" }}
                                    />
                                </div>

                                <h3 className="mt-3 text-[0.92rem] font-medium leading-5 text-accent sm:mt-4 sm:text-[1.05rem] sm:leading-6">
                                    {step.company}
                                </h3>

                                <p className="mt-1 text-[0.78rem] leading-4 text-ink sm:mt-1.5 sm:text-[0.85rem] sm:leading-5">
                                    {step.position}
                                </p>

                                <ul className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2.5">
                                    {step.points.map((point, j) => (
                                        <RevealWords
                                            key={point}
                                            as="li"
                                            active={active}
                                            text={point}
                                            delay={
                                                1.7 + i * 0.25 + j * 0.14
                                            }
                                            step={reduced ? 0 : 0.01}
                                            className="relative pl-4 text-[0.72rem] leading-5 text-ink-dim before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2 before:bg-ink-faint sm:text-[0.8rem] sm:leading-6"
                                        />
                                    ))}
                                </ul>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}

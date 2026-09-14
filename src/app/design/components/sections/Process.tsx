"use client";

import { motion, useReducedMotion } from "framer-motion";

import { process } from "@/content/design/site";
import TypeLine from "../motion/TypeLine";
import RevealWords from "../motion/RevealWords";
import Reveal from "../motion/Reveal";

export default function Process({ active }: { active: boolean }) {
    const reduced = useReducedMotion();

    return (
        <div className="w-full max-w-5xl px-6 sm:px-10">
            <Reveal active={active} y={14}>
                <p className="eyebrow">{process.eyebrow}</p>
            </Reveal>

            <TypeLine
                as="h2"
                active={active}
                text={process.title}
                speed={65}
                delay={200}
                className="display mt-4 block text-[clamp(1.8rem,5vw,3.6rem)] sm:mt-5"
            />

            <div className="relative mt-6 sm:mt-9">
                {/* Непрерывная линия проходит через все шаги. Отдельным
                    слоем по ней бежит подсветка — она обрезается по
                    краям линии, поэтому появляется и уходит плавно. */}
                <div className="absolute bottom-2 left-[5px] top-2 w-px overflow-hidden bg-line sm:left-[7px]">
                    {active && !reduced ? (
                        <motion.div
                            aria-hidden
                            className="absolute left-1/2 h-[34%] w-[4px] -translate-x-1/2 rounded-full"
                            style={{
                                background:
                                    "linear-gradient(to bottom, rgba(127,210,240,0) 0%, rgba(191,228,245,1) 50%, rgba(127,210,240,0) 100%)",
                                boxShadow:
                                    "0 0 18px rgba(127,210,240,0.9), 0 0 44px rgba(127,210,240,0.4)",
                            }}
                            animate={{ top: ["-34%", "100%"] }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear",
                                repeatDelay: 0.7,
                            }}
                        />
                    ) : null}
                </div>

                <ol className="space-y-3.5 sm:space-y-4">
                    {process.steps.map((step, i) => (
                        <li key={step.title} className="relative pl-8 sm:pl-11">
                            {/* Узел на линии. Вынесен из Reveal: transform у
                                Reveal создаёт новый containing block, из-за
                                чего absolute-позиционирование точки съезжало
                                к отступу pl-8 (в район цифр) вместо линии. */}
                            <motion.span
                                aria-hidden
                                className="absolute left-[1px] top-[0.45em] h-2.5 w-2.5 rounded-full bg-accent sm:left-[2px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: active ? 1 : 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: active ? 0.8 + i * 0.13 : 0,
                                }}
                                style={{
                                    boxShadow:
                                        "0 0 0 4px rgba(127,210,240,0.12)",
                                }}
                            />

                            <Reveal active={active} delay={0.8 + i * 0.13} y={18}>
                                <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 sm:gap-x-6">
                                    <span className="display text-[1.3rem] leading-none text-accent/60 sm:text-[1.7rem]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    <div>
                                        <h3 className="text-[0.9rem] font-medium leading-5 text-accent sm:text-[1.05rem] sm:leading-6">
                                            {step.title}
                                        </h3>
                                        <RevealWords
                                            active={active}
                                            text={step.text}
                                            delay={1 + i * 0.13}
                                            step={0.008}
                                            className="mt-1 text-[0.78rem] leading-5 text-ink-dim sm:text-[0.92rem] sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>

            <Reveal active={active} delay={2.2} className="mt-6 sm:mt-8">
                <p className="display text-center text-[0.82rem] tracking-[0.16em] text-accent sm:text-[1.05rem]">
                    {process.promise}
                </p>
            </Reveal>
        </div>
    );
}

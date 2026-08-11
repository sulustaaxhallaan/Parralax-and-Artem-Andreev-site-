"use client";

import { motion, useReducedMotion } from "framer-motion";

import { hero } from "@/content/site";
import TypeLine from "../motion/TypeLine";
import Reveal from "../motion/Reveal";
import HeroModel from "./HeroModel";

export default function Hero({ active }: { active: boolean }) {
    const reduced = useReducedMotion();

    return (
        <div className="relative h-full w-full overflow-hidden">
            {/* До lg фигура стоит над текстом, с lg — справа от заголовка.
                Крутится перетаскиванием, в покое поворачивается сама. */}
            {/* Низкие окна (телефон боком) тоже уходят в строку: колонкой
                фигура и текст туда не помещаются */}
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5 px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 [@media(max-height:560px)]:flex-row [@media(max-height:560px)]:justify-between [@media(max-height:560px)]:gap-6">
                <HeroModel
                    active={active}
                    className="order-first h-[30vh] sm:h-[34vh] lg:order-last lg:h-[68vh] xl:h-[76vh] [@media(max-height:560px)]:order-last [@media(max-height:560px)]:h-[72vh]"
                />

                <div className="w-full lg:flex-1 [@media(max-height:560px)]:flex-1">
                    <div className="max-w-full sm:max-w-[34rem] lg:max-w-[36rem] xl:max-w-[41rem]">
                        <Reveal active={active} delay={0.05} y={16}>
                            <p className="eyebrow">{hero.name}</p>
                        </Reveal>

                        <TypeLine
                            as="h1"
                            active={active}
                            text={hero.role}
                            speed={55}
                            delay={280}
                            className="display mt-6 block text-[clamp(1.7rem,4.6vw,4.6rem)] text-balance"
                        />

                        <Reveal
                            active={active}
                            delay={1.25}
                            y={12}
                            className="mt-4 flex justify-end"
                        >
                            <span className="font-[family:var(--font-geist-sans)] text-base tracking-[0.18em] text-ink-dim sm:text-xl">
                                {hero.handle}
                            </span>
                        </Reveal>

                        <Reveal active={active} delay={1.45} className="mt-8">
                            <div className="h-px w-full bg-line" />
                        </Reveal>

                        <TypeLine
                            as="p"
                            active={active}
                            text={hero.tagline}
                            speed={20}
                            delay={1700}
                            caret={false}
                            className="mt-6 block text-[clamp(0.9rem,1.9vw,1.45rem)] leading-relaxed tracking-[0.06em] text-ink"
                        />

                        {/* Подсказка о прокрутке — вся навигация строится на ней */}
                        <Reveal active={active} delay={2.6} className="mt-12">
                            <div className="flex items-center gap-4 text-ink-faint">
                                <span className="text-[0.65rem] uppercase tracking-[0.35em] sm:text-[0.75rem]">
                                    {hero.scrollHint}
                                </span>
                                <motion.span
                                    aria-hidden
                                    className="text-xl leading-none"
                                    animate={reduced ? undefined : { y: [0, 8, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    ↓
                                </motion.span>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
}

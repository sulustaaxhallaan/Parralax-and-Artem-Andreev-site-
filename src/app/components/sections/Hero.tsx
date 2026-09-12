"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { hero, pricesLink } from "@/content/site";
import { useMediaQuery } from "@/lib/useMediaQuery";
import Icon from "../Icons";
import TypeLine from "../motion/TypeLine";
import Reveal from "../motion/Reveal";

/* Фигура нужна только широким окнам, поэтому её код и кадры туда же и
   уезжают: телефон не скачивает ни то, ни другое. */
const HeroModel = dynamic(() => import("./HeroModel"), { ssr: false });

export default function Hero({ active }: { active: boolean }) {
    const reduced = useReducedMotion();

    /* Тот же порог, что у lg в Tailwind. На телефоне фигура выходила
       ростом в треть экрана и шириной в 90 пикселей: разглядеть в ней
       фигуру нельзя, а внимание от заголовка она забирала — и вставала
       не по центру колонки. Первый экран там отдан типографике. */
    const wide = useMediaQuery("(min-width: 1024px)");

    return (
        <div className="relative h-full w-full overflow-hidden">
            <div className="mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5 px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14">
                <div className="w-full lg:flex-1">
                    {/* @container — чтобы заголовок мерился по этой колонке,
                        а не по ширине окна: см. комментарий у него самого */}
                    <div className="@container max-w-full sm:max-w-[34rem] lg:max-w-[36rem] xl:max-w-[41rem]">
                        <Reveal active={active} delay={0.05} y={16}>
                            <p className="eyebrow">{hero.name}</p>
                        </Reveal>

                        <TypeLine
                            as="h1"
                            active={active}
                            text={hero.role}
                            speed={55}
                            delay={280}
                            /* Кегль считается от ширины КОЛОНКИ (cqw), а не окна
                               (vw). «ГРАФИЧЕСКИЙ» — одно слово, переносить его
                               некуда, и при размере от ширины окна оно вылезало
                               из колонки и уходило под фигуру: на 1920 слово
                               занимало 864px против 656px колонки. От колонки
                               же оно не вылезет ни при какой ширине экрана.
                               9.6cqw: слово шире кегля примерно в 9.8 раза,
                               значит занимает ~94% колонки — с запасом. */
                            className="display mt-6 block text-[clamp(1.7rem,9.6cqw,6rem)] text-balance"
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
                            className="mt-6 block text-[clamp(0.9rem,1.9vw,1.9rem)] leading-relaxed tracking-[0.06em] text-ink"
                        />

                        <Reveal active={active} delay={2.45} className="mt-9">
                            <Link
                                href={pricesLink.href}
                                className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(127,210,240,0.45)] px-5 py-2.5 text-[0.78rem] uppercase tracking-[0.2em] text-accent transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-[rgba(127,210,240,0.08)] sm:px-6 sm:py-3 sm:text-[0.86rem]"
                            >
                                <Icon name="price" className="h-[17px] w-[17px]" />
                                {pricesLink.label}
                            </Link>
                        </Reveal>

                        {/* Подсказка о прокрутке — вся навигация строится на ней */}
                        <Reveal active={active} delay={2.75} className="mt-7">
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

                {/* С xl фигура сдвинута в поле за контейнером — так между
                    ней и заголовком больше воздуха. На lg сдвига нет:
                    там контейнер уже во всю ширину, и рамка упиралась бы
                    в боковую навигацию */}
                {wide && (
                    <HeroModel
                        active={active}
                        className="h-[76vh] xl:h-[84vh] xl:translate-x-[12%]"
                    />
                )}
            </div>
        </div>
    );
}

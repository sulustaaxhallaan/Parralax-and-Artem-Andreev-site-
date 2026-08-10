"use client";

import Image from "next/image";

import { about } from "@/content/site";
import TypeLine from "../motion/TypeLine";
import RevealWords from "../motion/RevealWords";
import Reveal from "../motion/Reveal";

export default function About({ active }: { active: boolean }) {
    return (
        <div className="grid w-full max-w-6xl gap-10 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
                <Reveal active={active} y={14}>
                    <p className="eyebrow">{about.eyebrow}</p>
                </Reveal>

                <TypeLine
                    as="h2"
                    active={active}
                    text={about.title}
                    speed={60}
                    delay={200}
                    className="display mt-5 block text-[clamp(2rem,5vw,3.6rem)]"
                />

                <div className="mt-5 space-y-4 sm:mt-7 sm:space-y-5">
                    {about.paragraphs.map((text, i) => (
                        <RevealWords
                            key={i}
                            active={active}
                            text={text}
                            delay={0.9 + i * 0.5}
                            step={0.014}
                            className="max-w-xl text-[0.82rem] leading-6 text-ink-dim sm:text-[1.1rem] sm:leading-8"
                        />
                    ))}
                </div>

                <Reveal active={active} delay={2.1} className="mt-6 sm:mt-9">
                    <h3 className="display text-[0.8rem] tracking-[0.3em] text-accent sm:text-[0.92rem]">
                        {about.approachTitle}
                    </h3>

                    <ul className="mt-4 space-y-3">
                        {about.approach.map((item, i) => (
                            <RevealWords
                                key={item}
                                as="li"
                                active={active}
                                text={item}
                                delay={2.3 + i * 0.16}
                                step={0.012}
                                className="relative pl-5 text-[0.8rem] leading-5 text-ink before:absolute before:left-0 before:top-[0.6em] before:h-px before:w-2.5 before:bg-accent sm:pl-6 sm:text-[1.05rem] sm:leading-7"
                            />
                        ))}
                    </ul>
                </Reveal>
            </div>

            {/* На узких экранах картинка не помещается в кадр — визуальную
                часть там берут на себя кейсы */}
            <Reveal active={active} delay={0.5} y={30} className="hidden md:block">
                <div className="glass relative overflow-hidden rounded-2xl p-2">
                    <Image
                        src={about.image.src}
                        alt={about.image.alt}
                        width={1469}
                        height={906}
                        priority
                        className="h-auto w-full rounded-xl object-cover"
                    />
                </div>
            </Reveal>
        </div>
    );
}

"use client";

import { skills } from "@/content/site";
import TypeLine from "../motion/TypeLine";
import RevealWords from "../motion/RevealWords";
import Reveal from "../motion/Reveal";

export default function Skills({ active }: { active: boolean }) {
    return (
        <div className="w-full max-w-6xl px-6 sm:px-10">
            <Reveal active={active} y={14}>
                <p className="eyebrow">{skills.eyebrow}</p>
            </Reveal>

            <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <TypeLine
                    as="h2"
                    active={active}
                    text={skills.title}
                    speed={60}
                    delay={200}
                    className="display block text-[clamp(2rem,5vw,3.6rem)]"
                />

                <RevealWords
                    active={active}
                    text={skills.lead}
                    delay={0.8}
                    step={0.016}
                    className="max-w-md text-sm leading-6 text-ink-dim lg:text-right"
                />
            </div>

            <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {skills.groups.map((group, i) => (
                    <Reveal
                        key={group.title}
                        active={active}
                        delay={1.1 + i * 0.12}
                        y={24}
                    >
                        <div className="border-t border-line pt-4">
                            <h3 className="text-[0.95rem] font-medium tracking-[0.02em] text-accent">
                                {group.title}
                            </h3>
                            <ul className="mt-3 space-y-1.5">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="text-[0.85rem] leading-6 text-ink-dim"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal active={active} delay={2} className="mt-12">
                <ul className="flex flex-wrap gap-2">
                    {skills.stack.map((tool) => (
                        <li
                            key={tool}
                            className="rounded-full border border-line px-3.5 py-1.5 text-[0.72rem] tracking-[0.08em] text-ink-dim"
                        >
                            {tool}
                        </li>
                    ))}
                </ul>
            </Reveal>
        </div>
    );
}

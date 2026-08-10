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

            <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:gap-3 lg:flex-row lg:items-end lg:justify-between">
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
                    className="max-w-md text-[0.78rem] leading-5 text-ink-dim sm:max-w-lg sm:text-[0.98rem] sm:leading-7 lg:text-right"
                />
            </div>

            {/* На телефоне шесть блоков в одну колонку не помещаются —
                поэтому там сразу две */}
            <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-6 sm:mt-8 sm:gap-x-10 lg:grid-cols-3">
                {skills.groups.map((group, i) => (
                    <Reveal
                        key={group.title}
                        active={active}
                        delay={1.1 + i * 0.12}
                        y={24}
                    >
                        <div className="border-t border-line pt-3 sm:pt-4">
                            {/* Резервируем две строки: часть названий
                                переносится, и без этого списки в ряду
                                начинались бы на разной высоте */}
                            <h3 className="min-h-[2lh] text-[0.8rem] font-medium leading-5 tracking-[0.02em] text-accent sm:text-[1.06rem] sm:leading-6">
                                {group.title}
                            </h3>
                            <ul className="mt-2 space-y-1 sm:mt-3 sm:space-y-1.5">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="text-[0.7rem] leading-4 text-ink-dim sm:text-[0.95rem] sm:leading-6"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                ))}
            </div>

            <Reveal active={active} delay={2} className="mt-7 sm:mt-10">
                <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                    {skills.stack.map((tool) => (
                        <li
                            key={tool.label}
                            /* Акцентный тег берёт те же цвета, что и кнопка
                               формы, — отдельного стиля не заводим */
                            className={`rounded-full border px-2.5 py-1 text-[0.65rem] tracking-[0.06em] sm:px-4 sm:py-1.5 sm:text-[0.82rem] sm:tracking-[0.08em] ${
                                tool.accent
                                    ? "border-[rgba(127,210,240,0.45)] bg-[rgba(127,210,240,0.08)] text-accent"
                                    : "border-line text-ink-dim"
                            }`}
                        >
                            {tool.label}
                        </li>
                    ))}
                </ul>
            </Reveal>
        </div>
    );
}

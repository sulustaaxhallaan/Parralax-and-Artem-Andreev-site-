"use client";

import Link from "next/link";

import { contacts, footer, pricesLink } from "@/content/site";
import Icon from "../Icons";
import TypeLine from "../motion/TypeLine";
import RevealWords from "../motion/RevealWords";
import Reveal from "../motion/Reveal";

export default function Contacts({ active }: { active: boolean }) {
    return (
        <div className="w-full max-w-6xl px-6 sm:px-10">
            {/* Раньше секция была в две колонки: контакты и форма обратной
                связи. Формы больше нет, и вторая колонка вместе с ней —
                иначе содержимое прижималось бы к левой половине кадра.
                Блок закрывает сайт, поэтому стоит по центру. */}
            <div className="mx-auto max-w-xl">
                <div>
                    <Reveal active={active} y={14}>
                        <p className="eyebrow">{contacts.eyebrow}</p>
                    </Reveal>

                    <TypeLine
                        as="h2"
                        active={active}
                        text={contacts.title}
                        speed={55}
                        delay={200}
                        className="display mt-4 block text-[clamp(1.5rem,4.6vw,3.4rem)] sm:mt-5"
                    />

                    <RevealWords
                        active={active}
                        text={contacts.lead}
                        delay={1}
                        step={0.016}
                        className="mt-3 max-w-md text-[0.8rem] leading-5 text-ink-dim sm:mt-4 sm:text-[1.02rem] sm:leading-7"
                    />

                    <ul className="mt-5 space-y-2 sm:mt-8 sm:space-y-3">
                        {contacts.items.map((item, i) => (
                            <Reveal
                                key={item.id}
                                active={active}
                                delay={1.3 + i * 0.14}
                                y={16}
                            >
                                <li>
                                    <a
                                        href={item.href}
                                        target={
                                            item.href.startsWith("http")
                                                ? "_blank"
                                                : undefined
                                        }
                                        rel={
                                            item.href.startsWith("http")
                                                ? "noreferrer noopener"
                                                : undefined
                                        }
                                        className="group flex items-center gap-4 text-ink transition-colors duration-300 hover:text-accent"
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-dim transition-colors duration-300 group-hover:border-[rgba(127,210,240,0.5)] group-hover:text-accent">
                                            <Icon
                                                name={item.icon}
                                                className="h-[18px] w-[18px]"
                                            />
                                        </span>

                                        <span className="flex flex-col">
                                            <span className="text-[0.64rem] uppercase tracking-[0.24em] text-ink-faint sm:text-[0.73rem]">
                                                {item.label}
                                            </span>
                                            <span className="mt-0.5 text-[1rem] tracking-[0.04em] sm:text-[1.28rem]">
                                                {item.value}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            </Reveal>
                        ))}
                    </ul>

                    <Reveal active={active} delay={1.9} className="mt-5 sm:mt-8">
                        <ul className="flex items-center gap-3">
                            {contacts.socials.map((social) => (
                                <li key={social.id}>
                                    <a
                                        href={social.href}
                                        aria-label={social.label}
                                        title={social.label}
                                        target={
                                            social.href.startsWith("http")
                                                ? "_blank"
                                                : undefined
                                        }
                                        rel={
                                            social.href.startsWith("http")
                                                ? "noreferrer noopener"
                                                : undefined
                                        }
                                        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-dim transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(127,210,240,0.5)] hover:text-accent sm:h-11 sm:w-11"
                                    >
                                        <Icon name={social.icon} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </Reveal>

                    <Reveal active={active} delay={2.05} className="mt-5 sm:mt-8">
                        <Link
                            href={pricesLink.href}
                            className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(127,210,240,0.45)] px-5 py-2.5 text-[0.78rem] uppercase tracking-[0.2em] text-accent transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-[rgba(127,210,240,0.08)] sm:px-6 sm:py-3 sm:text-[0.86rem]"
                        >
                            <Icon name="price" className="h-[17px] w-[17px]" />
                            {pricesLink.label}
                        </Link>
                    </Reveal>

                    <Reveal active={active} delay={2.3} className="mt-5 sm:mt-8">
                        <p className="text-[0.68rem] tracking-[0.12em] text-ink-faint sm:text-[0.78rem]">
                            {footer.note}
                        </p>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}

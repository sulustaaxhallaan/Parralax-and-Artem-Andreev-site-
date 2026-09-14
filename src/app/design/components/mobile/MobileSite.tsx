import Image from "next/image";
import Link from "next/link";

import {
    about,
    cases,
    contacts,
    footer,
    hero,
    journey,
    pricesLink,
    process,
    results,
    skills,
} from "@/content/design/site";
import Icon from "../Icons";
import CasesCarousel from "./CasesCarousel";

/**
 * Портфолио на телефоне — обычная страница.
 *
 * Десктопная версия живёт в одном неподвижном кадре: секции проявляются
 * и гаснут по мере прокрутки, а каждая ужимается, чтобы поместиться в
 * экран целиком. На телефоне это не работало по трём причинам сразу.
 *
 * Прокрутка меняла прозрачность, а не положение, и казалось, что сайт
 * застрял. Восемь полноэкранных слоёв с подсказкой will-change держали
 * в памяти по 12 МБ каждый, и Safari убивал вкладку. А вписывание в
 * кадр давало в «Компетенциях» масштаб 0.76: заданные 15px превращались
 * в 11 и не читались.
 *
 * Поэтому здесь ничего этого нет. Секции идут друг за другом, текст
 * набран в свой размер, кейсы листаются каруселью. Компонент серверный:
 * состояние нужно только карусели и просмотрщику.
 */

export default function MobileSite() {
    return (
        <div className="relative">
            <PageBackground />

            <Hero />
            <About />
            <Skills />
            <Journey />

            <Section eyebrow={cases.eyebrow} title={cases.title} bleed>
                <p className="px-5 text-[0.9rem] leading-[1.7] text-ink-dim">
                    {cases.lead}
                </p>
                <div className="mt-7">
                    <CasesCarousel />
                </div>
            </Section>

            <Results />
            <Process />
            <Contacts />
        </div>
    );
}

/* Фон сцены рисует Background по прокрутке. Здесь прокрутка ничего не
   ведёт, поэтому фон статичный — он же дешевле для батареи. */
function PageBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10"
            style={{
                background:
                    "radial-gradient(circle at 78% 6%, rgba(34,211,238,0.10), transparent 22rem), radial-gradient(circle at 12% 46%, rgba(29,78,216,0.12), transparent 24rem), linear-gradient(160deg, #03060d 0%, #050b18 58%, #02050a 100%)",
            }}
        />
    );
}

/** Общая рамка секции: поля, отбивка и заголовок в одном месте */
function Section({
    eyebrow,
    title,
    children,
    bleed,
}: {
    eyebrow?: string;
    title?: string;
    children: React.ReactNode;
    /** содержимое идёт во всю ширину — поля задаёт оно само */
    bleed?: boolean;
}) {
    return (
        <section className="border-t border-line py-14">
            {(eyebrow || title) && (
                <header className="px-5">
                    {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
                    {title ? (
                        <h2 className="display display-wrap mt-3 text-[1.75rem]">
                            {title}
                        </h2>
                    ) : null}
                </header>
            )}

            <div className={`${eyebrow || title ? "mt-6" : ""} ${bleed ? "" : "px-5"}`}>
                {children}
            </div>
        </section>
    );
}

function Hero() {
    return (
        <section className="flex min-h-[88svh] flex-col justify-center px-5 py-16">
            <p className="eyebrow">{hero.name}</p>

            <h1 className="display display-wrap mt-5 text-[clamp(2rem,9vw,2.9rem)]">
                {hero.role}
            </h1>

            <p className="mt-3 text-[0.9rem] tracking-[0.18em] text-ink-dim">
                {hero.handle}
            </p>

            <div className="mt-7 h-px w-full bg-line" />

            <p className="mt-7 text-[1.02rem] leading-[1.75] text-ink">
                {hero.tagline}
            </p>

            <Link
                href={pricesLink.href}
                className="mt-9 inline-flex w-fit items-center gap-2.5 rounded-full border border-[rgba(127,210,240,0.45)] px-5 py-3 text-[0.78rem] uppercase tracking-[0.2em] text-accent"
            >
                <Icon name="price" className="h-[17px] w-[17px]" />
                {pricesLink.label}
            </Link>

            <p className="mt-10 text-[0.7rem] uppercase tracking-[0.3em] text-ink-faint">
                {hero.scrollHint} ↓
            </p>
        </section>
    );
}

function About() {
    return (
        <Section eyebrow={about.eyebrow} title={about.title}>
            <div className="space-y-4">
                {about.paragraphs.map((text, i) => (
                    <p key={i} className="text-[0.95rem] leading-[1.75] text-ink-dim">
                        {text}
                    </p>
                ))}
            </div>

            {/* На десктопе это наложенный коллаж. Здесь объекты разложены
                сеткой: в наложении на узком экране они читались бы кашей. */}
            <ul className="mt-8 grid grid-cols-2 gap-3">
                {about.mockups.map((item) => (
                    <li
                        key={item.id}
                        className="flex aspect-square items-center justify-center rounded-xl border border-line p-3"
                    >
                        <Image
                            src={item.src}
                            alt={item.alt}
                            width={item.w}
                            height={item.h}
                            sizes="45vw"
                            className="h-full w-full object-contain"
                        />
                    </li>
                ))}
            </ul>

            <h3 className="display mt-10 text-[0.85rem] tracking-[0.3em]">
                {about.approachTitle}
            </h3>

            <ul className="mt-4 space-y-3">
                {about.approach.map((item) => (
                    <li
                        key={item}
                        className="relative pl-5 text-[0.92rem] leading-[1.6] text-ink before:absolute before:left-0 before:top-[0.65em] before:h-px before:w-2.5 before:bg-accent"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </Section>
    );
}

function Skills() {
    return (
        <Section eyebrow={skills.eyebrow} title={skills.title}>
            <p className="text-[0.9rem] leading-[1.7] text-ink-dim">
                {skills.lead}
            </p>

            {/* Одна колонка вместо двух: в две группы вставали по 11px */}
            <div className="mt-8 space-y-7">
                {skills.groups.map((group) => (
                    <div key={group.title} className="border-t border-line pt-4">
                        <h3 className="text-[1rem] font-medium leading-6 text-accent">
                            {group.title}
                        </h3>
                        <ul className="mt-3 space-y-1.5">
                            {group.items.map((item) => (
                                <li
                                    key={item}
                                    className="text-[0.9rem] leading-[1.6] text-ink-dim"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <ul className="mt-9 flex flex-wrap gap-2">
                {skills.stack.map((tool) => (
                    <li
                        key={tool}
                        className="rounded-full border border-line px-3 py-1.5 text-[0.74rem] tracking-[0.06em] text-ink-dim"
                    >
                        {tool}
                    </li>
                ))}
            </ul>
        </Section>
    );
}

function Journey() {
    return (
        <Section eyebrow={journey.eyebrow} title={journey.title}>
            <p className="text-[0.9rem] leading-[1.7] text-ink-dim">
                {journey.lead}
            </p>

            <ol className="mt-8 space-y-8">
                {journey.steps.map((step) => (
                    <li
                        key={step.company}
                        className="relative border-l border-line pl-5"
                    >
                        <span
                            aria-hidden
                            className="absolute -left-[3px] top-2 h-1.5 w-1.5 rounded-full bg-accent"
                        />
                        <span className="text-[0.76rem] uppercase tracking-[0.22em] text-ink-faint">
                            {step.date}
                        </span>
                        <h3 className="mt-2 text-[1rem] font-medium leading-6 text-accent">
                            {step.company}
                        </h3>
                        <p className="mt-1 text-[0.88rem] leading-6 text-ink-dim">
                            {step.position}
                        </p>
                        <ul className="mt-3 space-y-2">
                            {step.points.map((point) => (
                                <li
                                    key={point}
                                    className="text-[0.86rem] leading-[1.65] text-ink-faint"
                                >
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ol>
        </Section>
    );
}

function Results() {
    return (
        <Section title={results.title}>
            <ul className="space-y-6">
                {results.items.map((item) => (
                    <li key={item.label} className="border-t border-line pt-4">
                        <span className="text-[0.78rem] leading-5 text-ink-faint">
                            {item.prefix}
                        </span>
                        <span className="display mt-1 block text-[2.4rem] leading-none">
                            {item.value}
                        </span>
                        <span className="mt-2 block text-[0.92rem] leading-6 text-ink-dim">
                            {item.label}
                        </span>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

function Process() {
    return (
        <Section eyebrow={process.eyebrow} title={process.title}>
            <ol className="space-y-7">
                {process.steps.map((step, i) => (
                    <li key={step.title} className="border-t border-line pt-4">
                        <span className="display text-[0.8rem] tracking-[0.2em]">
                            {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-2 text-[1rem] font-medium leading-6 text-accent">
                            {step.title}
                        </h3>
                        <p className="mt-2 text-[0.9rem] leading-[1.7] text-ink-dim">
                            {step.text}
                        </p>
                    </li>
                ))}
            </ol>

            <p className="mt-8 text-[0.92rem] leading-[1.7] text-accent">
                {process.promise}
            </p>
        </Section>
    );
}

function Contacts() {
    return (
        <Section eyebrow={contacts.eyebrow} title={contacts.title}>
            <p className="text-[0.92rem] leading-[1.7] text-ink-dim">
                {contacts.lead}
            </p>

            <ul className="mt-7 space-y-3">
                {contacts.items.map((item) => (
                    <li key={item.id}>
                        <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={
                                item.href.startsWith("http")
                                    ? "noreferrer noopener"
                                    : undefined
                            }
                            className="flex items-center gap-4 text-ink"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-dim">
                                <Icon name={item.icon} className="h-[18px] w-[18px]" />
                            </span>
                            <span className="flex min-w-0 flex-col">
                                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-ink-faint">
                                    {item.label}
                                </span>
                                <span className="mt-0.5 truncate text-[1rem] tracking-[0.03em]">
                                    {item.value}
                                </span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>

            <Link
                href={pricesLink.href}
                className="mt-8 inline-flex w-fit items-center gap-2.5 rounded-full border border-[rgba(127,210,240,0.45)] px-5 py-3 text-[0.78rem] uppercase tracking-[0.2em] text-accent"
            >
                <Icon name="price" className="h-[17px] w-[17px]" />
                {pricesLink.label}
            </Link>

            <ul className="mt-8 flex flex-wrap gap-3">
                {contacts.socials.map((social) => (
                    <li key={social.id}>
                        <a
                            href={social.href}
                            aria-label={social.label}
                            title={social.label}
                            target={
                                social.href.startsWith("http") ? "_blank" : undefined
                            }
                            rel={
                                social.href.startsWith("http")
                                    ? "noreferrer noopener"
                                    : undefined
                            }
                            className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-ink-dim"
                        >
                            <Icon name={social.icon} />
                        </a>
                    </li>
                ))}
            </ul>

            {/* Запас снизу под плавающую панель связи */}
            <p className="mt-10 pb-20 text-[0.72rem] leading-5 tracking-[0.1em] text-ink-faint">
                {footer.note}
            </p>
        </Section>
    );
}

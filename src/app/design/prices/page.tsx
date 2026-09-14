import type { Metadata } from "next";
import Link from "next/link";

import { contacts } from "@/content/design/site";
import {
    priceCategories,
    priceContact,
    priceFaq,
    priceTerms,
    pricesPage,
    type PriceService,
} from "@/content/design/prices";
import Icon from "../components/Icons";

export const metadata: Metadata = {
    title: "Прайс на дизайн — Артём Андреев",
    description:
        "Цены на услуги графического дизайнера Артёма Андреева: полиграфия, брендинг, наружная реклама, digital, веб-дизайн и оформление мероприятий. Сроки, включённые правки и условия срочности.",
    openGraph: {
        title: "Прайс на дизайн — Артём Андреев",
        description:
            "Услуги, цены, сроки и правки — от разовых макетов до полной визуальной системы бренда.",
        type: "website",
        locale: "ru_RU",
    },
};

/* Портфолио живёт в одном неподвижном кадре, а прайс — обычная длинная
   страница: со своей прокруткой, липкой шапкой и якорями по категориям.
   Поэтому это отдельный маршрут, а не девятая секция сцены. */

export default function PricesPage() {
    return (
        <div className="prices-root relative min-h-screen">
            <PageBackground />
            <Topbar />

            <main id="top">
                <Hero />
                <Terms />
                <CategoryNav />

                <div className="shell pb-20 pt-7">
                    {priceCategories.map((category, i) => (
                        <section
                            key={category.slug}
                            id={category.slug}
                            aria-labelledby={`${category.slug}-title`}
                            className="grid gap-7 border-b border-line py-12 lg:grid-cols-[minmax(180px,0.34fr)_minmax(0,1fr)] lg:gap-[clamp(26px,5vw,70px)]"
                        >
                            <header className="@container lg:sticky lg:top-[9rem] lg:self-start">
                                <span className="display block text-[0.76rem] tracking-[0.14em] text-accent">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                {/* Кегль от ширины колонки (cqw), а не окна.
                                    «СОПРОВОЖДЕНИЕ» — одно слово шириной
                                    в 12 кеглей, и от ширины окна оно
                                    вылезало из колонки на услуги. */}
                                <h2
                                    id={`${category.slug}-title`}
                                    className="display display-wrap mt-2.5 text-[1.3rem] uppercase sm:text-[1.45rem] lg:text-[clamp(1.3rem,8cqw,2.2rem)]"
                                >
                                    {category.name}
                                </h2>
                                <span className="mt-2.5 block text-[0.86rem] text-ink-faint">
                                    {category.services.length}{" "}
                                    {pluralServices(category.services.length)}
                                </span>

                                {category.note ? (
                                    <p className="mt-4 border-l border-[rgba(127,210,240,0.34)] pl-3.5 text-[0.82rem] leading-[1.7] text-ink-faint sm:text-[0.86rem]">
                                        {category.note}
                                    </p>
                                ) : null}
                            </header>

                            <div className="border-t border-line">
                                {category.services.map((service) => (
                                    <Service key={service.title} service={service} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <Faq />
                <Contact />
            </main>

            <footer className="shell flex flex-col gap-1.5 pb-9 text-[0.82rem] text-ink-faint sm:flex-row sm:justify-between">
                <span>Артём Андреев · графический дизайнер</span>
                <span>Финальная стоимость зависит от задачи</span>
            </footer>
        </div>
    );
}

/** «4 услуги», «7 услуг», «1 услуга» */
function pluralServices(n: number) {
    if (n === 1) return "услуга";
    return n < 5 ? "услуги" : "услуг";
}

/* Фон сцены рисует компонент Background, но он живёт внутри портфолио.
   Здесь свой — те же свечения и сетка, только статичные. */
function PageBackground() {
    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10"
            style={{
                background:
                    "radial-gradient(circle at 82% 4%, rgba(34,211,238,0.10), transparent 26rem), radial-gradient(circle at 15% 40%, rgba(28,117,180,0.08), transparent 30rem), linear-gradient(145deg, #03060d 0%, #050b18 55%, #02050a 100%)",
            }}
        >
            <div
                className="absolute inset-0 opacity-[0.28]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(127,210,240,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(127,210,240,0.04) 1px, transparent 1px)",
                    backgroundSize: "72px 72px",
                    maskImage: "linear-gradient(to bottom, black, transparent 72%)",
                    WebkitMaskImage:
                        "linear-gradient(to bottom, black, transparent 72%)",
                }}
            />
        </div>
    );
}

function Topbar() {
    return (
        <header className="sticky top-0 z-20 border-b border-line bg-[rgba(3,6,13,0.82)] backdrop-blur-lg">
            <div className="shell flex min-h-[4.375rem] items-center justify-between gap-5">
                {/* Ссылка ведёт на портфолио: прайс открывают оттуда,
                    но на него может прийти и прямая ссылка */}
                <Link
                    href="/design"
                    className="group flex items-center gap-3 text-ink transition-colors duration-300 hover:text-accent"
                >
                    <span className="display grid h-[34px] w-[34px] place-items-center rounded-full border border-[rgba(127,210,240,0.34)] text-[0.75rem] tracking-[0.08em] text-accent">
                        AA
                    </span>
                    <span className="display text-[0.8rem] uppercase tracking-[0.13em] sm:text-[0.92rem]">
                        {pricesPage.backToSite}
                    </span>
                </Link>

                <a
                    href="#contact"
                    className="rounded-full border border-[rgba(127,210,240,0.34)] px-3.5 py-2 text-[0.82rem] text-accent transition-colors duration-300 hover:border-accent hover:bg-[rgba(127,210,240,0.07)] sm:text-[0.9rem]"
                >
                    Обсудить задачу
                </a>
            </div>
        </header>
    );
}

function Hero() {
    return (
        <section className="border-b border-line py-[clamp(30px,4vw,52px)]">
            <div className="shell grid items-end gap-9 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] lg:gap-[clamp(34px,7vw,86px)]">
                <div>
                    <p className="eyebrow">{pricesPage.eyebrow}</p>
                    {/* display-wrap, а не leading-*: на телефоне заголовок
                        ложится в две строки, а .display держит 0.95 и
                        перебивает утилиты — строки наезжали бы друг на друга */}
                    <h1 className="display display-wrap mt-4 max-w-[760px] text-[clamp(1.85rem,5vw,4.2rem)] uppercase">
                        {pricesPage.title}
                    </h1>
                    <p className="mt-5 max-w-[640px] text-[clamp(0.9rem,1.4vw,1.13rem)] leading-relaxed text-ink-dim">
                        {pricesPage.lead}
                    </p>
                </div>

                <aside className="glass rounded-[18px] p-5 sm:p-6">
                    <strong className="display block text-[0.82rem] uppercase tracking-[0.1em] text-accent">
                        {pricesPage.howToRead.title}
                    </strong>
                    <p className="mt-2.5 text-[0.85rem] leading-[1.65] text-ink-faint sm:text-[0.92rem] sm:leading-6">
                        {pricesPage.howToRead.text}
                    </p>
                </aside>
            </div>
        </section>
    );
}

function Terms() {
    return (
        <section className="shell py-7" aria-labelledby="terms-title">
            <h2 id="terms-title" className="display display-wrap text-[1.05rem] sm:text-[1.15rem]">
                {priceTerms.title}
            </h2>

            <div className="mt-4 grid gap-5 md:grid-cols-3">
                {priceTerms.items.map((item) => (
                    <div
                        key={item.title}
                        className="border-l border-[rgba(127,210,240,0.34)] pl-4"
                    >
                        <h3 className="text-[0.95rem] font-medium text-accent sm:text-[1rem]">
                            {item.title}
                        </h3>
                        <p className="mt-2 text-[0.88rem] leading-[1.7] text-ink-faint sm:text-[1rem] sm:leading-6">
                            {item.text}
                        </p>

                        {item.more ? (
                            <Disclosure summary={item.more.summary}>
                                <p className="mt-3 text-[0.82rem] leading-[1.65] text-ink-faint sm:text-[0.9rem] sm:leading-6">
                                    {item.more.text}
                                </p>
                            </Disclosure>
                        ) : null}
                    </div>
                ))}
            </div>

            <p className="mt-5 text-[0.82rem] leading-[1.65] text-ink-faint sm:text-[0.9rem] sm:leading-6">
                {pricesPage.footnote}
            </p>
        </section>
    );
}

function CategoryNav() {
    return (
        <nav
            aria-label="Категории услуг"
            className="sticky top-[4.375rem] z-10 border-y border-line bg-[rgba(3,6,13,0.88)] backdrop-blur-lg"
        >
            <div className="shell no-scrollbar flex gap-2 overflow-x-auto py-3">
                {priceCategories.map((category) => (
                    <a
                        key={category.slug}
                        href={`#${category.slug}`}
                        className="flex-none whitespace-nowrap rounded-full border border-transparent px-3 py-2 text-[0.86rem] text-ink-faint transition-colors duration-200 hover:border-[rgba(127,210,240,0.34)] hover:bg-[rgba(127,210,240,0.05)] hover:text-accent"
                    >
                        {category.name}
                    </a>
                ))}
                <a
                    href="#faq"
                    className="flex-none whitespace-nowrap rounded-full border border-transparent px-3 py-2 text-[0.86rem] text-ink-faint transition-colors duration-200 hover:border-[rgba(127,210,240,0.34)] hover:bg-[rgba(127,210,240,0.05)] hover:text-accent"
                >
                    {priceFaq.title}
                </a>
            </div>
        </nav>
    );
}

function Service({ service }: { service: PriceService }) {
    /* Длинный состав прячем под раскрытие, короткую оговорку показываем
       сразу — иначе ради одной строки пришлось бы кликать. */
    const details = service.details ?? [];
    const collapse = details.length >= 3 || details.join(" ").length > 300;
    const tiers = service.price.split(" · ");

    /* Две колонки — только с 1024px. Раньше делили с 640, но колонка
       цены широкая, и на планшете описанию оставалось 276px. До 1024
       цена просто идёт под описанием, там ей места вдоволь.

       Дальше ширина цены растёт ступенями вместе с колонкой страницы:
       240px хватает самой длинной строке тарифа, на широком экране
       добавляем воздуха ступенчатым ценам. */
    return (
        <article className="grid gap-3.5 border-b border-line py-5 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.32fr)] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.32fr)] [@media(min-width:1600px)]:grid-cols-[minmax(0,1fr)_minmax(340px,0.3fr)]">
            <div className="min-w-0">
                <h3 className="text-[0.95rem] font-medium leading-normal text-ink sm:text-[1.08rem] sm:leading-snug">
                    {service.title}
                </h3>
                <p className="mt-1.5 max-w-[720px] text-[0.88rem] leading-[1.7] text-ink-faint sm:text-[1rem] sm:leading-relaxed">
                    {service.description}
                </p>

                <dl className="mt-3.5 text-[0.82rem] sm:text-[0.9rem]">
                    <div className="mt-1 flex flex-wrap gap-x-2">
                        <dt className="text-ink-faint">Срок:</dt>
                        <dd className="m-0 text-accent">{service.deadline}</dd>
                    </div>
                    {/* У брендинга правок в прайсе нет — почему,
                        сказано в пояснении под названием категории */}
                    {service.revisions ? (
                        <div className="mt-1 flex flex-wrap gap-x-2">
                            <dt className="text-ink-faint">Включённые правки:</dt>
                            <dd className="m-0 text-accent">
                                {service.revisions}
                            </dd>
                        </div>
                    ) : null}
                </dl>

                {details.length > 0 &&
                    (collapse ? (
                        <Disclosure summary="Состав и условия">
                            <ul className="mt-3.5 grid gap-2.5 text-[0.82rem] leading-[1.6] text-ink-faint sm:gap-1.5 sm:text-[0.9rem]">
                                {details.map((item) => (
                                    <li key={item} className="relative pl-4">
                                        <span
                                            aria-hidden
                                            className="absolute left-0 top-[0.66em] h-[5px] w-[5px] rounded-full bg-[#22d3ee] shadow-[0_0_9px_rgba(34,211,238,0.55)]"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Disclosure>
                    ) : (
                        <p className="mt-3 max-w-[720px] text-[0.88rem] leading-[1.7] text-ink-faint sm:text-[1rem] sm:leading-relaxed">
                            {details.join(" ")}
                        </p>
                    ))}
            </div>

            <div className="lg:text-right">
                {/* Ступенчатые цены записаны через «·». Каждая ступень —
                    своей строкой: иначе строка рвётся где придётся,
                    посреди суммы или перед «₽/шт».

                    Список ступеней набираем мельче одиночной цены и с
                    заметным просветом между строками. Одиночная цена —
                    это число, на которое смотрят; ступени — маленькая
                    таблица, и тем же крупным кеглем они слипались
                    в плотный блок. */}
                {/* Интервал задаём просветом, а не leading-*: класс
                    .display держит line-height 0.95 и объявлен вне
                    слоёв Tailwind, поэтому перебивает любую утилиту. */}
                {tiers.length > 1 ? (
                    <span className="display flex flex-col gap-3.5 text-[clamp(0.95rem,1.35vw,1.15rem)] text-accent">
                        {tiers.map((tier) => (
                            <span key={tier}>{tier}</span>
                        ))}
                    </span>
                ) : (
                    <span className="display block text-[clamp(1.05rem,1.7vw,1.35rem)] leading-tight text-accent">
                        {service.price}
                    </span>
                )}
                {priceNote(service) ? (
                    <span className="mt-1.5 inline-block text-[0.76rem] uppercase tracking-[0.06em] text-ink-faint">
                        {priceNote(service)}
                    </span>
                ) : null}
            </div>
        </article>
    );
}

/** Подпись под ценой. У «от» она ничего не добавляет — там и так «от». */
function priceNote(service: PriceService) {
    if (service.kind === "Фиксированная") {
        return service.price.startsWith("от ")
            ? "Фиксированный объём"
            : "Фиксированная цена";
    }
    if (service.kind === "Индивидуально" && service.price !== "Индивидуально") {
        return "Индивидуальный расчёт";
    }
    return null;
}

function Faq() {
    return (
        <section
            id="faq"
            aria-labelledby="faq-title"
            className="shell grid gap-7 border-b border-line pb-12 pt-6 lg:grid-cols-[minmax(180px,0.34fr)_minmax(0,1fr)] lg:gap-[clamp(26px,5vw,70px)]"
        >
            {/* Тот же расчёт кегля, что у заголовков категорий, — иначе
                на широком экране он выбивался бы из ряда */}
            <header className="@container">
                <p className="eyebrow">{priceFaq.eyebrow}</p>
                <h2
                    id="faq-title"
                    className="display display-wrap mt-2 text-[1.3rem] uppercase sm:text-[1.45rem] lg:text-[clamp(1.3rem,8cqw,2.2rem)]"
                >
                    {priceFaq.title}
                </h2>
            </header>

            <div className="min-w-0 border-t border-line">
                {priceFaq.items.map((item) => (
                    <details
                        key={item.question}
                        className="group border-b border-line"
                    >
                        <summary className="flex w-full cursor-pointer list-none items-baseline justify-between gap-5 py-4 text-[0.95rem] font-medium leading-normal text-ink sm:py-5 sm:text-[1.08rem] sm:leading-snug transition-colors duration-200 group-open:text-accent [&::-webkit-details-marker]:hidden">
                            {item.question}
                            <span aria-hidden className="flex-none text-accent">
                                <span className="group-open:hidden">+</span>
                                <span className="hidden group-open:inline">−</span>
                            </span>
                        </summary>
                        <div className="pb-5 pr-2 text-[0.88rem] leading-[1.7] text-ink-faint sm:pr-7 sm:text-[1rem] sm:leading-relaxed">
                            {item.answer.map((p, i) => (
                                <p key={i} className={i > 0 ? "mt-3" : undefined}>
                                    {p}
                                </p>
                            ))}
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}

function Contact() {
    return (
        <section id="contact" aria-labelledby="contact-title" className="py-16">
            <div className="shell">
                <div className="glass relative overflow-hidden rounded-[24px] p-[clamp(28px,6vw,62px)]">
                    <div className="relative z-10 max-w-[780px]">
                        <p className="eyebrow">{priceContact.eyebrow}</p>
                        <h2
                            id="contact-title"
                            className="display mt-3 text-[clamp(2rem,5vw,4.5rem)] uppercase leading-none"
                        >
                            {priceContact.title}
                        </h2>
                        <p className="mt-4 max-w-[620px] text-[0.9rem] leading-[1.7] text-ink-dim sm:text-[1rem] sm:leading-relaxed">
                            {priceContact.text}
                        </p>

                        <ul className="mt-7 flex flex-wrap gap-2.5">
                            {contacts.quick.map((item) => (
                                <li key={item.id}>
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
                                        className="flex min-h-[44px] items-center gap-2.5 rounded-[10px] border border-[rgba(127,210,240,0.34)] bg-[rgba(127,210,240,0.04)] px-4 py-2.5 text-accent transition-all duration-300 hover:-translate-y-px hover:border-accent hover:bg-[rgba(127,210,240,0.08)]"
                                    >
                                        <Icon
                                            name={item.icon}
                                            className="h-[18px] w-[18px]"
                                        />
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}

/** Раскрывающийся блок в стиле страницы: «+» / «−» вместо треугольника. */
function Disclosure({
    summary,
    children,
}: {
    summary: string;
    children: React.ReactNode;
}) {
    return (
        <details className="group mt-3">
            <summary className="w-fit cursor-pointer list-none text-[0.87rem] text-accent [&::-webkit-details-marker]:hidden">
                {summary}
                <span aria-hidden className="text-ink-faint">
                    <span className="group-open:hidden"> +</span>
                    <span className="hidden group-open:inline"> −</span>
                </span>
            </summary>
            {children}
        </details>
    );
}

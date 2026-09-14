import Link from "next/link";

/* Развилка на входе. Своей палитры у неё нет — берёт значения по
   умолчанию из :root, чтобы не принадлежать ни одному из сайтов. */

const ROUTES = [
    {
        href: "/design",
        eyebrow: "Направление 01",
        title: "Графический дизайн",
        lead: "Брендинг, наружная реклама, полиграфия и дизайн-код. Визуальная среда, которую ежедневно видят тысячи людей.",
        items: ["Логотипы и фирменный стиль", "Вывески и городская среда", "Полиграфия и производство"],
    },
    {
        href: "/web",
        eyebrow: "Направление 02",
        title: "Parralax Art",
        lead: "Сайты со скролл-анимациями. Не шаблон, а живое интерактивное присутствие бизнеса в сети.",
        items: ["Индивидуальный дизайн", "Скролл-анимации", "Рабочий прототип вместо картинки"],
    },
];

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden">
            {/* Фон развилки: те же свечения, что у обоих сайтов, но ровно
                посередине по настроению — ни холоднее, ни теплее */}
            <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(circle at 20% 12%, rgba(34,211,238,0.10), transparent 28rem), radial-gradient(circle at 82% 78%, rgba(47,155,255,0.10), transparent 32rem), linear-gradient(150deg, #03060d 0%, #050b18 55%, #02050a 100%)",
                }}
            />

            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10">
                <header className="max-w-2xl">
                    <p className="text-[0.7rem] uppercase tracking-[0.42em] text-ink-faint sm:text-[0.78rem]">
                        Артём Андреев
                    </p>
                    <h1 className="mt-4 text-[clamp(1.7rem,4.5vw,3.2rem)] font-light leading-tight text-ink">
                        Графический дизайн и сайты
                    </h1>
                    <p className="mt-4 text-[0.95rem] leading-[1.7] text-ink-dim sm:text-[1.05rem]">
                        Два направления работы. Выберите, что вам нужно, —
                        каждое живёт своим сайтом.
                    </p>
                </header>

                <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-2">
                    {ROUTES.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className="group flex flex-col rounded-2xl border border-line bg-[rgba(10,21,38,0.5)] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(127,210,240,0.55)] hover:bg-[rgba(12,29,49,0.6)] sm:p-8"
                        >
                            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-accent sm:text-[0.74rem]">
                                {route.eyebrow}
                            </p>

                            <h2 className="mt-3 text-[clamp(1.35rem,3vw,2rem)] font-light leading-tight text-ink">
                                {route.title}
                            </h2>

                            <p className="mt-3 text-[0.88rem] leading-[1.7] text-ink-dim sm:text-[0.95rem]">
                                {route.lead}
                            </p>

                            <ul className="mt-5 grid gap-2 text-[0.82rem] text-ink-faint sm:text-[0.88rem]">
                                {route.items.map((item) => (
                                    <li key={item} className="relative pl-4">
                                        <span
                                            aria-hidden
                                            className="absolute left-0 top-[0.62em] h-[5px] w-[5px] rounded-full bg-accent"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <span className="mt-6 inline-flex items-center gap-2 text-[0.78rem] uppercase tracking-[0.2em] text-accent transition-transform duration-300 group-hover:translate-x-1 sm:mt-8 sm:text-[0.84rem]">
                                Смотреть
                                <span aria-hidden>→</span>
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}

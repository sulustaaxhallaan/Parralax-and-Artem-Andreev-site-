import Image from "next/image";
import Link from "next/link";

/* Развилка на входе.
   Каждая половина обёрнута в скоуп своего сайта — .site-design и
   .site-web, — поэтому берёт его настоящую палитру, шрифты и .display.
   Человек видит язык сайта ещё до перехода, а не два одинаковых
   прямоугольника с разным текстом.

   На телефоне половины ложатся друг под друга, каждая в полэкрана. */

export default function Home() {
    return (
        <main className="flex min-h-[100svh] flex-col lg:h-[100svh] lg:flex-row lg:overflow-hidden">
            {/* Имя поверх обеих половин: общее для сайтов, поэтому
                не принадлежит ни одному из скоупов */}
            <p className="pointer-events-none absolute left-1/2 top-5 z-20 -translate-x-1/2 text-[0.6rem] uppercase tracking-[0.42em] text-ink-faint sm:top-7 sm:text-[0.7rem]">
                Артём Андреев
            </p>

            <Half
                href="/design"
                scope="site-design"
                title="Графический дизайн"
                lead="Брендинг, наружная реклама, полиграфия и дизайн-код"
            />

            <Half
                href="/web"
                scope="site-web"
                title="Parralax Art"
                lead="Сайты со скролл-анимациями"
                image="/images/space/planets.webp"
            />
        </main>
    );
}

function Half({
    href,
    scope,
    title,
    lead,
    image,
}: {
    href: string;
    scope: "site-design" | "site-web";
    title: string;
    lead: string;
    image?: string;
}) {
    const design = scope === "site-design";

    return (
        <Link
            href={href}
            className={`${scope} group relative flex min-h-[50svh] flex-1 items-end overflow-hidden border-line transition-[flex-grow] duration-500 ease-out lg:min-h-0 lg:items-center lg:hover:grow-[1.35] ${
                design ? "border-b lg:border-b-0 lg:border-r" : ""
            }`}
        >
            {/* Фон половины. У портфолио — его холодное свечение,
                у Parralax — настоящий кадр с его же сайта. */}
            {image ? (
                <>
                    <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(3,5,12,0.55),rgba(1,2,6,0.88))]" />
                </>
            ) : (
                <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{
                        background:
                            "radial-gradient(circle at 30% 25%, rgba(34,211,238,0.16), transparent 26rem), radial-gradient(circle at 78% 82%, rgba(29,78,216,0.20), transparent 30rem), linear-gradient(150deg, #03060d 0%, #050b18 60%, #02050a 100%)",
                    }}
                />
            )}

            {/* Диагональная штриховка — тот же приём, что на фоне
                портфолио: связывает развилку с сайтами */}
            <div
                aria-hidden
                className="absolute inset-0 opacity-[0.22]"
                style={{
                    backgroundImage:
                        "linear-gradient(115deg, transparent 0 48%, rgba(127,210,240,0.35) 48% calc(48% + 1px), transparent calc(48% + 1px) 100%)",
                    backgroundSize: "190px 190px",
                }}
            />

            <div className="relative z-10 w-full px-7 py-14 sm:px-12 lg:px-14 lg:py-0">
                <p className="eyebrow">
                    {design ? "Направление 01" : "Направление 02"}
                </p>

                <h2
                    className={`display mt-4 text-[clamp(1.9rem,6.5vw,3.6rem)] lg:text-[clamp(2rem,3.4vw,4rem)] ${
                        design ? "display-wrap" : ""
                    }`}
                >
                    {title}
                </h2>

                <p className="mt-4 max-w-[30ch] text-[0.9rem] leading-[1.7] text-ink-dim sm:text-[1rem]">
                    {lead}
                </p>

                <span className="mt-7 inline-flex items-center gap-2.5 border-b border-[color:var(--accent)] pb-1 text-[0.72rem] uppercase tracking-[0.24em] text-accent transition-all duration-300 group-hover:gap-4 sm:mt-9 sm:text-[0.8rem]">
                    Смотреть
                    <span aria-hidden>→</span>
                </span>
            </div>
        </Link>
    );
}

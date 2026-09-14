import type { Metadata, Viewport } from "next";

/* Обёртка .site-web включает космическую палитру и шрифты Parralax —
   см. globals.css. Своя themeColor: фон у сайтов чуть разный. */

export const metadata: Metadata = {
    title: "PARRALAX ART — сайты, которые запоминаются",
    description:
        "Создайте уникальный сайт, который воплощает вашу идею в жизнь. Индивидуальный дизайн, скролл-анимации и рабочий прототип вместо картинки — от 30 000 рублей.",
    openGraph: {
        title: "PARRALAX ART — сайты, которые запоминаются",
        description:
            "Не шаблон, а живое интерактивное присутствие вашего бизнеса в сети.",
        type: "website",
        locale: "ru_RU",
    },
};

export const viewport: Viewport = {
    themeColor: "#03050c",
};

export default function WebLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <div className="site-web">{children}</div>;
}

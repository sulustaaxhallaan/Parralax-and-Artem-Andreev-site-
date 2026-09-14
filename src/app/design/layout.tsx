import type { Metadata } from "next";

/* Обёртка .site-design включает палитру и шрифты портфолио: токены,
   .display, .eyebrow, .shell и .glass объявлены под ней в globals.css.
   Без неё разметка возьмёт значения по умолчанию из :root. */

export const metadata: Metadata = {
    title: "Артём Андреев — графический дизайнер",
    description:
        "Портфолио графического дизайнера Артёма Андреева: брендинг, наружная реклама, полиграфия и дизайн-код. Я создаю визуальную среду, которую ежедневно видят тысячи людей.",
    openGraph: {
        title: "Артём Андреев — графический дизайнер",
        description:
            "Брендинг, наружная реклама, полиграфия и дизайн-код. Путь дизайнера по годам — с 2018 до сегодня.",
        type: "website",
        locale: "ru_RU",
    },
};

export default function DesignLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <div className="site-design">{children}</div>;
}

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";

import "./globals.css";

/* Шрифты обоих сайтов грузит корневой layout: переменные должны быть
   объявлены на <html>, иначе до вложенных маршрутов они не дойдут.
   Какой из них считается основным — решает обёртка сайта в globals.css
   через --font-site-display и --font-site-sans. */

// Портфолио: заголовки
const kharkiv = localFont({
    src: "../fonts/kharkiv.ttf",
    variable: "--font-kharkiv",
    display: "swap",
});

// Портфолио: основной текст
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

// Parralax: заголовки. Взята кириллическая версия Bebas Neue:
// в обычной Bebas-Regular.otf кириллицы нет вообще, и весь русский
// текст на ней рассыпался бы на подстановочные глифы.
const bebas = localFont({
    src: "../fonts/BebasNeueCyrillic.ttf",
    variable: "--font-bebas",
    display: "swap",
});

// Parralax: основной текст. У Avante полная кириллица, но нет знака ₽ —
// поэтому цены на том сайте написаны словом, как и в макете.
const avante = localFont({
    src: "../fonts/Avante.ttf",
    variable: "--font-body",
    display: "swap",
});

/* Метаданные корня описывают экран выбора. У каждого сайта свои —
   они заданы в его собственном layout и перекрывают эти. */
export const metadata: Metadata = {
    title: "Артём Андреев — графический дизайн и сайты",
    description:
        "Два направления работы: графический дизайн — брендинг, наружная реклама и полиграфия; Parralax Art — сайты со скролл-анимациями.",
    openGraph: {
        title: "Артём Андреев — графический дизайн и сайты",
        description:
            "Графический дизайн и разработка сайтов. Выберите направление.",
        type: "website",
        locale: "ru_RU",
    },
};

export const viewport: Viewport = {
    themeColor: "#03060d",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="ru"
            className={`${kharkiv.variable} ${geistSans.variable} ${bebas.variable} ${avante.variable} antialiased`}
        >
            <body>{children}</body>
        </html>
    );
}

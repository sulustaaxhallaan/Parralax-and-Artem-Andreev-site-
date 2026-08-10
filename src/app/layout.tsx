import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";

import "./globals.css";

const kharkiv = localFont({
    src: "../fonts/kharkiv.ttf",
    variable: "--font-kharkiv",
    display: "swap",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

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

export const viewport: Viewport = {
    themeColor: "#03060d",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="ru"
            className={`${kharkiv.variable} ${geistSans.variable} antialiased`}
        >
            <body>{children}</body>
        </html>
    );
}

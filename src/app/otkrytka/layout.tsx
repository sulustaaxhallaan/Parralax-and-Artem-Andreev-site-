import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";

/* Открытка ко Дню отца (Россия) и Дню матери (Якутия) — оба праздника
   в третье воскресенье октября. Все надписи на якутском взяты из макета
   автора кривыми: у шрифтов макета нет части якутских букв. Montserrat
   нужен только для служебных подписей на русском. */

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin", "cyrillic"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "С Днём отца и Днём матери — открытка",
    description:
        "Интерактивная открытка ко Дню отца и якутскому Дню матери: две равные половины одной семьи. Рисунки и обереги — авторские.",
    openGraph: {
        title: "Ийэ уонна аҕа — дьиэ кэргэн икки кынаттара",
        description:
            "Открытка ко Дню отца и Дню матери в Якутии. Коснитесь, чтобы соединить.",
        type: "website",
        locale: "ru_RU",
    },
};

export const viewport: Viewport = {
    themeColor: "#663399",
};

export default function CardLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <div className={montserrat.variable}>{children}</div>;
}

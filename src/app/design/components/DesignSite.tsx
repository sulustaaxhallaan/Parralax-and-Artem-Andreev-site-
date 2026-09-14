"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import { useMediaQuery } from "@/lib/useMediaQuery";

/* Сцена — весь десктопный портфолио: слои, Framer Motion, вписывание
   секций в кадр. На телефон её код не отправляем вовсе. */
const Stage = dynamic(() => import("./Stage"), { ssr: false });

/**
 * Выбор версии портфолио по ширине окна.
 *
 * Мобильная разметка приходит пропом, то есть отрисована на сервере:
 * телефон получает готовую страницу, а не ждёт гидратации. Порог тот
 * же, что у lg в Tailwind, и совпадает с порогом, по которому на
 * телефоне скрыта поворотная фигура.
 */
export default function DesignSite({ mobile }: { mobile: ReactNode }) {
    const wide = useMediaQuery("(min-width: 1024px)");

    return wide ? <Stage /> : <>{mobile}</>;
}

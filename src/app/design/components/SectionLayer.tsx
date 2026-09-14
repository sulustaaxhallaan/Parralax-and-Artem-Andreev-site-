"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

import type { SectionWindow } from "@/lib/stage";

type Props = {
    /** прокрутка в экранах */
    progress: MotionValue<number>;
    win: SectionWindow;
    z: number;
    children: ReactNode;
};

/**
 * Один «слой» сайта.
 *
 * Все секции лежат друг на друге в общем неподвижном кадре: слой
 * проявляется, держится нужное время полностью видимым и гаснет,
 * пока следующий уже начинает проступать. Фон при этом не меняется.
 */
export default function SectionLayer({ progress, win, z, children }: Props) {
    const { start, holdStart, holdEnd, end, isFirst, isLast } = win;
    const stops = [start, holdStart, holdEnd, end];

    const opacity = useTransform(progress, stops, [
        isFirst ? 1 : 0,
        1,
        1,
        isLast ? 1 : 0,
    ]);

    const y = useTransform(progress, stops, [
        isFirst ? 0 : 46,
        0,
        0,
        isLast ? 0 : -46,
    ]);

    const scale = useTransform(progress, stops, [
        isFirst ? 1 : 1.035,
        1,
        1,
        isLast ? 1 : 0.975,
    ]);

    // Скрытый слой не должен перехватывать клики и попадать в отрисовку
    const pointerEvents = useTransform(opacity, (v) =>
        v > 0.55 ? "auto" : "none",
    );
    const hidden = useTransform(opacity, (v) => v < 0.008);
    const visibility = useTransform(hidden, (v) => (v ? "hidden" : "visible"));

    /* will-change заставляет браузер держать под элементом отдельный
       слой в памяти — и держит его даже у скрытого. Секций восемь, и на
       телефоне это восемь полноэкранных буферов разом: на iPhone 12
       (плотность 3) каждый около 12 МБ. Поэтому подсказку даём только
       тому слою, который сейчас реально анимируется. */
    const willChange = useTransform(hidden, (v) =>
        v ? "auto" : "opacity, transform",
    );

    /* content-visibility: hidden здесь не годится, хотя и сняло бы ещё
       нагрузку. Скрытая секция тогда не размечается, FitToViewport не
       может заранее посчитать масштаб — и при появлении секция прыгала
       бы со 100% на свои 72%. Проверено: у скрытой ленты кейсов
       scrollWidth равен нулю, то есть раскладки действительно нет. */

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
                opacity,
                y,
                scale,
                pointerEvents,
                visibility,
                willChange,
                zIndex: z,
            }}
        >
            {children}
        </motion.div>
    );
}

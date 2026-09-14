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
    const visibility = useTransform(opacity, (v) =>
        v < 0.008 ? "hidden" : "visible",
    );

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center will-change-[opacity,transform]"
            style={{ opacity, y, scale, pointerEvents, visibility, zIndex: z }}
        >
            {children}
        </motion.div>
    );
}

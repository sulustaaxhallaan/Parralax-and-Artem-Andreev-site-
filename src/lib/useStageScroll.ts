"use client";

import { useEffect, useRef, useState } from "react";
import {
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
    type MotionValue,
} from "framer-motion";

import { activeIndexAt } from "./stage";

export type StageScroll = {
    /** Прокрутка в экранах (1 = 100vh), сглаженная пружиной */
    progress: MotionValue<number>;
    /** Та же величина без сглаживания — для навигации и логики */
    raw: MotionValue<number>;
    /** Индекс секции, которая сейчас на экране */
    active: number;
    /** Высота окна в пикселях (0 до монтирования) */
    viewport: number;
};

/**
 * Переводит прокрутку страницы в «экраны» и слегка сглаживает её.
 * Сглаживание — то, за счёт чего переходы между секциями кажутся
 * плавными даже при рывковом колесе мыши.
 */
export function useStageScroll(): StageScroll {
    const { scrollY } = useScroll();
    const reduced = useReducedMotion();

    const viewportRef = useRef(0);
    const [viewport, setViewport] = useState(0);
    const raw = useMotionValue(0);

    useEffect(() => {
        const sync = () => {
            const h = window.innerHeight || 1;
            viewportRef.current = h;
            setViewport(h);
            raw.set(window.scrollY / h);
        };

        sync();
        window.addEventListener("resize", sync);
        window.addEventListener("orientationchange", sync);

        return () => {
            window.removeEventListener("resize", sync);
            window.removeEventListener("orientationchange", sync);
        };
    }, [raw]);

    useMotionValueEvent(scrollY, "change", (y) => {
        raw.set(y / (viewportRef.current || 1));
    });

    const smooth = useSpring(raw, {
        stiffness: 140,
        damping: 30,
        mass: 0.35,
        restDelta: 0.0004,
    });

    const [active, setActive] = useState(0);
    const activeRef = useRef(0);

    useMotionValueEvent(raw, "change", (v) => {
        const next = activeIndexAt(v);
        if (next !== activeRef.current) {
            activeRef.current = next;
            setActive(next);
        }
    });

    return {
        progress: reduced ? raw : smooth,
        raw,
        active,
        viewport,
    };
}

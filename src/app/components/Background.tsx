"use client";

import { useEffect } from "react";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type MotionValue,
} from "framer-motion";

type Props = {
    /** прокрутка в экранах — фон медленно дышит вместе с ней */
    progress: MotionValue<number>;
};

/**
 * Единый фон для всего сайта: он никогда не перезагружается и не
 * прерывается — секции появляются и гаснут поверх него.
 *
 * Свечения тянутся за курсором с пружиной (без рывков) и очень
 * медленно смещаются по мере прокрутки.
 */
export default function Background({ progress }: Props) {
    const reduced = useReducedMotion();

    // -1..1 относительно центра экрана
    const px = useMotionValue(0);
    const py = useMotionValue(0);

    const sx = useSpring(px, { stiffness: 40, damping: 20, mass: 0.6 });
    const sy = useSpring(py, { stiffness: 40, damping: 20, mass: 0.6 });

    useEffect(() => {
        if (reduced) return;

        const onMove = (e: MouseEvent) => {
            px.set((e.clientX / window.innerWidth) * 2 - 1);
            py.set((e.clientY / window.innerHeight) * 2 - 1);
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, [px, py, reduced]);

    // Свечения расходятся в разные стороны — получается объём
    const leftX = useTransform(sx, [-1, 1], [-90, 90]);
    const leftY = useTransform(sy, [-1, 1], [-70, 70]);
    const rightX = useTransform(sx, [-1, 1], [70, -70]);
    const rightY = useTransform(sy, [-1, 1], [55, -55]);

    // Медленный дрейф по вертикали за прокруткой
    const scrollDrift = useTransform(progress, [0, 25], [0, -160]);
    const scrollDriftUp = useTransform(progress, [0, 25], [0, 120]);

    const leftGlowY = useTransform([leftY, scrollDrift], ([a, b]: number[]) =>
        a + b,
    );
    const rightGlowY = useTransform(
        [rightY, scrollDriftUp],
        ([a, b]: number[]) => a + b,
    );
    const centerX = useTransform(sx, [-1, 1], [40, -40]);
    const centerY = useTransform(sy, [-1, 1], [30, -30]);

    return (
        <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            style={{ background: "var(--bg)" }}
        >
            {/* Базовая глубина: холодный градиент от центра */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(120% 90% at 50% 30%, #0a1b33 0%, #050d1c 45%, #03060d 100%)",
                }}
            />

            {/* Левое свечение */}
            <motion.div
                className="absolute -left-[18vw] -top-[15vh] h-[75vh] w-[75vh] rounded-full"
                style={{
                    x: leftX,
                    y: leftGlowY,
                    background:
                        "radial-gradient(circle, rgba(34,211,238,0.30) 0%, rgba(34,211,238,0) 70%)",
                    filter: "blur(70px)",
                }}
            />

            {/* Правое свечение */}
            <motion.div
                className="absolute -right-[18vw] -bottom-[18vh] h-[85vh] w-[85vh] rounded-full"
                style={{
                    x: rightX,
                    y: rightGlowY,
                    background:
                        "radial-gradient(circle, rgba(29,78,216,0.38) 0%, rgba(29,78,216,0) 70%)",
                    filter: "blur(80px)",
                }}
            />

            {/* Тёплый акцент в центре — чтобы кадр не был плоским */}
            <motion.div
                className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    x: centerX,
                    y: centerY,
                    background:
                        "radial-gradient(circle, rgba(11,58,111,0.45) 0%, rgba(11,58,111,0) 70%)",
                    filter: "blur(90px)",
                }}
            />

            {/* Световые дуги из черновика */}
            <svg
                className="absolute -bottom-[10vh] left-0 h-[70vh] w-full opacity-[0.5]"
                viewBox="0 0 1440 600"
                preserveAspectRatio="xMidYMax slice"
                fill="none"
            >
                <defs>
                    <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7fd2f0" stopOpacity="0" />
                        <stop offset="45%" stopColor="#7fd2f0" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {[0, 26, 54, 86, 124, 168].map((offset, i) => (
                    <path
                        key={offset}
                        d={`M-80 ${600 - offset} C 320 ${470 - offset}, 700 ${
                            330 - offset * 1.15
                        }, 1520 ${120 - offset * 1.35}`}
                        stroke="url(#arc)"
                        strokeWidth={1}
                        opacity={0.55 - i * 0.07}
                    />
                ))}
            </svg>

            {/* Виньетка */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(110% 80% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
                }}
            />

            {/* Лёгкое зерно, чтобы градиенты не полосили */}
            <div
                className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />
        </div>
    );
}

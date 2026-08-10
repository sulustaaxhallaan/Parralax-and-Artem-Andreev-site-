"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
    children: ReactNode;
    /** отступ сверху и снизу, px */
    padding?: number;
    /** сильнее этого не ужимаем — иначе текст станет нечитаемым */
    minScale?: number;
};

/**
 * Вписывает секцию в высоту экрана.
 *
 * Весь сайт живёт в одном неподвижном кадре, поэтому секция обязана
 * помещаться целиком — иначе низ просто обрежется. Если контент выше
 * кадра (узкий телефон, короткое окно), блок мягко масштабируется.
 */
export default function FitToViewport({
    children,
    padding = 48,
    minScale = 0.62,
}: Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const fit = () => {
            const available = window.innerHeight - padding * 2;
            const natural = el.scrollHeight;
            if (natural <= 0) return;

            const next = Math.min(1, available / natural);
            setScale(Math.max(minScale, Number(next.toFixed(4))));
        };

        fit();

        const ro = new ResizeObserver(fit);
        ro.observe(el);
        window.addEventListener("resize", fit);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", fit);
        };
    }, [padding, minScale]);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div
                className="w-full"
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "center center",
                }}
            >
                <div ref={contentRef} className="flex w-full justify-center">
                    {children}
                </div>
            </div>
        </div>
    );
}

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
 *
 * Если даже предельного масштаба не хватает — телефон повернули боком,
 * окно совсем низкое — включается прокрутка внутри секции. Это
 * запасной вариант: читать мелко, но целиком, лучше, чем не видеть низ.
 */
export default function FitToViewport({
    children,
    padding = 48,
    minScale = 0.58,
}: Props) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [scrollable, setScrollable] = useState(false);
    const [natural, setNatural] = useState(0);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        const fit = () => {
            const available = window.innerHeight - padding * 2;
            const height = el.scrollHeight;
            if (height <= 0) return;

            setNatural(height);

            const next = available / height;
            const clamped = Math.max(minScale, Math.min(1, next));

            setScale(Number(clamped.toFixed(4)));
            setScrollable(next < minScale);
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
        <div
            className={`flex h-full w-full justify-center ${
                scrollable
                    ? "thin-scroll items-start overflow-y-auto overscroll-contain py-6"
                    : "items-center"
            }`}
        >
            {/* Масштаб не меняет размеры в вёрстке, поэтому при прокрутке
                высоту обёртки задаём вручную — иначе внизу повиснет
                пустота размером с «несжатую» часть блока */}
            <div
                className="w-full shrink-0"
                style={
                    scrollable && natural
                        ? { height: Math.ceil(natural * scale) }
                        : undefined
                }
            >
                <div
                    ref={contentRef}
                    className="flex w-full justify-center"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: scrollable
                            ? "top center"
                            : "center center",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

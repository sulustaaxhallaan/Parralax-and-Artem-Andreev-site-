"use client";

import { useEffect, useRef, useState, type ElementType } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
    text: string;
    /** секция на экране — набор начинается, когда становится true */
    active: boolean;
    /** миллисекунд на символ */
    speed?: number;
    /** задержка перед началом набора, мс */
    delay?: number;
    className?: string;
    as?: ElementType;
    /** мигающая каретка во время набора */
    caret?: boolean;
};

/**
 * Печатает текст по символам, когда секция появляется на экране.
 *
 * Ненабранный «хвост» остаётся в разметке прозрачным — благодаря этому
 * блок сразу занимает финальный размер и соседние элементы не прыгают,
 * даже если текст переносится на несколько строк.
 */
export default function TypeLine({
    text,
    active,
    speed = 26,
    delay = 0,
    className = "",
    as: Tag = "span",
    caret = true,
}: Props) {
    const reduced = useReducedMotion();
    const [count, setCount] = useState(0);
    const frame = useRef<number | null>(null);

    useEffect(() => {
        // При reduced motion текст показывается целиком (см. shown ниже)
        if (reduced) return;
        // Секция ушла — набор не идёт, а на экране рисуется пустая строка,
        // так что при возврате он начнётся заново
        if (!active) return;

        let start: number | null = null;

        const step = (now: number) => {
            if (start === null) start = now;
            const elapsed = now - start - delay;

            if (elapsed < 0) {
                setCount(0);
                frame.current = requestAnimationFrame(step);
                return;
            }

            const next = Math.min(text.length, Math.floor(elapsed / speed));
            setCount(next);

            if (next < text.length) {
                frame.current = requestAnimationFrame(step);
            }
        };

        frame.current = requestAnimationFrame(step);

        return () => {
            if (frame.current !== null) cancelAnimationFrame(frame.current);
        };
    }, [active, text, speed, delay, reduced]);

    const shown = reduced ? text.length : active ? count : 0;
    const typing = active && shown < text.length && !reduced;

    return (
        <Tag className={className} aria-label={text}>
            <span aria-hidden>{text.slice(0, shown)}</span>
            {typing && caret ? <span aria-hidden className="caret" /> : null}
            <span aria-hidden className="opacity-0">
                {text.slice(shown)}
            </span>
        </Tag>
    );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";

import { TEMPO } from "@/lib/motion";

const TAGS = {
    p: motion.p,
    div: motion.div,
    span: motion.span,
    li: motion.li,
    h3: motion.h3,
} as const;

type Props = {
    text: string;
    active: boolean;
    /** задержка всего блока, сек */
    delay?: number;
    /** интервал между словами, сек */
    step?: number;
    className?: string;
    as?: keyof typeof TAGS;
};

/**
 * Проявляет длинный текст слово за словом.
 *
 * Для абзацев это читается как «набор», но, в отличие от посимвольной
 * печати, не заставляет ждать: текст можно начинать читать сразу.
 */
export default function RevealWords({
    text,
    active,
    delay = 0,
    step = 0.022,
    className = "",
    as = "p",
}: Props) {
    const reduced = useReducedMotion();
    const Tag = TAGS[as];
    const words = text.split(" ");

    if (reduced) {
        return <Tag className={className}>{text}</Tag>;
    }

    return (
        <Tag className={className} aria-label={text}>
            {words.map((word, i) => (
                <motion.span
                    key={`${word}-${i}`}
                    aria-hidden
                    className="inline-block whitespace-pre"
                    initial={{ opacity: 0, y: "0.35em", filter: "blur(4px)" }}
                    animate={
                        active
                            ? { opacity: 1, y: "0em", filter: "blur(0px)" }
                            : { opacity: 0, y: "0.35em", filter: "blur(4px)" }
                    }
                    transition={{
                        duration: 0.42,
                        ease: [0.22, 1, 0.36, 1],
                        delay: active ? (delay + i * step) * TEMPO : 0,
                    }}
                >
                    {word}
                    {i < words.length - 1 ? " " : ""}
                </motion.span>
            ))}
        </Tag>
    );
}

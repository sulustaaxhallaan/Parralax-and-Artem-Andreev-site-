"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
    children: ReactNode;
    active: boolean;
    /** задержка, сек */
    delay?: number;
    /** сдвиг снизу, px */
    y?: number;
    className?: string;
};

/** Плавное появление блока снизу вверх, когда секция выходит на экран. */
export default function Reveal({
    children,
    active,
    delay = 0,
    y = 22,
    className = "",
}: Props) {
    const reduced = useReducedMotion();

    if (reduced) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y }}
            transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
                delay: active ? delay : 0,
            }}
        >
            {children}
        </motion.div>
    );
}

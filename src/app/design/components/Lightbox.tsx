"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import type { CaseShot } from "@/content/design/site";

/**
 * Просмотр работ в полном размере.
 *
 * Рендерится порталом в body, и это не перестраховка: каждая секция
 * лежит в слое с transform (SectionLayer) и внутри ещё раз масштабируется
 * (FitToViewport). position: fixed внутри такого предка считается от него,
 * а не от окна, — окно просмотра съехало бы и погасло вместе со слоем.
 *
 * Подложка намеренно тёмная: половина логотипов — белая графика на
 * прозрачном фоне, на светлом они просто исчезнут.
 *
 * Появление сделано классами из globals.css, а не Framer Motion:
 * см. комментарий у .lightbox-in — окно не должно зависеть от того,
 * дошла ли анимация до конца.
 */

/** дальше этого сдвига палец листает, а не промахивается по кнопке */
const SWIPE = 60;

/** портал живёт только в браузере: на сервере document.body ещё нет */
const noSubscribe = () => () => {};

type Props = {
    shots: CaseShot[];
    /** индекс, с которого открыли; null — окно закрыто */
    index: number | null;
    title: string;
    onClose: () => void;
};

export default function Lightbox({ shots, index, title, onClose }: Props) {
    const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);

    const [i, setI] = useState(0);
    const drag = useRef({ x: 0, on: false });

    /* Открыли кейс — показываем ту работу, по которой кликнули.
       Правка состояния прямо в рендере, а не эффектом: так React
       переигрывает рендер сразу, без лишнего кадра со старым кадром. */
    const [prev, setPrev] = useState<number | null>(null);
    if (index !== prev) {
        setPrev(index);
        if (index !== null) setI(index);
    }

    const open = index !== null;
    const many = shots.length > 1;

    const go = useCallback(
        (step: number) => {
            setI((prev) => (prev + step + shots.length) % shots.length);
        },
        [shots.length],
    );

    /* --- клавиатура --- */
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowRight" && many) go(1);
            else if (e.key === "ArrowLeft" && many) go(-1);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, many, go, onClose]);

    /* --- пока окно открыто, страница под ним не листается --- */
    useEffect(() => {
        if (!open) return;

        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = overflow;
        };
    }, [open]);

    if (!mounted) return null;

    const shot = shots[i];

    const onPointerDown = (e: ReactPointerEvent) => {
        drag.current = { x: e.clientX, on: true };
    };

    const onPointerUp = (e: ReactPointerEvent) => {
        if (!drag.current.on) return;
        drag.current.on = false;
        const dx = e.clientX - drag.current.x;
        if (many && Math.abs(dx) > SWIPE) go(dx < 0 ? 1 : -1);
    };

    if (!open || !shot) return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} — просмотр работ`}
            className="lightbox-in fixed inset-0 z-[100] flex flex-col bg-[rgba(3,6,13,0.96)] backdrop-blur-sm"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
        >
            {/* Шапка: название кейса и счётчик */}
            <div className="flex shrink-0 items-start justify-between gap-4 px-4 pt-4 sm:px-8 sm:pt-6">
                <div className="min-w-0">
                    <p className="truncate text-[0.9rem] tracking-[0.04em] text-ink sm:text-[1.05rem]">
                        {title}
                    </p>
                    {many ? (
                        <p className="mt-1 text-[0.7rem] tracking-[0.18em] text-ink-faint sm:text-[0.78rem]">
                            {i + 1} / {shots.length}
                        </p>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Закрыть"
                    className="-mr-1 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-dim transition-colors duration-300 hover:border-[rgba(127,210,240,0.5)] hover:text-accent"
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        aria-hidden
                    >
                        <path d="m6 6 12 12M18 6 6 18" />
                    </svg>
                </button>
            </div>

            {/* Сама работа. Клик мимо картинки закрывает окно */}
            <div
                className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-3 sm:px-16 sm:py-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                {/* key: при смене работы элемент создаётся заново,
                    и CSS-анимация появления проигрывается снова */}
                <div
                    key={shot.src}
                    className="lightbox-shot relative h-full w-full"
                >
                    <Image
                        src={shot.src}
                        alt={title}
                        fill
                        sizes="100vw"
                        priority
                        draggable={false}
                        className="object-contain"
                    />
                </div>

                {many ? (
                    <>
                        <Arrow side="left" onClick={() => go(-1)} />
                        <Arrow side="right" onClick={() => go(1)} />
                    </>
                ) : null}
            </div>

            {/* Полоса миниатюр — по ней видно объём кейса */}
            {many ? (
                <div className="no-scrollbar shrink-0 overflow-x-auto px-4 pb-4 sm:px-8 sm:pb-5">
                    <div className="mx-auto flex w-max gap-2">
                        {shots.map((s, n) => (
                            <button
                                key={s.src}
                                type="button"
                                onClick={() => setI(n)}
                                aria-label={`Работа ${n + 1}`}
                                aria-current={n === i}
                                className={`relative h-11 w-14 shrink-0 overflow-hidden rounded-md border transition-colors duration-300 sm:h-14 sm:w-20 ${
                                    n === i
                                        ? "border-[rgba(127,210,240,0.75)]"
                                        : "border-line opacity-55 hover:opacity-100"
                                }`}
                            >
                                <Image
                                    src={s.src}
                                    alt=""
                                    fill
                                    sizes="80px"
                                    draggable={false}
                                    className="object-contain p-1"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>,
        document.body,
    );
}

function Arrow({
    side,
    onClick,
}: {
    side: "left" | "right";
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={side === "left" ? "Предыдущая работа" : "Следующая работа"}
            className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-[rgba(3,6,13,0.6)] text-ink-dim backdrop-blur-sm transition-colors duration-300 hover:border-[rgba(127,210,240,0.5)] hover:text-accent ${
                side === "left" ? "left-1 sm:left-4" : "right-1 sm:right-4"
            }`}
        >
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
            >
                <path d={side === "left" ? "m14.5 5-7 7 7 7" : "m9.5 5 7 7-7 7"} />
            </svg>
        </button>
    );
}

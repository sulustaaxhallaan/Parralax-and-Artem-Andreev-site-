"use client";

import { SECTION_WINDOWS } from "@/lib/stage";

type Props = {
    active: number;
    onGo: (index: number) => void;
};

/**
 * Точки-указатели справа: показывают, где вы находитесь, и позволяют
 * прыгнуть к нужной секции — на длинной прокрутке это заметно удобнее.
 */
export default function SectionNav({ active, onGo }: Props) {
    return (
        <nav
            aria-label="Разделы"
            className="fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 md:block"
        >
            <ul className="flex flex-col items-end gap-4">
                {SECTION_WINDOWS.map((win, i) => (
                    <li key={win.id}>
                        <button
                            type="button"
                            onClick={() => onGo(i)}
                            aria-label={win.label}
                            aria-current={i === active ? "true" : undefined}
                            className="group flex items-center gap-3"
                        >
                            {/* Подпись только по наведению — иначе она ляжет
                                поверх ленты кейсов */}
                            <span
                                className={`whitespace-nowrap rounded-full bg-[rgba(3,6,13,0.72)] px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.22em] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 ${
                                    i === active ? "text-accent" : "text-ink-dim"
                                }`}
                            >
                                {win.label}
                            </span>

                            <span
                                className={`block rounded-full transition-all duration-300 ${
                                    i === active
                                        ? "h-2 w-2 bg-accent"
                                        : "h-1.5 w-1.5 bg-[rgba(159,179,200,0.35)] group-hover:bg-ink-dim"
                                }`}
                            />
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

import Link from "next/link";

/**
 * Возврат к развилке направлений.
 *
 * Общая для обоих сайтов: цвета берутся токенами, а они переопределены
 * на обёртке (.site-design и .site-web), поэтому кнопка сама
 * перекрашивается под тот сайт, на котором стоит.
 *
 * Размытия под ней нет намеренно: на телефоне backdrop-filter выключен,
 * иначе подложка выглядела бы по-разному на разных ширинах.
 *
 * className нужен, чтобы отодвинуть кнопку от того, что уже закреплено
 * по краю: на Parralax с 1024px слева стоит панель соцсетей.
 */
export default function BackHome({ className = "" }: { className?: string }) {
    return (
        <Link
            href="/"
            className={`fixed left-4 top-4 z-[70] inline-flex items-center gap-2 rounded-full border border-line bg-[rgba(3,6,13,0.72)] py-2 pl-3 pr-4 text-[0.7rem] uppercase tracking-[0.18em] text-ink-dim transition-colors duration-300 hover:border-[rgba(127,210,240,0.55)] hover:text-accent sm:text-[0.76rem] ${className}`}
        >
            <span aria-hidden className="text-[0.9em] leading-none">
                ←
            </span>
            Направления
        </Link>
    );
}

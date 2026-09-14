"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** поля по бокам кадра: там живут точки навигации и панель связи */
const SIDE_GUTTER = 72;

type Props = {
    children: ReactNode;
    /** отступ сверху и снизу, px */
    padding?: number;
    /** сильнее этого не ужимаем — иначе текст станет нечитаемым */
    minScale?: number;
    /** и крупнее этого не растягиваем — иначе макет выглядит зумом */
    maxScale?: number;
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
 *
 * На больших экранах работает и в обратную сторону. Ширина секций
 * ограничена (max-w-6xl — это 1152px), и на мониторе 2560px блок
 * занимал меньше половины кадра, а вокруг оставалось пусто. Запас по
 * высоте там тоже большой, поэтому секция растягивается, пока не упрётся
 * в кадр или в потолок maxScale. Пропорции макета при этом сохраняются
 * целиком: длина строк в знаках не меняется, растёт только кегль.
 */
export default function FitToViewport({
    children,
    padding = 48,
    minScale = 0.58,
    maxScale = 1.35,
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

            const byHeight = available / height;

            /* Растягивать можно только пока блок влезает в кадр по ширине.
               Меряем сам блок секции (offsetWidth не учитывает transform,
               в отличие от getBoundingClientRect), а не обёртку: обёртка
               всегда во всю ширину окна.
               Math.max(1, ...) важен: на телефоне блок и так шире доступного
               места, и без него эта величина ужимала бы секцию по ширине,
               хотя по высоте она помещается. Ограничивать она должна только
               растягивание. */
            const block = el.firstElementChild as HTMLElement | null;
            const blockWidth = block?.offsetWidth || el.offsetWidth;
            const byWidth = Math.max(
                1,
                (window.innerWidth - SIDE_GUTTER * 2) / blockWidth,
            );

            const next = Math.min(byHeight, byWidth, maxScale);
            const clamped = Math.max(minScale, next);

            setScale(Number(clamped.toFixed(4)));
            // Прокрутка нужна, только когда не хватает высоты
            setScrollable(byHeight < minScale);
        };

        fit();

        const ro = new ResizeObserver(fit);
        ro.observe(el);
        window.addEventListener("resize", fit);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", fit);
        };
    }, [padding, minScale, maxScale]);

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

/**
 * Адреса картинок для статического экспорта.
 *
 * На Vercel next/image ходил в серверный оптимизатор (/_next/image),
 * которого на VPS нет. Здесь он заменён заранее нарезанными файлами:
 * scripts/export-images.mjs кладёт каждую картинку в out/_img в каждой
 * ширине из next.config.ts. Например:
 *
 *   /cases/media/lumen/01.webp, 828  →  /_img/cases/media/lumen/01-828.webp
 *
 * Next сам выбирает ширины из deviceSizes/imageSizes, так что любой
 * запрошенный адрес гарантированно существует.
 *
 * В разработке нарезки нет — она делается после сборки. Тогда отдаём
 * оригинал, а ширину дописываем параметром: Next проверяет, что
 * загрузчик учитывает ширину, и без неё ругался бы в консоль.
 * Статический сервер параметр просто игнорирует.
 */
export default function staticImageLoader({
    src,
    width,
}: {
    src: string;
    width: number;
    quality?: number;
}) {
    if (process.env.NODE_ENV === "development") {
        return `${src}?w=${width}`;
    }

    const dot = src.lastIndexOf(".");
    const base = dot > 0 ? src.slice(0, dot) : src;
    return `/_img${base}-${width}.webp`;
}

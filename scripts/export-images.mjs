/**
 * Нарезка картинок для статического экспорта.
 *
 * Запускается сам после `npm run build` (скрипт postbuild): берёт
 * картинки из public/ и кладёт в out/_img каждую в каждой ширине, которую
 * может запросить next/image. Адреса строит src/lib/staticImageLoader.ts.
 *
 * Качество. Vercel отдавал картинки с q=75. Здесь уменьшенные копии
 * кодируются с q=85, а если ширина не меньше оригинала — кладётся сам
 * оригинал байт в байт, без пережатия. Верхняя ступень 2560 шире любого
 * оригинала, поэтому в просмотрщике на большом экране всегда исходник.
 *
 * sharp не новая зависимость: он стоит как зависимость самого Next.js
 * и есть в package-lock, так что `npm ci` ставит его и на CI.
 */
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/** Должно совпадать с deviceSizes + imageSizes в next.config.ts */
const WIDTHS = [256, 384, 640, 828, 1080, 1440, 1920, 2560];
const QUALITY = 85;

/* Только то, что идёт через next/image. Кадры поворота фигуры (hero/)
   грузятся напрямую и копируются в out как есть, docs/ — не картинки. */
const SOURCE_DIRS = ["about", "cases", "images"];
const RASTER = new Set([".webp", ".png", ".jpg", ".jpeg"]);

const PUBLIC = path.resolve("public");
const OUT = path.resolve("out", "_img");
const CONCURRENCY = 4;

async function exists(p) {
    try {
        await stat(p);
        return true;
    } catch {
        return false;
    }
}

async function* walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walk(full);
        else if (RASTER.has(path.extname(entry.name).toLowerCase())) yield full;
    }
}

async function processImage(file, totals) {
    const rel = path.relative(PUBLIC, file);
    const ext = path.extname(rel).toLowerCase();
    const base = rel.slice(0, -ext.length);
    const { width: original } = await sharp(file).metadata();

    for (const width of WIDTHS) {
        const dest = path.join(OUT, `${base}-${width}.webp`);
        await mkdir(path.dirname(dest), { recursive: true });

        if (width >= original && ext === ".webp") {
            // Не уменьшаем — значит, и не пережимаем: исходник как есть
            await copyFile(file, dest);
            totals.copied++;
        } else {
            await sharp(file)
                .resize({ width, withoutEnlargement: true })
                .webp({ quality: QUALITY, effort: 5 })
                .toFile(dest);
            totals.encoded++;
        }
    }
    totals.images++;
}

async function main() {
    if (!(await exists(path.resolve("out")))) {
        console.error(
            "export-images: папки out/ нет. Сначала `next build` с output: 'export'.",
        );
        process.exit(1);
    }

    const files = [];
    for (const dir of SOURCE_DIRS) {
        const full = path.join(PUBLIC, dir);
        if (await exists(full)) for await (const f of walk(full)) files.push(f);
    }

    const totals = { images: 0, encoded: 0, copied: 0 };
    const started = Date.now();

    // Небольшой пул: sharp сам многопоточный, больше 4 файлов разом
    // только упирается в диск
    const queue = [...files];
    await Promise.all(
        Array.from({ length: CONCURRENCY }, async () => {
            while (queue.length) await processImage(queue.shift(), totals);
        }),
    );

    console.log(
        `export-images: ${totals.images} картинок × ${WIDTHS.length} ширин → ` +
            `${totals.encoded} уменьшено, ${totals.copied} оригиналов скопировано ` +
            `за ${((Date.now() - started) / 1000).toFixed(1)} с`,
    );
}

main().catch((err) => {
    console.error("export-images:", err);
    process.exit(1);
});

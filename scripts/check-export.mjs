/**
 * Проверка статической сборки в out/ перед выкладкой.
 *
 * Отвечает на один вопрос: всё ли, на что ссылается сайт, реально лежит
 * в out/. Ищет адреса так же, как их потом будет искать Nginx
 * (try_files $uri $uri.html $uri/index.html), поэтому «нашлось здесь» =
 * «откроется на сервере».
 *
 *   node scripts/check-export.mjs
 *
 * Код выхода 1, если хоть что-то не найдено, — на CI это остановит деплой.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("out");
const PUBLIC = path.resolve("public");

/** Должно совпадать с next.config.ts и scripts/export-images.mjs */
const WIDTHS = [256, 384, 640, 828, 1080, 1440, 1920, 2560];
const IMAGE_DIRS = ["about", "cases", "images"];
/** Те же расширения, что режет export-images.mjs; рядом лежит, например, manifest.json */
const RASTER = new Set([".webp", ".png", ".jpg", ".jpeg"]);
const ROUTES = ["/", "/design", "/design/prices", "/web"];

async function isFile(p) {
    try {
        return (await stat(p)).isFile();
    } catch {
        return false;
    }
}

async function* walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) yield* walk(full);
        else yield full;
    }
}

/** Ищет файл по адресу так же, как try_files в Nginx */
async function resolveUrl(url) {
    const clean = decodeURIComponent(url.split(/[?#]/)[0]);
    const local = path.join(OUT, clean);
    for (const candidate of [
        local,
        `${local}.html`,
        path.join(local, "index.html"),
    ]) {
        if (await isFile(candidate)) return candidate;
    }
    return null;
}

const failures = [];
const fail = (msg) => failures.push(msg);

async function main() {
    // 1. Маршруты
    for (const route of ROUTES) {
        if (!(await resolveUrl(route))) fail(`маршрут ${route}: нет HTML`);
    }

    // 2. Всё, на что ссылаются HTML и CSS
    const refs = new Map(); // адрес → где встретился
    let htmlCount = 0;
    let cssCount = 0;
    for await (const file of walk(OUT)) {
        const ext = path.extname(file);
        if (ext !== ".html" && ext !== ".css") continue;
        const text = await readFile(file, "utf8");
        const where = path.relative(OUT, file);

        const found = [];
        if (ext === ".html") {
            htmlCount++;
            for (const m of text.matchAll(/\s(?:src|href)="([^"]+)"/g)) found.push(m[1]);
            for (const m of text.matchAll(/\ssrcset="([^"]+)"/g)) {
                for (const part of m[1].split(",")) found.push(part.trim().split(/\s+/)[0]);
            }
            if (text.includes("/_next/image")) {
                fail(`${where}: остались адреса серверного оптимизатора /_next/image`);
            }
        } else {
            cssCount++;
            for (const m of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
                // относительные url() в CSS считаются от самого файла
                const u = m[1];
                if (u.startsWith("data:")) continue;
                found.push(
                    u.startsWith("/")
                        ? u
                        : "/" + path.posix.join(path.posix.dirname(where.split(path.sep).join("/")), u),
                );
            }
        }

        for (const u of found) {
            // только свои абсолютные адреса: якоря, tel:, mailto:, https: — мимо
            if (!u.startsWith("/") || u.startsWith("//")) continue;
            if (!refs.has(u)) refs.set(u, where);
        }
    }

    for (const [url, where] of refs) {
        if (!(await resolveUrl(url))) fail(`${where}: не найдено ${url}`);
    }

    // 3. Нарезка картинок: нужна для всего, что next/image может
    //    запросить уже в браузере (десктопная сцена и просмотрщик
    //    рисуются только на клиенте, их адресов в HTML нет)
    let variants = 0;
    for (const dir of IMAGE_DIRS) {
        for await (const file of walk(path.join(PUBLIC, dir))) {
            if (!RASTER.has(path.extname(file).toLowerCase())) continue;
            const rel = path.relative(PUBLIC, file);
            const base = rel.slice(0, -path.extname(rel).length);
            for (const w of WIDTHS) {
                const v = path.join(OUT, "_img", `${base}-${w}.webp`);
                if (await isFile(v)) variants++;
                else fail(`нет варианта ${w}px для /${rel.split(path.sep).join("/")}`);
            }
        }
    }

    // 4. Ошибка Next.js 16.2 при сборке на Windows. Файлы данных для
    //    вложенных маршрутов должны называться __next.design.prices.txt,
    //    но path.relative() на Windows отдаёт design\prices, а Next меняет
    //    на точку только прямые косые. Обратная косая становится папкой:
    //    __next.design/prices.txt. Браузер их не находит, и переход по
    //    ссылке на вложенную страницу идёт полной перезагрузкой. На Linux
    //    имена верные, поэтому собирать для сервера нужно на CI.
    for await (const file of walk(OUT)) {
        const rel = path.relative(OUT, file).split(path.sep);
        if (rel.slice(0, -1).some((part) => part.startsWith("__next."))) {
            fail(
                `сегмент в подпапке: ${rel.join("/")} — сборка сделана на Windows, ` +
                    `для сервера собирайте на Linux (GitHub Actions)`,
            );
        }
    }

    // 5. Кадры поворота фигуры грузятся напрямую, без next/image
    const frames = (await readdir(path.join(OUT, "hero", "turn"))).length;
    const framesSrc = (await readdir(path.join(PUBLIC, "hero", "turn"))).length;
    if (frames !== framesSrc) fail(`кадры фигуры: в out ${frames}, в public ${framesSrc}`);

    console.log(
        `check-export: маршрутов ${ROUTES.length}, HTML ${htmlCount}, CSS ${cssCount}, ` +
            `уникальных ссылок ${refs.size}, вариантов картинок ${variants}, кадров фигуры ${frames}`,
    );

    if (failures.length) {
        console.error(`\ncheck-export: НАЙДЕНО ПРОБЛЕМ: ${failures.length}`);
        for (const f of failures.slice(0, 40)) console.error("  ✗ " + f);
        process.exit(1);
    }
    console.log("check-export: всё на месте ✓");
}

main().catch((err) => {
    console.error("check-export:", err);
    process.exit(1);
});

import type { NextConfig } from "next";

/* ==================================================================
   СТАТИЧЕСКИЙ ЭКСПОРТ ДЛЯ VPS (ветка parallax-static-vps).

   `next build` складывает готовый сайт в папку out/ — чистый HTML, CSS,
   JS и картинки, которые отдаёт Nginx без Node.js на сервере.

   Две возможности Next.js без сервера не работают, и обе заменены:

   1. Оптимизатор картинок. На Vercel он нарезал изображения на лету.
      Здесь их заранее режет scripts/export-images.mjs (sharp уже стоит
      как зависимость самого Next), а src/lib/staticImageLoader.ts
      подставляет готовые адреса. Ширины ниже должны совпадать со
      списком в скрипте.

   2. Редиректы из этого файла. Старый /prices → /design/prices теперь
      делает Nginx: см. deploy/nginx/parallax.conf.
================================================================== */

/** Совпадает с WIDTHS в scripts/export-images.mjs */
const DEVICE_SIZES = [640, 828, 1080, 1440, 1920, 2560];
const IMAGE_SIZES = [256, 384];

const nextConfig: NextConfig = {
    output: "export",
    images: {
        loader: "custom",
        loaderFile: "./src/lib/staticImageLoader.ts",
        /* На Vercel верхней ступенью было 3840, но оригиналы кейсов не
           шире 2200px. Ступень 2560 покрывает их целиком: для любого
           оригинала уже́ 2560 она — точная копия файла без пережатия,
           так что максимальное качество в просмотрщике сохраняется. */
        deviceSizes: DEVICE_SIZES,
        imageSizes: IMAGE_SIZES,
    },
};

export default nextConfig;

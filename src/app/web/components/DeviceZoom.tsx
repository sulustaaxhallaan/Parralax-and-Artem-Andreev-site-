"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import Image from "next/image";

import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";
import type { ScreenGeometry } from "@/lib/devices";

/**
 * Наезд камеры на экран устройства.
 *
 * Секция длинная, внутри — липкий кадр на высоту экрана, и прокрутка
 * работает как ползунок таймлайна: текст уходит, устройство наезжает,
 * а сцена за ним раскрывается из экрана на весь экран.
 *
 * Сцена лежит отдельным слоем в полный размер и всегда резкая — растёт
 * не она, а её `clip-path`. Границы выреза каждый кадр берутся из
 * реального положения картинки устройства, поэтому маска приклеена к
 * экрану точно и не зависит от вёрстки, ширины окна и масштаба.
 */
export default function DeviceZoom({
  geometry,
  frameSrc,
  frameAlt,
  revealSrc,
  revealAlt,
  overlay,
  devicePositionClassName = "items-center justify-center",
  deviceSizeClassName = "w-[86vw] max-w-[1100px]",
  aspect,
  runwayClassName = "h-[300vh]",
  priority = false,
  revealOverlayClassName = "bg-gradient-to-b from-[var(--bg)]/45 via-transparent to-[var(--bg)]",
  id,
  handOffToBackdrop = false,
}: {
  geometry: ScreenGeometry;
  frameSrc: string;
  frameAlt: string;
  revealSrc: string;
  revealAlt: string;
  overlay?: ReactNode;
  devicePositionClassName?: string;
  deviceSizeClassName?: string;
  aspect: string;
  runwayClassName?: string;
  priority?: boolean;
  /** Затемнение поверх сцены. Если дальше идёт секция с тем же кадром,
   *  оно должно совпадать с ней — иначе на стыке видна полоса. */
  revealOverlayClassName?: string;
  id?: string;
  /** Ниже стоит SceneBackdrop с тем же кадром и таким же затемнением.
   *  Тогда по окончании наезда слой сцены прячется: иначе он уезжает
   *  вверх вместе с липким блоком и открывает закреплённый фон другим
   *  кадрированием — по экрану ползёт линия стыка. В момент передачи
   *  оба слоя показывают одно и то же, поэтому подмена незаметна. */
  handOffToBackdrop?: boolean;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const device = deviceRef.current;
    const reveal = revealRef.current;
    if (!device || !reveal) return;

    if (prefersReducedMotion()) {
      // Без анимации сцена показывается целиком, наезда нет.
      reveal.style.clipPath = "none";
      return;
    }

    const { gsap } = ensureGsap();

    // Всё считается в системе координат самого слоя со сценой: проценты
    // в clip-path отмеряются от бокса элемента, а не от окна. Раньше
    // здесь стояли innerWidth/innerHeight — и на телефоне маска ехала,
    // потому что 100svh не равен innerHeight и меняется, когда
    // прячется адресная строка.
    const base = { w: 0, h: 0, ox: 0, oy: 0, rw: 1, rh: 1 };
    const target = { scale: 1, x: 0, y: 0 };
    const state = { t: 0 };

    // Геометрия снимается только на refresh: внутри кадра она не
    // меняется, а чтение размеров сразу после записи трансформа
    // заставляет браузер пересчитывать layout каждый кадр — от этого
    // картинка и подрагивала.
    const measure = () => {
      gsap.set(device, { x: 0, y: 0, scale: 1 });
      const dr = device.getBoundingClientRect();
      const rr = reveal.getBoundingClientRect();
      base.w = dr.width;
      base.h = dr.height;
      base.ox = dr.left - rr.left;
      base.oy = dr.top - rr.top;
      base.rw = rr.width || 1;
      base.rh = rr.height || 1;

      target.scale =
        Math.max(
          base.rw / (base.w * geometry.span.width),
          base.rh / (base.h * geometry.span.height)
        ) * geometry.coverMargin;
      // Наезд идёт в центр экрана устройства, а не картинки.
      target.x = base.rw / 2 - (base.ox + base.w * (geometry.center[0] / 100));
      target.y = base.rh / 2 - (base.oy + base.h * (geometry.center[1] / 100));
      render();
    };

    // Наезд равномерен для глаза только если масштаб растёт
    // экспоненциально: линейный рост даёт вялое начало и рывок в конце,
    // потому что под конец каждый шаг прибавляет всё больше пикселей.
    // Здесь за равные доли прокрутки кадр приближается в равное число
    // раз — это и читается как ровное движение камеры.
    const render = () => {
      const t = state.t;
      const s = Math.pow(target.scale, t);
      const tx = target.x * t;
      const ty = target.y * t;
      gsap.set(device, { scale: s, x: tx, y: ty });

      // Углы экрана после масштабирования вокруг его центра — чистая
      // арифметика по уже известным числам, без обращения к DOM.
      const cx0 = base.w * (geometry.center[0] / 100);
      const cy0 = base.h * (geometry.center[1] / 100);
      const points = geometry.corners
        .map(([cx, cy]) => {
          const px = base.ox + tx + cx0 + (base.w * (cx / 100) - cx0) * s;
          const py = base.oy + ty + cy0 + (base.h * (cy / 100) - cy0) * s;
          return `${((px / base.rw) * 100).toFixed(2)}% ${((py / base.rh) * 100).toFixed(2)}%`;
        })
        .join(", ");
      reveal.style.clipPath = `polygon(${points})`;
    };

    const ctx = gsap.context(() => {
      measure();

      const tl = gsap.timeline({
        onUpdate: render,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          // Сглаживание догоняет колесо: чем больше, тем мягче
          // отрабатывают рывки тачпада и колёсика.
          scrub: 1.2,
          onRefresh: measure,
          onLeave: handOffToBackdrop ? () => gsap.set(reveal, { opacity: 0 }) : undefined,
          onEnterBack: handOffToBackdrop ? () => gsap.set(reveal, { opacity: 1 }) : undefined,
          // Отрисовку намеренно зовёт только таймлайн (выше). Раньше она
          // висела ещё и здесь, на самой прокрутке, — но прокрутка идёт
          // впереди сглаженного таймлайна, и такой кадр рисовался по
          // устаревшей фазе. На смене направления это давало мерцание.
          // Маска зависит только от фазы, так что второй вызов не нужен.
        },
      });

      // Первый экран сначала просто стоит — его нужно успеть прочитать.
      // Текст уходит раньше наезда: он не должен висеть поверх кадра,
      // когда камера уже пошла вперёд.
      if (overlayRef.current) {
        tl.to(overlayRef.current, { opacity: 0, y: -60, ease: "power1.out", duration: 0.18 }, 0.08);
      }

      // Без текста ждать нечего — наезд начинается почти сразу, иначе
      // в начале секции прокрутка уходит вхолостую.
      const zoomStart = overlayRef.current ? 0.12 : 0.03;
      tl.to(state, { t: 1, ease: "power1.inOut", duration: 1 - zoomStart }, zoomStart);

      // Корпус растворяется у самого конца — иначе рамка висела бы
      // поперёк кадра, когда сцена уже во весь экран.
      // autoAlpha, а не opacity: на нуле он ещё и убирает элемент из
      // отрисовки, и браузер освобождает раздутый увеличением слой.
      if (frameRef.current) {
        tl.to(frameRef.current, { autoAlpha: 0, ease: "power1.in", duration: 0.16 }, 0.84);
      }
    }, rootRef);

    // ScrollTrigger сам зовёт refresh на resize, но адресная строка на
    // телефоне меняет высоту без него — там пересчёт нужен вручную.
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      ctx.revert();
    };
  }, [geometry, handOffToBackdrop]);

  return (
    <section
      id={id}
      ref={rootRef}
      className={`relative w-full ${runwayClassName} motion-reduce:h-auto`}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden motion-reduce:static motion-reduce:h-auto">
        {/* Сцена за экраном: всегда в полный размер и резкая, растёт маска.
            Без анимации наезда нет, и сцена ни к чему — ту же самую
            показывает следующая секция. */}
        {/* Своя заливка обязательна: слой видно через вырез экрана, и
            пока картинка не декодирована, экран иначе просто пустой —
            на возврате прокруткой это читалось как поломка. */}
        <div
          ref={revealRef}
          className="absolute inset-0 bg-[var(--bg-deep)] motion-reduce:hidden"
        >
          <Image
            src={revealSrc}
            alt={revealAlt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={priority}
            loading="eager"
          />
          <div className={`absolute inset-0 ${revealOverlayClassName}`} />
        </div>

        {/* Устройство */}
        <div
          className={`absolute inset-0 flex px-[4vw] motion-reduce:hidden ${devicePositionClassName}`}
        >
          <div
            ref={deviceRef}
            className={`relative ${deviceSizeClassName}`}
            style={{
              aspectRatio: aspect,
              transformOrigin: `${geometry.center[0]}% ${geometry.center[1]}%`,
              willChange: "transform",
            }}
          >
            <div ref={frameRef} className="absolute inset-0">
              <Image
                src={frameSrc}
                alt={frameAlt}
                fill
                sizes="(min-width: 1024px) 60vw, 90vw"
                className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                priority={priority}
              />
            </div>
          </div>
        </div>

        {/* Текст поверх кадра */}
        {overlay && (
          <div ref={overlayRef} className="absolute inset-0 motion-reduce:relative motion-reduce:h-svh">
            {overlay}
          </div>
        )}
      </div>
    </section>
  );
}

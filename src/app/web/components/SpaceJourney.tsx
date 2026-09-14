"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Общее небо на весь сайт: снимок звёздного неба, который едет медленнее
 * страницы — это и есть параллакс, обещанный названием бренда.
 *
 * Раньше звёзды рисовались набором CSS-градиентов. От них по кадру шли
 * заметные полосы (сетка повторялась) и розоватый отлив от подсвечивающего
 * градиента, поэтому небо заменено на готовую картинку.
 *
 * Слой намеренно с запасом по краям и чуть увеличен: при сдвиге края не
 * должны выходить в кадр. Сами сцены (поле, планеты, чёрная дыра) живут
 * выше — см. SceneBackdrop и ParallaxImage.
 */
export default function SpaceJourney() {
  const skyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap, ScrollTrigger } = ensureGsap();

    const ctx = gsap.context(() => {
      gsap.to(skyRef.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });
    });

    // Пересчёт после загрузки картинок: до неё высоты секций,
    // а значит и точки старта наездов, ещё не окончательные.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg)]"
    >
      <div ref={skyRef} className="absolute inset-[-12%]">
        <Image
          src="/images/space/starfield.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>
      {/* Лёгкое свечение сверху — чтобы небо не читалось плоской текстурой */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 15%, rgba(29,78,216,0.14), transparent 60%)",
        }}
      />
    </div>
  );
}

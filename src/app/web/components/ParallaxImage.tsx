"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Фоновая фотография секции, которая едва заметно наезжает и сдвигается,
 * пока секция проходит через экран — сам скролл читается как движение
 * камеры. Скоуп триггера — сама секция, поэтому компонент не зависит
 * от высоты остальной страницы и безопасен переиспользовать где угодно.
 *
 * Сверху и снизу снимок растворяется маской. Без неё он обрывается точно
 * по краю секции, и на стыке с общим небом видна жёсткая линия поперёк
 * всего экрана — гасить края в цвет фона нельзя, он темнее неба вокруг.
 */
export default function ParallaxImage({
  src,
  alt,
  className = "",
  overlayClassName = "bg-[rgba(3,5,12,0.35)]",
  priority = false,
  flipX = false,
  fade = "18%",
}: {
  src: string;
  alt: string;
  className?: string;
  overlayClassName?: string;
  priority?: boolean;
  /** Отразить по горизонтали — чтобы объект встал с другой стороны кадра */
  flipX?: boolean;
  /** Высота растворения у верхнего и нижнего края */
  fade?: string;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = ensureGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.16, yPercent: -6 },
        {
          scale: 1.02,
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const mask = `linear-gradient(to bottom, transparent 0%, #000 ${fade}, #000 calc(100% - ${fade}), transparent 100%)`;

  return (
    <div
      ref={sectionRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div ref={imgRef} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="100vw"
          style={flipX ? { transform: "scaleX(-1)" } : undefined}
        />
      </div>
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}

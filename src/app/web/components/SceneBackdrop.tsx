"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Кадр, который держится на весь участок между двумя секциями.
 *
 * Слой именно закреплённый, а не липкий: липкий открепляется за экран до
 * конца своего контейнера, и картинка «перезапускается» видимой линией,
 * ползущей вверх. Закреплённый стоит намертво, поэтому стыков нет.
 *
 * Включается ровно там, где наезд на устройство закончился и сцена уже
 * заняла весь экран, — подмена в этот момент незаметна. Гаснет к концу
 * участка, чтобы следующее устройство вышло на чистом фоне.
 */
export default function SceneBackdrop({
  src,
  fromId,
  toId,
  scrimClassName = "bg-[rgba(3,5,12,0.45)]",
  fadeIn = 0,
  fadeOut = 0.25,
  startPlacement = "bottom bottom+=10%",
}: {
  src: string;
  /** Секция, по завершении которой кадр включается */
  fromId: string;
  /** Секция, к началу которой кадр должен погаснуть */
  toId: string;
  scrimClassName?: string;
  /** Доля участка на разгорание. Ноль там, где включение и так закрыто
   *  сценой наезда; больше нуля — где кадр меняется на голом фоне. */
  fadeIn?: number;
  fadeOut?: number;
  startPlacement?: string;
}) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    if (!layer || !from || !to) return;

    if (prefersReducedMotion()) {
      layer.style.opacity = "1";
      return;
    }

    const { gsap, ScrollTrigger } = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.set(layer, { opacity: 0 });
      const fade = (o: number) => gsap.set(layer, { opacity: o });

      ScrollTrigger.create({
        trigger: from,
        // Чуть раньше конца наезда: к этому моменту сцена уже накрыла
        // экран, и оба слоя показывают одно и то же. Если включать ровно
        // на границе, между гашением сцены и включением фона попадает
        // кадр пустого фона страницы.
        start: startPlacement,
        endTrigger: to,
        end: "top top",
        onUpdate: (self) => {
          const p = self.progress;
          const up = fadeIn > 0 ? Math.min(1, p / fadeIn) : 1;
          const down = fadeOut > 0 ? Math.min(1, (1 - p) / fadeOut) : 1;
          fade(Math.max(0, Math.min(up, down)));
        },
        onEnter: () => fade(fadeIn > 0 ? 0 : 1),
        onEnterBack: () => fade(1),
        onLeave: () => fade(0),
        onLeaveBack: () => fade(0),
      });
    });

    return () => ctx.revert();
  }, [fromId, toId, fadeIn, fadeOut, startPlacement]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[5] opacity-0"
    >
      <Image src={src} alt="" fill sizes="100vw" className="object-cover" priority />
      <div className={`absolute inset-0 ${scrimClassName}`} />
    </div>
  );
}

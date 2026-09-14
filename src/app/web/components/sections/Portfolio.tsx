import Image from "next/image";

import { portfolio } from "@/content/web/site";
import Reveal from "../Reveal";

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative w-full py-28 sm:py-36">
      <div className="shell">
        <Reveal as="p" className="eyebrow">
          {portfolio.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={0.05} className="display mt-5 text-[clamp(2.2rem,6vw,5rem)] text-balance">
          {portfolio.title}{" "}
          <span className="text-accent">{portfolio.titleAccentA}</span>
          <br />
          <span className="text-accent">{portfolio.titleAccentB}</span>
        </Reveal>

        {/* Сетка, а не колонки: раскладка по колонкам подгоняла высоту
            под пропорции снимка, из-за чего карточки выходили разными,
            а лишняя пустая колонка съедала правый край. Здесь обе
            карточки одного размера и вместе занимают всю ширину. */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2">
          {portfolio.items.map((item, i) => (
            <Reveal
              key={item.name}
              delay={i * 0.08}
              className="group block overflow-hidden rounded-2xl border border-line bg-black/20"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-7 pt-14">
                  <p className="display text-[clamp(1.2rem,1.9vw,2rem)] text-ink">{item.name}</p>
                  <p className="body-lg mt-2 text-ink-dim">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

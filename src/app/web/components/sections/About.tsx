import Image from "next/image";

import { about } from "@/content/web/site";
import Reveal from "../Reveal";

export default function About() {
  return (
    <section className="relative w-full py-28 sm:py-36">
      <div className="shell relative">
        <Reveal as="h2" className="display text-[clamp(2.2rem,5.6vw,4.8rem)] text-balance">
          {about.title}
          <br />
          <span className="text-accent">{about.titleAccent}</span>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-16">
          <Reveal className="mx-auto lg:mx-0">
            <div className="relative h-52 w-52 shrink-0 overflow-hidden rounded-full ring-1 ring-line sm:h-64 sm:w-64 lg:h-80 lg:w-80">
              <Image
                src={about.portrait.src}
                alt={about.portrait.alt}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 256px, 208px"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.08} className="body-lg space-y-6 text-ink-dim">
              {about.bodyLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </Reveal>

            <Reveal delay={0.16} className="mt-10">
              <p className="display text-[clamp(1.4rem,3vw,2.4rem)] text-ink">
                Ваша <span className="text-accent">идея</span> — главный приоритет
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.24} className="mt-20 border-t border-line pt-12 sm:mt-24">
          <p className="body-xl text-ink-dim">{about.closingLine1}</p>
          <p className="display mt-3 text-[clamp(1.7rem,4.2vw,3.4rem)]">
            {about.closingLine2}{" "}
            <span className="text-accent">{about.closingAccent}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

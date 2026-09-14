import Image from "next/image";

import { process } from "@/content/web/site";
import Reveal from "../Reveal";

export default function Process() {
  return (
    <section className="relative w-full py-28 sm:py-36">
      <div className="shell">
        <Reveal as="p" className="eyebrow">
          {process.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={0.05} className="display mt-5 text-[clamp(2.1rem,5.4vw,4.4rem)]">
          {process.title}
        </Reveal>
        <Reveal delay={0.1} className="body-lg mt-4 text-ink-faint">
          {process.subtitle}
        </Reveal>

        <div className="mt-20 grid gap-10 sm:grid-cols-3">
          {process.steps.map((step, i) => (
            <Reveal key={step.label} delay={i * 0.1}>
              <div
                className="relative w-full overflow-hidden rounded-2xl border border-line"
                style={{ aspectRatio: `${step.width} / ${step.height}` }}
              >
                <Image
                  src={step.image}
                  alt={step.label}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="display mt-5 text-[clamp(1.4rem,2.4vw,2.2rem)]">{step.label}</p>
              <p className="body-lg mt-2 text-ink-dim">{step.prompt}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-line"
              style={{ aspectRatio: `${process.genericSite.width} / ${process.genericSite.height}` }}
            >
              <Image
                src={process.genericSite.image}
                alt="Обычный сайт"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="body-lg mt-5 text-ink-dim">
              {process.genericSite.caption.split(/(обычный сайт,\s*которых\s*1000)/i).map((part, idx) =>
                /обычный сайт/i.test(part) ? (
                  <span key={idx} className="text-accent">
                    {part}
                  </span>
                ) : (
                  <span key={idx}>{part}</span>
                )
              )}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-accent/40"
              style={{ aspectRatio: `${process.finalSite.width} / ${process.finalSite.height}` }}
            >
              <Image
                src={process.finalSite.image}
                alt="Финальный сайт Coma"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="body-lg mt-5 text-ink-dim">
              но мы передали{" "}
              <span className="text-accent">главную идею</span> прямо на экране
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

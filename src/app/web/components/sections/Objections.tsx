import { objections } from "@/content/web/site";
import Reveal from "../Reveal";
import DemoCta from "../DemoCta";

export default function Objections() {
  return (
    <section className="relative w-full py-28 sm:py-36">
      <div className="shell">
        <Reveal as="h2" className="display text-[clamp(2.2rem,5.6vw,4.6rem)]">
          {objections.title}
        </Reveal>
        <Reveal delay={0.05} className="body-lg mt-5 max-w-[46ch] text-ink-dim">
          {objections.subtitle}
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <DemoCta label={objections.ctaLabel} />
        </Reveal>

        <ul className="mt-20 space-y-6">
          {objections.demoIncludes.map((item, i) => (
            <Reveal
              key={item}
              as="li"
              delay={i * 0.06}
              className="body-xl flex items-center gap-4 text-ink"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              {item}
            </Reveal>
          ))}
        </ul>

        {/* Оговорка о границах бесплатного демо: что именно человек
            получает и чем это не является. */}
        <Reveal delay={0.24} className="glass mt-16 max-w-[70ch] rounded-2xl p-7 sm:p-9">
          <p className="eyebrow text-[0.65rem]">{objections.disclaimerTitle}</p>
          <div className="mt-4 space-y-3 text-[clamp(0.95rem,1.15vw,1.15rem)] leading-relaxed text-ink-dim">
            {objections.disclaimer.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3} className="mt-16 border-t border-line pt-12">
          <p className="display text-[clamp(1.3rem,3vw,2.4rem)] text-ink">{objections.proof}</p>
        </Reveal>
      </div>
    </section>
  );
}

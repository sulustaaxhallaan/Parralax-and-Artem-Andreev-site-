import { pain, contacts } from "@/content/web/site";
import Reveal from "../Reveal";

/**
 * Сцена этой секции — та же, в которую упирается наезд на телефон,
 * поэтому своего фона у неё нет: она продолжает уже показанный кадр.
 */
export default function Pain() {
  return (
    <section id="pain" className="relative w-full overflow-hidden py-28 sm:py-36">
      <div className="shell relative">
        <Reveal as="h2" className="display max-w-[22ch] text-[clamp(2rem,5vw,4.2rem)] text-balance">
          {pain.title}
          <br />
          <span className="text-accent">{pain.titleAccent}</span>
        </Reveal>

        <div className="mt-20 space-y-12 sm:mt-28 sm:space-y-16">
          {pain.questions.map((q, i) => (
            <Reveal
              key={q}
              delay={i * 0.08}
              className="body-xl max-w-[26ch] text-ink drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]"
              style={{ marginLeft: `${Math.min(i * 12, 48)}%` }}
            >
              {q}
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4} className="mt-24 text-right sm:mt-32">
          <a
            href={contacts.whatsappUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="display inline-block text-[clamp(1.5rem,3.4vw,2.8rem)] text-accent underline decoration-2 underline-offset-8 transition-opacity hover:opacity-80"
          >
            {pain.closing}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

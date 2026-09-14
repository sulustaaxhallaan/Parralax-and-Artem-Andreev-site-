import { pricing, contacts } from "@/content/web/site";
import type { PricingTier } from "@/content/web/site";
import ParallaxImage from "../ParallaxImage";
import Reveal from "../Reveal";

function waLinkFor(tier: PricingTier) {
  const text = encodeURIComponent(
    `Здравствуйте! Интересует тариф «${tier.name}» (${tier.price}).`
  );
  return `${contacts.whatsappUrl}?text=${text}`;
}

/**
 * Карточка тарифа занимает половину кадра, вторая остаётся пустой —
 * там стоит объект со своего фона: молния, ракета, планета или чёрная
 * дыра. Сторона задаётся в контенте, чтобы текст не ложился на объект.
 *
 * Кадр привязан к самой карточке, а не к общей ленте на весь блок:
 * лента подгонялась по высоте под весь блок разом, карточки разной
 * высоты, и на широком окне кадры уезжали относительно тарифов.
 * Стык смягчает широкое растворение по краям — см. fade.
 */
function TierCard({ tier }: { tier: PricingTier }) {
  return (
    <section
      id={`tier-${tier.id}`}
      className="relative flex min-h-[110svh] w-full items-center overflow-hidden py-28"
    >
      <ParallaxImage
        src={tier.bgImage}
        alt=""
        fade="30%"
        overlayClassName="bg-[rgba(3,5,12,0.42)]"
      />

      <div className="shell relative grid w-full lg:grid-cols-2">
        <div
          className={
            tier.align === "right"
              ? "lg:col-start-2 lg:pl-6"
              : "lg:col-start-1 lg:pr-6"
          }
        >
          <Reveal
            as="h3"
            className="display text-[clamp(3.6rem,11vw,9rem)] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            style={{ color: tier.accent }}
          >
            {tier.name}
          </Reveal>

          <Reveal delay={0.06} className="display mt-2 text-[clamp(1.7rem,3.8vw,3rem)] text-ink">
            {tier.price}
          </Reveal>

          <Reveal delay={0.12} className="body-lg mt-7 max-w-[36ch] text-ink-dim">
            {tier.tagline}
          </Reveal>

          <Reveal
            delay={0.16}
            className="body-lg mt-3 font-semibold"
            style={{ color: tier.accent }}
          >
            {tier.timeline}
          </Reveal>

          <ul className="mt-10 space-y-2.5">
            {tier.features.map((feature, i) => (
              <Reveal
                key={feature}
                as="li"
                delay={0.2 + i * 0.025}
                className="flex items-start gap-3 text-[clamp(0.98rem,1.2vw,1.25rem)] leading-snug text-ink-dim drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: tier.accent }}
                />
                {feature}
              </Reveal>
            ))}
          </ul>

          {tier.result && (
            <Reveal
              delay={0.3}
              className="mt-9 max-w-[40ch] text-[clamp(0.95rem,1.15vw,1.2rem)] leading-relaxed text-ink-faint"
            >
              {tier.result}
            </Reveal>
          )}

          <Reveal delay={0.34} className="mt-11">
            <a
              href={waLinkFor(tier)}
              target="_blank"
              rel="noreferrer noopener"
              className="body-lg inline-flex items-center justify-center rounded-full px-10 py-5 font-semibold tracking-wide text-[var(--bg)] transition-transform hover:scale-105"
              style={{ backgroundColor: tier.accent }}
            >
              Обсудить «{tier.name}»
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default function Pricing() {
  return (
    <div id="pricing" className="relative w-full">
      <div className="shell pt-28 text-center">
        <Reveal as="p" className="eyebrow">
          {pricing.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={0.05} className="display mx-auto mt-5 max-w-4xl text-[clamp(2.2rem,5.6vw,4.6rem)]">
          {pricing.title}
        </Reveal>
      </div>

      <div className="relative">
        {pricing.tiers.map((tier) => (
          <TierCard key={tier.id} tier={tier} />
        ))}
      </div>
    </div>
  );
}

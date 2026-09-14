import { operator, privacy } from "@/content/web/site";

/**
 * Подвал со сведениями об операторе персональных данных. Держится
 * внизу страницы отдельным блоком: по 152-ФЗ эти сведения и политика
 * должны быть открыто доступны, а не спрятаны в форме согласия.
 *
 * Снизу оставлен запас под панель контактов — на узких экранах она
 * висит поверх страницы и иначе перекрыла бы последнюю строку.
 */
export default function Footer() {
  return (
    <footer className="relative w-full border-t border-line py-14 pb-32 lg:pb-14">
      <div className="shell flex flex-col gap-6 text-[clamp(0.85rem,1vw,1rem)] leading-relaxed text-ink-faint lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-ink-dim">{operator.name}</p>
          <p className="mt-1">{operator.inn}</p>
        </div>

        <div className="flex flex-col gap-1 lg:items-end">
          <a
            href={operator.phoneHref}
            className="transition-colors hover:text-accent"
          >
            {operator.phoneDisplay}
          </a>
          <a
            href={`mailto:${operator.email}`}
            className="transition-colors hover:text-accent"
          >
            {operator.email}
          </a>
          <a
            href={privacy.policyUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 underline underline-offset-4 transition-colors hover:text-accent"
          >
            {privacy.policyTitle}
          </a>
          <a
            href={privacy.consentUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="underline underline-offset-4 transition-colors hover:text-accent"
          >
            {privacy.consentTitle}
          </a>
          <p className="mt-2 text-ink-faint/70">{privacy.docsYear}</p>
        </div>
      </div>

      {/* Оговорка об оферте — во всю ширину под реквизитами, чтобы её
          было видно, а не искать среди контактов. */}
      <div className="shell mt-10 border-t border-line pt-6">
        <p className="max-w-[80ch] text-[clamp(0.8rem,0.95vw,0.95rem)] leading-relaxed text-ink-faint/80">
          {operator.disclaimer}
        </p>
      </div>
    </footer>
  );
}

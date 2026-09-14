"use client";

import { useId, useState } from "react";

import { demoFormUrl, privacy, demoRequest, whatsappWith } from "@/content/web/site";

/**
 * Кнопка заявки на демо с согласием на обработку персональных данных.
 *
 * Пока галочка не стоит, ведёт себя как выключенная кнопка, а не как
 * ссылка: так на форму нельзя попасть ни щелчком, ни с клавиатуры, ни
 * через «открыть в новой вкладке» из контекстного меню.
 */
export default function DemoCta({ label }: { label: string }) {
  const [agreed, setAgreed] = useState(false);
  const id = useId();

  const shared =
    "body-lg inline-flex items-center justify-center rounded-full border px-10 py-5 font-semibold tracking-wide transition-colors";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        {agreed ? (
          <a
            href={demoFormUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={`${shared} border-accent text-accent hover:bg-accent hover:text-[var(--bg)]`}
          >
            {label}
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-describedby={id}
            className={`${shared} cursor-not-allowed border-line text-ink-faint`}
          >
            {label}
          </button>
        )}

        {/* Быстрый путь мимо формы: сразу в WhatsApp с готовым текстом.
            Согласием не закрыт — здесь сайт ничего не собирает, человек
            пишет сам и из своего мессенджера. */}
        <a
          href={whatsappWith(demoRequest.message)}
          target="_blank"
          rel="noreferrer noopener"
          className={`${shared} border-ink/40 text-ink hover:border-accent hover:text-accent`}
        >
          {demoRequest.writeLabel}
        </a>
      </div>

      <label
        id={id}
        htmlFor={`${id}-check`}
        className="mt-6 flex max-w-[52ch] cursor-pointer items-start gap-3 text-[clamp(0.9rem,1.05vw,1.05rem)] leading-snug text-ink-dim"
      >
        <input
          id={`${id}-check`}
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--accent)]"
        />
        <span>
          {privacy.consentBefore}
          <a
            href={privacy.consentUrl}
            target="_blank"
            rel="noreferrer noopener"
            title={privacy.consentTitle}
            // Иначе щелчок по ссылке заодно переключал бы галочку:
            // ссылка лежит внутри подписи к полю.
            onClick={(e) => e.stopPropagation()}
            className="text-accent underline underline-offset-4 hover:opacity-80"
          >
            {privacy.consentLinkText}
          </a>
          {privacy.consentAfter}
          <a
            href={privacy.policyUrl}
            target="_blank"
            rel="noreferrer noopener"
            title={privacy.policyTitle}
            onClick={(e) => e.stopPropagation()}
            className="text-accent underline underline-offset-4 hover:opacity-80"
          >
            {privacy.policyLinkText}
          </a>
        </span>
      </label>
    </div>
  );
}

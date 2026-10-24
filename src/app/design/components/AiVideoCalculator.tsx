"use client";

import { useId, useRef, useState } from "react";

import type { aiVideo } from "@/content/design/prices";
import {
    AI_VIDEO_LIMITS,
    formatRub,
    quoteAiVideo,
    type AiVideoField,
    type AiVideoInput,
    type AiVideoLanguage,
    type AiVideoQuote,
    type AiVideoRates,
} from "@/lib/aiVideoQuote";

type Texts = (typeof aiVideo)["calculator"];

/* Стартовые значения — пример из прайса: 11 AI-шотов, 1 шот из
   изображения клиента и 15 секунд озвучки, итого 6 200 ₽. Человек
   сразу видит все строки расчёта и правит от готового примера. */
const START: AiVideoInput = {
    duration: "60",
    clientShots: "1",
    newShots: "11",
    voice: true,
    speech: "15",
    language: "ru",
};

export default function AiVideoCalculator({
    rates,
    texts,
    whatsappHref,
}: {
    rates: AiVideoRates;
    texts: Texts;
    /** ссылка wa.me без текста — сообщение калькулятор добавит сам */
    whatsappHref: string;
}) {
    const [form, setForm] = useState<AiVideoInput>(START);
    const speechRef = useRef<HTMLInputElement>(null);
    const titleId = useId();
    const shotsErrorId = useId();

    const { issues, quote } = quoteAiVideo(form, rates);
    const errorOf = (field: AiVideoField) =>
        issues.find((issue) => issue.field === field)?.message;
    const set = <K extends keyof AiVideoInput>(key: K, value: AiVideoInput[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const shotsError = errorOf("shots");
    const { fields, result } = texts;

    return (
        <section
            aria-labelledby={titleId}
            className="glass mt-9 rounded-[18px] p-5 sm:p-7"
        >
            <h3
                id={titleId}
                className="display display-wrap text-[1.05rem] uppercase tracking-[0.04em] sm:text-[1.2rem]"
            >
                {texts.title}
            </h3>
            <p className="mt-2.5 max-w-[640px] text-[0.88rem] leading-[1.7] text-ink-faint sm:text-[0.95rem]">
                {texts.lead}
            </p>

            {/* Поля и результат рядом — только когда колонке хватает
                ширины; до 1280px результат идёт под полями, и на
                телефоне сумма видна сразу после последнего поля. */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(260px,0.9fr)] xl:gap-8">
                <form
                    noValidate
                    onSubmit={(event) => event.preventDefault()}
                    className="grid content-start gap-5"
                >
                    <NumberField
                        label={fields.duration}
                        value={form.duration}
                        onChange={(value) => set("duration", value)}
                        error={errorOf("duration")}
                        max={AI_VIDEO_LIMITS.duration.max}
                    />

                    <div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <NumberField
                                label={fields.newShots}
                                value={form.newShots}
                                onChange={(value) => set("newShots", value)}
                                error={errorOf("newShots")}
                                groupError={shotsError ? shotsErrorId : undefined}
                                max={AI_VIDEO_LIMITS.shots.max}
                                stepper
                            />
                            <NumberField
                                label={fields.clientShots}
                                value={form.clientShots}
                                onChange={(value) => set("clientShots", value)}
                                error={errorOf("clientShots")}
                                groupError={shotsError ? shotsErrorId : undefined}
                                max={AI_VIDEO_LIMITS.shots.max}
                                stepper
                            />
                        </div>
                        {shotsError ? <ErrorText id={shotsErrorId}>{shotsError}</ErrorText> : null}
                    </div>

                    <Segmented
                        legend={fields.voice}
                        value={form.voice ? "on" : "off"}
                        options={[
                            { value: "off", label: fields.voiceOff },
                            { value: "on", label: fields.voiceOn },
                        ]}
                        onChange={(value) => {
                            set("voice", value === "on");
                            // Поле речи появляется пустым — сразу ставим
                            // в него курсор, а не подставляем число за человека.
                            if (value === "on") {
                                requestAnimationFrame(() => speechRef.current?.focus());
                            }
                        }}
                    />

                    {form.voice ? (
                        <div className="grid gap-5 border-l border-[rgba(127,210,240,0.34)] pl-4">
                            <NumberField
                                inputRef={speechRef}
                                label={fields.speech}
                                value={form.speech}
                                onChange={(value) => set("speech", value)}
                                error={errorOf("speech")}
                                max={AI_VIDEO_LIMITS.duration.max}
                            />
                            <div>
                                <Segmented<AiVideoLanguage>
                                    legend={fields.language}
                                    value={form.language}
                                    options={[
                                        { value: "ru", label: texts.languages.ru },
                                        { value: "en", label: texts.languages.en },
                                    ]}
                                    onChange={(value) => set("language", value)}
                                />
                                <p className="mt-2 text-[0.82rem] text-ink-faint">
                                    {texts.yakutNote}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </form>

                <div className="self-start rounded-[14px] border border-line bg-[rgba(3,6,13,0.5)] p-5 sm:p-6">
                    <strong className="display block text-[0.82rem] uppercase tracking-[0.1em] text-accent">
                        {result.title}
                    </strong>

                    <dl className="mt-4 grid gap-3.5 text-[0.88rem] sm:text-[0.95rem]">
                        <Line
                            label={result.newShots}
                            value={quote ? formatRub(quote.newShots.sum) : "—"}
                        />
                        <Line
                            label={result.clientShots}
                            value={quote ? formatRub(quote.clientShots.sum) : "—"}
                        />
                        <Line label={result.montage} value={result.montageIncluded} />
                        <Line
                            label={result.voice}
                            value={
                                !form.voice
                                    ? result.voiceNone
                                    : quote?.voice
                                      ? formatRub(quote.voice.sum)
                                      : "—"
                            }
                        />
                    </dl>

                    <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                        <span className="text-[0.95rem] font-medium text-ink sm:text-[1.05rem]">
                            {result.total}
                        </span>
                        {/* Читалке экрана объявляем только итог, а не каждую
                            строку: иначе на каждую цифру — пять сообщений. */}
                        <output
                            aria-live="polite"
                            className="display text-[clamp(1.5rem,3.2vw,2.1rem)] text-accent"
                        >
                            {quote ? formatRub(quote.total) : "—"}
                        </output>
                    </div>
                    {!quote ? (
                        <p className="mt-2 text-[0.82rem] text-[#f3b2b2]">{result.invalid}</p>
                    ) : null}

                    <p className="mt-4 text-[0.78rem] leading-[1.6] text-ink-faint sm:text-[0.82rem]">
                        {result.note}
                    </p>

                    <a
                        href={`${whatsappHref}?text=${encodeURIComponent(
                            whatsappMessage(form, quote, texts),
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-[rgba(127,210,240,0.34)] px-4 text-[0.9rem] text-accent transition-colors duration-300 hover:border-accent hover:bg-[rgba(127,210,240,0.07)]"
                    >
                        {result.discuss}
                    </a>
                </div>
            </div>
        </section>
    );
}

/* Сообщение для WhatsApp: что человек посчитал, построчно. Если
   параметры не сходятся, суммы нет — отправляем одно приветствие,
   а не цифры, которые калькулятор сам не принял. */
function whatsappMessage(form: AiVideoInput, quote: AiVideoQuote | null, texts: Texts) {
    const { whatsapp, result, languages } = texts;
    if (!quote) return whatsapp.greeting;

    // Неразрывные пробелы из сумм в мессенджере не нужны
    const plain = (text: string) => text.replace(/\s/g, " ");
    const voice = quote.voice
        ? `${quote.voice.seconds} с, ${languages[quote.voice.language].toLowerCase()}`
        : result.voiceNone;

    return [
        whatsapp.greeting,
        "",
        `${whatsapp.duration}: ${form.duration.trim()} с`,
        `${result.newShots}: ${quote.newShots.count}`,
        `${whatsapp.clientShots}: ${quote.clientShots.count}`,
        `${result.voice}: ${voice}`,
        `${whatsapp.total}: ${plain(formatRub(quote.total))}`,
    ].join("\n");
}

function Line({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <dt className="min-w-0 text-ink-faint">{label}</dt>
            <dd className="m-0 flex-none whitespace-nowrap text-right text-accent">{value}</dd>
        </div>
    );
}

function ErrorText({ id, children }: { id?: string; children: React.ReactNode }) {
    return (
        <p id={id} className="mt-2 text-[0.82rem] leading-[1.55] text-[#f3b2b2] sm:text-[0.88rem]">
            {children}
        </p>
    );
}

/* Поле для целого числа. type="text" + inputMode="numeric", а не
   type="number": числовое поле молча отдаёт пустую строку на «2,5»,
   крутит значение колёсиком мыши и прячет ошибку от проверки. Здесь
   что введено, то и проверяется. */
function NumberField({
    label,
    value,
    onChange,
    error,
    groupError,
    max,
    stepper = false,
    inputRef,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    /** id общей ошибки пары полей (шоты не сходятся с длительностью) */
    groupError?: string;
    max: number;
    stepper?: boolean;
    inputRef?: React.Ref<HTMLInputElement>;
}) {
    const id = useId();
    const errorId = `${id}-error`;
    const invalid = Boolean(error) || Boolean(groupError);

    // Кнопки меняют число только по нажатию и только в пределах поля:
    // на границе кнопка выключается, а не обрезает значение, а пока в
    // поле не число, выключены обе — подставлять своё не будем.
    const parsed = /^\d+$/.test(value.trim()) ? Number(value.trim()) : null;
    const step = (delta: number) => {
        if (parsed !== null) onChange(String(parsed + delta));
    };

    const input = (
        <input
            ref={inputRef}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            enterKeyHint="done"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={invalid || undefined}
            aria-describedby={[error ? errorId : null, groupError ?? null].filter(Boolean).join(" ") || undefined}
            className="min-h-[44px] w-full min-w-0 rounded-[10px] border border-[rgba(127,210,240,0.34)] bg-[rgba(3,6,13,0.55)] px-3.5 text-[1rem] text-ink outline-none transition-colors duration-200 focus:border-accent aria-[invalid=true]:border-[rgba(243,150,150,0.6)]"
        />
    );

    return (
        <div className="min-w-0">
            <label htmlFor={id} className="block text-[0.86rem] text-ink-faint sm:text-[0.9rem]">
                {label}
            </label>
            {stepper ? (
                <div className="mt-2 flex gap-2">
                    <StepButton
                        label={`Уменьшить: ${label}`}
                        disabled={parsed === null || parsed <= 0}
                        onClick={() => step(-1)}
                    >
                        −
                    </StepButton>
                    {input}
                    <StepButton
                        label={`Увеличить: ${label}`}
                        disabled={parsed === null || parsed >= max}
                        onClick={() => step(1)}
                    >
                        +
                    </StepButton>
                </div>
            ) : (
                <div className="mt-2">{input}</div>
            )}
            {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
        </div>
    );
}

function StepButton({
    label,
    disabled,
    onClick,
    children,
}: {
    label: string;
    disabled: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className="grid h-11 w-11 flex-none place-items-center rounded-[10px] border border-[rgba(127,210,240,0.34)] text-[1.15rem] text-accent transition-colors duration-200 hover:border-accent hover:bg-[rgba(127,210,240,0.07)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[rgba(127,210,240,0.34)] disabled:hover:bg-transparent"
        >
            {children}
        </button>
    );
}

/** Переключатель из двух-трёх вариантов: радиокнопки, оформленные пилюлями. */
function Segmented<T extends string>({
    legend,
    value,
    options,
    onChange,
}: {
    legend: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (value: T) => void;
}) {
    const name = useId();
    return (
        <fieldset className="min-w-0">
            <legend className="text-[0.86rem] text-ink-faint sm:text-[0.9rem]">{legend}</legend>
            <div className="mt-2 inline-flex flex-wrap gap-1 rounded-full border border-[rgba(127,210,240,0.34)] p-1">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex min-h-[38px] cursor-pointer items-center rounded-full px-4 text-[0.9rem] text-ink-faint transition-colors duration-200 hover:text-accent has-[:checked]:bg-[rgba(127,210,240,0.12)] has-[:checked]:text-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-accent"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </fieldset>
    );
}

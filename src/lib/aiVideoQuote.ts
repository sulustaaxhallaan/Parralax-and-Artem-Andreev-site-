/* ==================================================================
   Расчёт рекламного AI-ролика для калькулятора на /design/prices.

   Здесь только арифметика и проверки, без React и без текстов прайса:
   ставки приходят параметром из src/content/design/prices.ts, чтобы
   цена в тарифе и цена в калькуляторе не могли разойтись.

   Введённые значения не исправляются молча. Несовместимые параметры
   возвращаются ошибками, и суммы тогда нет: показывать цену заказа,
   который так собрать нельзя, хуже, чем не показывать никакой.
================================================================== */

export type AiVideoRates = {
    /** шот из готового изображения клиента */
    clientShot: number;
    /** первый AI-шот ролика: изображение создаётся с нуля */
    newShot: number;
    /**
     * Каждый следующий AI-шот того же ролика. Дешевле первого: стиль,
     * герои и задание уже согласованы, и полную цену генерации с нуля
     * на каждый шот не умножаем.
     */
    newShotNext: number;
    /** озвучка за один интервал речи */
    voicePerStep: number;
    /** длина интервала озвучки, с */
    voiceStepSeconds: number;
    /** предельная длительность одного шота, с */
    shotMaxSeconds: number;
};

export type AiVideoLanguage = "ru" | "en";

/** Значения полей как есть — строками, ровно то, что ввёл человек. */
export type AiVideoInput = {
    duration: string;
    clientShots: string;
    newShots: string;
    voice: boolean;
    speech: string;
    language: AiVideoLanguage;
};

export type AiVideoField = "duration" | "clientShots" | "newShots" | "shots" | "speech";

export type AiVideoIssue = { field: AiVideoField; message: string };

export type AiVideoQuote = {
    /** первый AI-шот по полной цене, остальные — по цене следующего */
    newShots: { count: number; first: number; next: number; sum: number };
    clientShots: { count: number; unit: number; sum: number };
    voice: null | {
        language: AiVideoLanguage;
        seconds: number;
        billedSeconds: number;
        steps: number;
        sum: number;
    };
    total: number;
};

export type AiVideoResult = {
    issues: AiVideoIssue[];
    quote: AiVideoQuote | null;
};

/** Пределы полей. Шире — уже не «рекламный ролик», а отдельный проект. */
export const AI_VIDEO_LIMITS = {
    duration: { min: 1, max: 600 },
    shots: { min: 0, max: 60 },
} as const;

export function quoteAiVideo(input: AiVideoInput, rates: AiVideoRates): AiVideoResult {
    const issues: AiVideoIssue[] = [];
    const { duration: dLim, shots: sLim } = AI_VIDEO_LIMITS;

    const duration = parseCount(input.duration, dLim.min, dLim.max, "duration", "длительность ролика", issues);
    const clientShots = parseCount(input.clientShots, sLim.min, sLim.max, "clientShots", "число шотов из ваших изображений", issues);
    const newShots = parseCount(input.newShots, sLim.min, sLim.max, "newShots", "число AI-шотов", issues);

    // Согласованность шотов и длительности проверяем, только когда
    // все три числа корректны — иначе сообщение было бы о мусоре.
    if (duration !== null && clientShots !== null && newShots !== null) {
        const shots = clientShots + newShots;
        const minShots = Math.ceil(duration / rates.shotMaxSeconds);
        if (shots === 0) {
            issues.push({ field: "shots", message: "Добавьте хотя бы один шот." });
        } else if (shots < minShots) {
            issues.push({
                field: "shots",
                message:
                    `Ролику ${duration}\u00a0с нужно минимум ${minShots} ${plural(minShots, SHOTS)} ` +
                    `(шот — до ${rates.shotMaxSeconds}\u00a0с), сейчас ${shots}.`,
            });
        } else if (shots > duration) {
            issues.push({
                field: "shots",
                message: `${shots} ${plural(shots, SHOTS)} не уложатся в ${duration}\u00a0с: на шот нужна хотя бы секунда.`,
            });
        }
    }

    let speech: number | null = null;
    if (input.voice) {
        speech = parseCount(input.speech, 1, dLim.max, "speech", "длительность речи", issues);
        if (speech !== null && duration !== null && speech > duration) {
            issues.push({
                field: "speech",
                message: `Речь длиннее ролика: ${speech}\u00a0с при ролике ${duration}\u00a0с.`,
            });
        }
    }

    if (issues.length > 0 || duration === null || clientShots === null || newShots === null) {
        return { issues, quote: null };
    }

    const quote: AiVideoQuote = {
        newShots: {
            count: newShots,
            first: rates.newShot,
            next: rates.newShotNext,
            sum: newShots === 0 ? 0 : rates.newShot + (newShots - 1) * rates.newShotNext,
        },
        clientShots: { count: clientShots, unit: rates.clientShot, sum: clientShots * rates.clientShot },
        voice: null,
        total: 0,
    };
    if (input.voice && speech !== null) {
        const steps = Math.ceil(speech / rates.voiceStepSeconds);
        quote.voice = {
            language: input.language,
            seconds: speech,
            billedSeconds: steps * rates.voiceStepSeconds,
            steps,
            sum: steps * rates.voicePerStep,
        };
    }
    quote.total = quote.newShots.sum + quote.clientShots.sum + (quote.voice?.sum ?? 0);
    return { issues, quote };
}

/** Целое неотрицательное число из поля или ошибка — без округлений и подстановок. */
function parseCount(
    raw: string,
    min: number,
    max: number,
    field: AiVideoField,
    label: string,
    issues: AiVideoIssue[],
): number | null {
    const value = raw.trim();
    if (value === "") {
        issues.push({ field, message: `Укажите ${label}.` });
        return null;
    }
    if (!/^\d+$/.test(value)) {
        issues.push({ field, message: `${capitalize(label)}: только целое число.` });
        return null;
    }
    const n = Number(value);
    if (n < min || n > max) {
        issues.push({ field, message: `${capitalize(label)}: от ${min} до ${max}.` });
        return null;
    }
    return n;
}

export const SHOTS: Plural = ["шот", "шота", "шотов"];

type Plural = readonly [one: string, few: string, many: string];

/** «1 шот», «3 шота», «11 шотов» */
export function plural(n: number, forms: Plural): string {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return forms[0];
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
    return forms[2];
}

/** «4 500 ₽»: неразрывные пробелы, чтобы сумма не рвалась на две строки. */
export function formatRub(n: number): string {
    return `${new Intl.NumberFormat("ru-RU").format(n).replace(/\s/g, "\u00a0")}\u00a0₽`;
}

function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

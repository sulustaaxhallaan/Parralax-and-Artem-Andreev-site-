"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { feedback } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Окно обратной связи.
 *
 * Пока в content/site.ts не указан `feedback.endpoint`, форма собирает
 * письмо и открывает почтовый клиент — сайт работает без бэкенда.
 * Как только впишешь URL обработчика, форма начнёт слать туда POST.
 */
export default function FeedbackForm() {
    const [status, setStatus] = useState<Status>("idle");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);
        const payload = {
            name: String(data.get("name") ?? "").trim(),
            contact: String(data.get("contact") ?? "").trim(),
            message: String(data.get("message") ?? "").trim(),
        };

        setStatus("sending");

        // Без бэкенда: открываем почтовый клиент с готовым письмом
        if (!feedback.endpoint) {
            const subject = `Заявка с сайта — ${payload.name || "без имени"}`;
            const body = [
                `Имя: ${payload.name}`,
                `Контакт: ${payload.contact}`,
                "",
                payload.message,
            ].join("\n");

            window.location.href = `mailto:${feedback.mailTo}?subject=${encodeURIComponent(
                subject,
            )}&body=${encodeURIComponent(body)}`;

            setStatus("sent");
            form.reset();
            return;
        }

        try {
            const res = await fetch(feedback.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(String(res.status));

            setStatus("sent");
            form.reset();
        } catch {
            setStatus("error");
        }
    }

    return (
        <div className="glass rounded-2xl p-4 sm:p-7">
            <h3 className="display text-[0.78rem] tracking-[0.3em] text-accent">
                {feedback.title}
            </h3>
            <p className="mt-2 text-[0.75rem] leading-5 text-ink-dim sm:mt-2.5 sm:text-[0.8rem]">
                {feedback.lead}
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5">
                <Field
                    name="name"
                    label={feedback.fields.name.label}
                    placeholder={feedback.fields.name.placeholder}
                    required
                />

                <Field
                    name="contact"
                    label={feedback.fields.contact.label}
                    placeholder={feedback.fields.contact.placeholder}
                    required
                />

                <label className="block">
                    <span className="text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
                        {feedback.fields.message.label}
                    </span>
                    <textarea
                        name="message"
                        rows={3}
                        required
                        placeholder={feedback.fields.message.placeholder}
                        className="mt-1.5 h-[64px] w-full resize-none rounded-lg border border-line bg-[rgba(4,10,20,0.5)] px-3.5 py-2 text-[0.86rem] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-[rgba(127,210,240,0.55)] sm:h-auto sm:py-2.5"
                    />
                </label>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className="rounded-full border border-[rgba(127,210,240,0.45)] px-6 py-2.5 text-[0.78rem] uppercase tracking-[0.2em] text-accent transition-all duration-300 hover:border-accent hover:bg-[rgba(127,210,240,0.08)] disabled:opacity-50"
                    >
                        {status === "sending" ? feedback.sending : feedback.submit}
                    </button>

                    <AnimatePresence mode="wait">
                        {status === "sent" && (
                            <Note key="sent" tone="ok">
                                {feedback.success}
                            </Note>
                        )}
                        {status === "error" && (
                            <Note key="error" tone="bad">
                                {feedback.error}
                            </Note>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </div>
    );
}

function Field({
    name,
    label,
    placeholder,
    required,
}: {
    name: string;
    label: string;
    placeholder: string;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="text-[0.68rem] uppercase tracking-[0.22em] text-ink-faint">
                {label}
            </span>
            <input
                type="text"
                name={name}
                required={required}
                placeholder={placeholder}
                className="mt-1.5 w-full rounded-lg border border-line bg-[rgba(4,10,20,0.5)] px-3.5 py-2.5 text-[0.86rem] text-ink outline-none transition-colors duration-200 placeholder:text-ink-faint focus:border-[rgba(127,210,240,0.55)]"
            />
        </label>
    );
}

function Note({
    children,
    tone,
}: {
    children: React.ReactNode;
    tone: "ok" | "bad";
}) {
    return (
        <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className={`text-[0.75rem] leading-5 ${
                tone === "ok" ? "text-accent" : "text-[#f0a5a5]"
            }`}
        >
            {children}
        </motion.p>
    );
}

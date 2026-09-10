/** Простые контурные иконки — под стиль черновика. */

export type IconName =
    | "phone"
    | "mail"
    | "instagram"
    | "whatsapp"
    | "telegram"
    | "behance";

const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export default function Icon({
    name,
    className = "h-5 w-5",
}: {
    name: IconName;
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
            {name === "phone" && (
                <path d="M6.5 3h-2A1.5 1.5 0 0 0 3 4.6C3 13 11 21 19.4 21A1.5 1.5 0 0 0 21 19.5v-2a1 1 0 0 0-.8-1l-3.4-.7a1 1 0 0 0-1 .4l-1 1.3a13.6 13.6 0 0 1-6.3-6.3l1.3-1a1 1 0 0 0 .4-1l-.7-3.4a1 1 0 0 0-1-.8Z" />
            )}

            {name === "mail" && (
                <>
                    <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
                    <path d="m3.5 6.5 8.5 6 8.5-6" />
                </>
            )}

            {name === "instagram" && (
                <>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" />
                </>
            )}

            {name === "whatsapp" && (
                <>
                    <path d="M3.5 20.5 5 16.4A8.2 8.2 0 1 1 8 19.3l-4.5 1.2Z" />
                    <path d="M9 8.5c.3 1.2.9 2.3 1.8 3.2.9.9 2 1.5 3.2 1.8l1-1.2 1.9.8-.4 1.6c-1.9.4-4-.5-5.6-2.1-1.6-1.6-2.5-3.7-2.1-5.6l1.6-.4.8 1.9L9 8.5Z" />
                </>
            )}

            {name === "telegram" && (
                <>
                    <path d="M21 4.5 2.8 11.3l4.9 1.6L20 6l-9.6 8.5.4 4.6 2.6-3.4 4.3 3.1L21 4.5Z" />
                </>
            )}

            {/* Знак Behance — «Bē»: две чаши буквы B и строчная e
                с чертой над ней. Контуром, как остальные иконки. */}
            {name === "behance" && (
                <>
                    <path d="M3.4 7h4.1a2.5 2.5 0 0 1 0 5H3.4V7" />
                    <path d="M3.4 12h4.6a2.5 2.5 0 0 1 0 5H3.4v-5" />
                    <path d="M14 7.6h6" />
                    <path d="M13.6 13.6h6.8" />
                    <path d="M20.4 13.6a3.4 3.4 0 1 0-1.1 2.5" />
                </>
            )}
        </svg>
    );
}

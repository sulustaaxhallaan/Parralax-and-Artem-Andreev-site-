import { contacts } from "@/content/web/site";
import { MailIcon, WhatsAppIcon, TelegramIcon } from "./Icons";

const items = [
  { href: `mailto:${contacts.email}`, label: "Email", Icon: MailIcon, external: false },
  { href: contacts.whatsappUrl, label: "WhatsApp", Icon: WhatsAppIcon, external: true },
  { href: contacts.telegramUrl, label: "Telegram", Icon: TelegramIcon, external: true },
];

/**
 * Контакты, закреплённые поверх всех секций: на широких экранах —
 * колонкой у левого края, на узких — полоской снизу. Ширина панели
 * скомпенсирована отступом у .shell, чтобы она не наезжала на текст.
 */
export default function SocialRail() {
  return (
    <nav
      aria-label="Контакты"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:w-[72px] lg:flex-col lg:items-center lg:justify-center lg:px-0 lg:pb-0"
    >
      <ul className="glass flex items-center gap-2 rounded-full px-3 py-2 lg:flex-col lg:gap-3 lg:rounded-2xl lg:px-2.5 lg:py-4">
        {items.map(({ href, label, Icon, external }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink-dim transition-colors hover:bg-white/5 hover:text-accent"
            >
              <Icon className="h-5 w-5" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

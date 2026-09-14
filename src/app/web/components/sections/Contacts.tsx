import { contactsSection, contacts } from "@/content/web/site";
import Reveal from "../Reveal";
import { PhoneIcon, MailIcon, TelegramIcon } from "../Icons";

export default function Contacts() {
  return (
    <section className="relative flex min-h-[85svh] w-full flex-col justify-between py-28">
      <div className="shell text-center">
        <Reveal as="h2" className="display text-[clamp(2.2rem,6vw,5rem)]">
          {contactsSection.title}
        </Reveal>
        <Reveal delay={0.05} className="body-lg mt-4 text-ink-dim">
          {contactsSection.subtitle}
        </Reveal>

        <div className="mx-auto mt-16 flex w-fit flex-col items-start gap-7 text-left">
          <Reveal
            delay={0.1}
            as="a"
            href={contacts.phoneHref}
            className="flex items-center gap-5 text-[clamp(1.3rem,2.6vw,2.2rem)] text-ink transition-colors hover:text-accent"
          >
            <PhoneIcon className="h-7 w-7 shrink-0 text-accent" />
            {contacts.phoneDisplay}
          </Reveal>
          <Reveal
            delay={0.16}
            as="a"
            href={`mailto:${contacts.email}`}
            className="flex items-center gap-5 text-[clamp(1.3rem,2.6vw,2.2rem)] text-ink transition-colors hover:text-accent"
          >
            <MailIcon className="h-7 w-7 shrink-0 text-accent" />
            {contacts.email}
          </Reveal>
          <Reveal
            delay={0.22}
            as="a"
            href={contacts.telegramUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-5 text-[clamp(1.3rem,2.6vw,2.2rem)] text-ink transition-colors hover:text-accent"
          >
            <TelegramIcon className="h-7 w-7 shrink-0 text-accent" />
            {contacts.telegramHandle}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

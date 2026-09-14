import { hero, nav, demoRequest, whatsappWith } from "@/content/web/site";
import { ArrowDownIcon } from "../Icons";

/**
 * Содержимое первого экрана. Живёт поверх кадра с ноутбуком
 * (см. DeviceZoom) и уезжает, когда камера идёт вперёд.
 *
 * Мелкого текста здесь намеренно нет: первый экран держится на трёх
 * крупных вещах — надпись бренда, заголовок и подпись, — а всё
 * остальное убрано, чтобы не дробить кадр.
 */
export default function Hero() {
  return (
    /* Снизу на узких экранах закреплена панель контактов — оставляем
       под неё поле, иначе подпись уходит под неё. */
    <div className="relative flex h-full w-full flex-col justify-between pt-[6vh] pb-[15vh] lg:pb-[6vh]">
      {/* Фоновая надпись бренда — одной строкой во всю ширину */}
      <span
        aria-hidden
        className="display pointer-events-none absolute inset-x-0 top-[2vh] select-none whitespace-nowrap text-center text-[19vw] leading-none text-brand lg:top-[7vh]"
        style={{ textShadow: "0 0 42px rgba(47,155,255,0.55)" }}
      >
        {nav.brand}
      </span>

      {/* На узких экранах текст живёт в верхней половине, а ноутбук —
          в нижней, иначе заголовок ложится прямо на корпус. */}
      {/* Надпись бренда поднята к самому верху, а заголовок опущен —
          иначе на узком экране они слипаются в один блок. */}
      <div className="shell relative flex flex-1 flex-col items-start justify-start pt-[13vh] lg:justify-center lg:pt-0">
        <h1 className="display w-full max-w-[15ch] text-[clamp(2.3rem,7.4vw,7rem)] text-ink text-balance drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)]">
          {hero.title}
          <br />
          {hero.titleLine2}{" "}
          <span className="text-accent">{hero.accent}</span>
        </h1>

        {/* Ведёт в WhatsApp с уже набранным сообщением — человеку
            остаётся только нажать «отправить». */}
        <a
          href={whatsappWith(demoRequest.message)}
          target="_blank"
          rel="noreferrer noopener"
          className="display mt-6 inline-flex items-center justify-center rounded-full bg-brand px-8 py-4 text-center text-[clamp(1.15rem,2.1vw,1.9rem)] leading-snug text-white shadow-[0_0_46px_rgba(47,155,255,0.55)] transition-[transform,box-shadow] hover:scale-[1.03] hover:shadow-[0_0_64px_rgba(47,155,255,0.75)] sm:mt-12 sm:px-14 sm:py-6"
        >
          {demoRequest.heroLabel}
        </a>
      </div>

      {/* Иконки контактов сюда не ставим: они висят отдельной панелью
          на всех секциях сразу (см. SocialRail). */}
      <div className="shell relative flex justify-end">
        <p className="max-w-[20ch] text-right text-[clamp(1.15rem,1.9vw,1.75rem)] leading-snug text-ink-dim drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
          {hero.subline}{" "}
          <span className="font-semibold text-ink">{hero.sublineStrong}</span>
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden justify-center text-ink-faint lg:flex">
        <ArrowDownIcon className="h-7 w-7 animate-bounce" />
      </div>
    </div>
  );
}

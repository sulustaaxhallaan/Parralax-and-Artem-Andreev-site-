import { faq } from "@/content/web/site";
import Reveal from "../Reveal";

/**
 * Вопросы и ответы. На широком экране идут в две колонки, как в макете;
 * колонки собраны через CSS columns, поэтому список остаётся одним
 * потоком — пары «вопрос-ответ» не приходится делить руками пополам,
 * и при добавлении вопроса ничего не надо перекладывать.
 */
export default function Faq() {
  return (
    <section className="relative w-full py-28 sm:py-36">
      <div className="shell">
        <Reveal
          as="h2"
          className="display text-center text-[clamp(2.2rem,5.6vw,4.8rem)]"
          style={{ color: "var(--faq-title)" }}
        >
          {faq.title}
        </Reveal>

        {/* Ширину абзаца не ограничиваем: колонка и так вдвое уже
            страницы, и лишний предел оставлял треть колонки пустой. */}
        <div className="mt-16 gap-x-20 sm:mt-20 lg:columns-2">
          {faq.items.map((item, i) => (
            <Reveal
              key={item.q}
              delay={(i % 5) * 0.05}
              className="mb-12 break-inside-avoid"
            >
              <h3
                className="display text-[clamp(1.2rem,2vw,2.1rem)] leading-tight"
                style={{ color: "var(--faq-question)" }}
              >
                {item.q}
              </h3>
              <p className="mt-4 text-[clamp(1.05rem,1.45vw,1.6rem)] leading-relaxed text-ink">
                {item.a}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

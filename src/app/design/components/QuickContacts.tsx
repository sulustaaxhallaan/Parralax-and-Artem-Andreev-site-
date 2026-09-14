"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { contacts } from "@/content/design/site";
import Icon from "./Icons";

/** Внутренние адреса водим через Link — иначе прайс грузился бы заново */
const isInternal = (href: string) => href.startsWith("/");

/**
 * Связаться можно с любой секции, не долистывая до конца.
 *
 * Сбоку панель стоит только с 1280px — там у контейнера есть внешнее
 * поле, и она зеркалит точки навигации справа. Уже — уходит вниз по
 * центру: на 1024 и меньше левый край занят текстом секций.
 *
 * Контейнер прозрачен для курсора, ловят только сами кнопки — иначе
 * панель перехватывала бы перетаскивание ленты кейсов, которая
 * растянута на всю ширину.
 */
export default function QuickContacts() {
    const reduced = useReducedMotion();

    return (
        <div
            className="pointer-events-none fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 xl:bottom-auto xl:left-4 xl:top-1/2 xl:-translate-x-0 xl:-translate-y-1/2"
            aria-label="Быстрая связь"
        >
            <ul className="flex flex-row items-center gap-2.5 xl:flex-col xl:gap-4">
                {contacts.quick.map((item, i) => (
                    <motion.li
                        key={item.id}
                        initial={reduced ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: reduced ? 0 : 0.6 + i * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {(() => {
                            /* 44px — нижняя граница удобной цели для пальца;
                               на телефоне это горизонтальная панель внизу */
                            const shared = {
                                "aria-label": item.label,
                                title: item.label,
                                className:
                                    "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-line bg-[rgba(3,6,13,0.55)] text-ink-dim backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(127,210,240,0.55)] hover:text-accent sm:h-12 sm:w-12 xl:h-[3.25rem] xl:w-[3.25rem]",
                                children: (
                                    <Icon
                                        name={item.icon}
                                        className="h-[20px] w-[20px] sm:h-[22px] sm:w-[22px] xl:h-[24px] xl:w-[24px]"
                                    />
                                ),
                            };

                            return isInternal(item.href) ? (
                                <Link href={item.href} {...shared} />
                            ) : (
                                <a
                                    href={item.href}
                                    target={
                                        item.href.startsWith("http")
                                            ? "_blank"
                                            : undefined
                                    }
                                    rel={
                                        item.href.startsWith("http")
                                            ? "noreferrer noopener"
                                            : undefined
                                    }
                                    {...shared}
                                />
                            );
                        })()}
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}

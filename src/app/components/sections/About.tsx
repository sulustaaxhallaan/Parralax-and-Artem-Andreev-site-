"use client";

import Image from "next/image";

import { about } from "@/content/site";
import TypeLine from "../motion/TypeLine";
import RevealWords from "../motion/RevealWords";
import Reveal from "../motion/Reveal";

/**
 * Раскладка коллажа: место и размер каждого объекта в процентах от
 * контейнера (left и width — от ширины, top — от высоты), плюс
 * порядок наложения.
 *
 * Раскладок две. Ширина колонки задана сеткой и не меняется, поэтому
 * укрупнить объекты можно только за счёт высоты — а её хватает не
 * всегда. На окне 1440x900 масштаб секции упирается в ширину кадра
 * (1.125 против 1.205 по высоте), и запас по высоте там есть: секция
 * может подрасти с 667 до 715px даром. На окне 720px высоты запаса
 * нет вовсе, и вытянутый коллаж потянул бы за собой всю секцию — весь
 * текст стал бы мельче процентов на пять.
 *
 * Поэтому порог по высоте окна: ниже 840px остаётся тесная квадратная
 * раскладка, выше — вытянутая, где объекты крупнее примерно на пятую
 * часть и разведены, а не свалены в стопку.
 *
 * Классы записаны целиком: Tailwind ищет их в исходнике простым
 * поиском по тексту и не увидит имя, собранное из кусков.
 *
 * Поворот и тени объектам не задаём: и то и другое уже снято в самих
 * png, добавлять поверх — только ломать перспективу.
 */
const PLACEMENT: Record<string, string> = {
    poster:
        "z-20 left-[0%] top-[3%] w-[37%] " +
        "[@media(min-height:840px)]:left-[0%] [@media(min-height:840px)]:top-[0%] [@media(min-height:840px)]:w-[45%]",
    certificate:
        "z-10 left-[62%] top-[1%] w-[34%] " +
        "[@media(min-height:840px)]:left-[56%] [@media(min-height:840px)]:top-[3%] [@media(min-height:840px)]:w-[41%]",
    cards:
        "z-30 left-[30%] top-[39%] w-[52%] " +
        "[@media(min-height:840px)]:left-[34%] [@media(min-height:840px)]:top-[41%] [@media(min-height:840px)]:w-[63%]",
    laptop:
        "z-40 left-[12%] top-[48%] w-[76%] " +
        "[@media(min-height:840px)]:left-[5%] [@media(min-height:840px)]:top-[58%] [@media(min-height:840px)]:w-[90%]",
};

export default function About({ active }: { active: boolean }) {
    return (
        <div className="grid w-full max-w-6xl gap-10 px-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
            <div>
                <Reveal active={active} y={14}>
                    <p className="eyebrow">{about.eyebrow}</p>
                </Reveal>

                <TypeLine
                    as="h2"
                    active={active}
                    text={about.title}
                    speed={60}
                    delay={200}
                    className="display mt-5 block text-[clamp(2rem,5vw,3.6rem)]"
                />

                <div className="mt-5 space-y-4 sm:mt-7 sm:space-y-5">
                    {about.paragraphs.map((text, i) => (
                        <RevealWords
                            key={i}
                            active={active}
                            text={text}
                            delay={0.9 + i * 0.5}
                            step={0.014}
                            className="max-w-xl text-[0.82rem] leading-6 text-ink-dim sm:text-[1.1rem] sm:leading-8"
                        />
                    ))}
                </div>

                <Reveal active={active} delay={2.1} className="mt-6 sm:mt-9">
                    <h3 className="display text-[0.8rem] tracking-[0.3em] text-accent sm:text-[0.92rem]">
                        {about.approachTitle}
                    </h3>

                    <ul className="mt-4 space-y-3">
                        {about.approach.map((item, i) => (
                            <RevealWords
                                key={item}
                                as="li"
                                active={active}
                                text={item}
                                delay={2.3 + i * 0.16}
                                step={0.012}
                                className="relative pl-5 text-[0.8rem] leading-5 text-ink before:absolute before:left-0 before:top-[0.6em] before:h-px before:w-2.5 before:bg-accent sm:pl-6 sm:text-[1.05rem] sm:leading-7"
                            />
                        ))}
                    </ul>
                </Reveal>
            </div>

            {/* На узких экранах коллаж не помещается в кадр — визуальную
                часть там берут на себя кейсы */}
            <Reveal active={active} delay={0.5} y={30} className="hidden md:block">
                {/* Стеклянной карточки под объектами больше нет: они
                    вырезаны и лежат прямо на фоне сайта */}
                {/* 1.42, а не больше: при 1.45 секция вырастала до 724px и
                    масштаб начинал упираться в высоту вместо ширины — весь
                    блок становился мельче, чего мы и добивались избежать */}
                <div className="relative aspect-square w-full [@media(min-height:840px)]:aspect-[1/1.42]">
                    {about.mockups.map((item) => (
                        <div
                            key={item.id}
                            className={`absolute ${PLACEMENT[item.id]}`}
                        >
                            <Image
                                src={item.src}
                                alt={item.alt}
                                width={item.w}
                                height={item.h}
                                sizes="(max-width: 1024px) 40vw, 32vw"
                                className="h-auto w-full"
                            />
                        </div>
                    ))}
                </div>
            </Reveal>
        </div>
    );
}

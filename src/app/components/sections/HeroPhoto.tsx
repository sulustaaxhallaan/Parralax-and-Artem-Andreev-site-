"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from "framer-motion";

/* Слои нарезаны из Hero_img.png скриптом: человек отдельно, две ленты
   отдельно. Все три лежат на одном холсте 1200×1401, поэтому просто
   накладываются друг на друга и совпадают по координатам.

   Человек уходит под ленты с запасом ~33 px, так что смещать ленты
   можно свободно — просветов не появится. */

const CANVAS = { w: 1200, h: 1401 };

/** центры лент в долях холста — вокруг них идёт вращение */
const ORIGIN = {
    a: "28% 72%",
    b: "77% 79%",
};

export default function HeroPhoto({ active }: { active: boolean }) {
    const reduced = useReducedMotion();

    // положение курсора: -1..1 от центра экрана
    const mx = useMotionValue(0);
    const my = useMotionValue(0);

    useEffect(() => {
        if (reduced) return;

        const onMove = (e: MouseEvent) => {
            mx.set((e.clientX / window.innerWidth) * 2 - 1);
            my.set((e.clientY / window.innerHeight) * 2 - 1);
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, [mx, my, reduced]);

    // Человек реагирует туго, ленты — мягко и с запаздыванием.
    // Именно эта разница в упругости читается как «ткань легче тела».
    const pX = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.7 });
    const pY = useSpring(my, { stiffness: 60, damping: 22, mass: 0.7 });
    const rX = useSpring(mx, { stiffness: 26, damping: 16, mass: 1.1 });
    const rY = useSpring(my, { stiffness: 26, damping: 16, mass: 1.1 });

    const personX = useTransform(pX, [-1, 1], [16, -16]);
    const personY = useTransform(pY, [-1, 1], [10, -10]);
    const personRotate = useTransform(pX, [-1, 1], [1.1, -1.1]);

    const ribbonAX = useTransform(rX, [-1, 1], [-24, 24]);
    const ribbonAY = useTransform(rY, [-1, 1], [-15, 15]);
    const ribbonBX = useTransform(rX, [-1, 1], [21, -21]);
    const ribbonBY = useTransform(rY, [-1, 1], [16, -16]);

    return (
        <div
            aria-hidden
            /* До lg фото работает как фоновая фактура за текстом,
               с lg — как полноценная половина композиции */
            className="pointer-events-none absolute bottom-0 right-0 aspect-[1200/1401] h-[50%] translate-x-[16%] opacity-30 sm:h-[58%] sm:translate-x-[10%] sm:opacity-35 lg:h-[64%] lg:translate-x-[4%] lg:opacity-100 xl:h-[80%] xl:translate-x-[3%]"
            style={{
                // Левый край кадра растворяем: в исходнике и фигура,
                // и лента там срезаны по границе холста
                maskImage:
                    "linear-gradient(to right, transparent 0%, #000 15%, #000 100%)",
                WebkitMaskImage:
                    "linear-gradient(to right, transparent 0%, #000 15%, #000 100%)",
            }}
        >
            {/* Свечение под фигурой — иначе фото выглядит наклеенным */}
            <motion.div
                className="absolute left-[10%] top-[18%] h-[70%] w-[80%] rounded-full"
                style={{
                    x: personX,
                    y: personY,
                    background:
                        "radial-gradient(circle, rgba(45,120,190,0.45) 0%, rgba(20,60,110,0.18) 45%, rgba(0,0,0,0) 72%)",
                    filter: "blur(60px)",
                }}
            />

            {/* Человек */}
            <motion.div
                className="absolute inset-0"
                style={{
                    x: personX,
                    y: personY,
                    rotate: personRotate,
                    transformOrigin: "50% 85%",
                    // нижний срез фигуры растворяем, чтобы не было «обрубка»
                    maskImage:
                        "linear-gradient(to bottom, #000 0%, #000 72%, rgba(0,0,0,0.55) 84%, transparent 95%)",
                    WebkitMaskImage:
                        "linear-gradient(to bottom, #000 0%, #000 72%, rgba(0,0,0,0.55) 84%, transparent 95%)",
                }}
            >
                <Image
                    src="/hero/person.png"
                    alt="Артём Андреев"
                    width={CANVAS.w}
                    height={CANVAS.h}
                    priority
                    sizes="(max-width: 1024px) 60vw, 46vw"
                    className="h-full w-full object-contain"
                />
            </motion.div>

            {/* Лента слева: параллакс от мыши + собственное колыхание */}
            <motion.div
                className="absolute inset-0"
                style={{ x: ribbonAX, y: ribbonAY }}
            >
                <motion.div
                    className="absolute inset-0"
                    style={{ transformOrigin: ORIGIN.a }}
                    animate={
                        reduced || !active
                            ? undefined
                            : {
                                  y: [0, -9, 2, 0],
                                  rotate: [0, 1.1, -0.5, 0],
                                  // масштаб только вверх: лента всегда
                                  // закрывает не меньше, чем в исходнике
                                  scale: [1, 1.035, 1.012, 1],
                              }
                    }
                    transition={{
                        duration: 11,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Image
                        src="/hero/ribbon-a.png"
                        alt=""
                        width={CANVAS.w}
                        height={CANVAS.h}
                        priority
                        sizes="(max-width: 1024px) 60vw, 46vw"
                        className="h-full w-full object-contain"
                    />
                </motion.div>
            </motion.div>

            {/* Лента справа: другая фаза и период, чтобы не было маятника */}
            <motion.div
                className="absolute inset-0"
                style={{ x: ribbonBX, y: ribbonBY }}
            >
                <motion.div
                    className="absolute inset-0"
                    style={{ transformOrigin: ORIGIN.b }}
                    animate={
                        reduced || !active
                            ? undefined
                            : {
                                  y: [0, 7, -3, 0],
                                  rotate: [0, -1.3, 0.6, 0],
                                  scale: [1, 1.028, 1.008, 1],
                              }
                    }
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5,
                    }}
                >
                    <Image
                        src="/hero/ribbon-b.png"
                        alt=""
                        width={CANVAS.w}
                        height={CANVAS.h}
                        priority
                        sizes="(max-width: 1024px) 60vw, 46vw"
                        className="h-full w-full object-contain"
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}

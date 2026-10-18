"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ensureGsap, prefersReducedMotion } from "@/lib/gsap";

/* Две половины одной семьи. Сначала мама и папа стоят каждый на своём
   цвете, как в макете автора. По касанию они сходятся к шву, и из шва
   во все стороны растекается фиолетовый — смесь бордового и синего, —
   а на нём проступает общая семья. Обе половины движутся зеркально и с
   одинаковыми таймингами: ни одна не «главнее».

   Все элементы — векторы, вынутые из PDF автора без правок. Обереги
   (харысхал) не поворачиваются, не перекрашиваются и не искажаются:
   их только показывают и прячут прозрачностью и масштабом.

   Раскладка задана координатами макета. В альбомной ориентации это сам
   макет 1440×960, в портретной — своя сетка 400×860 под телефон. Кадр
   масштабируется целиком, поэтому пропорции не плывут ни на каком
   экране. */

type Box = { x: number; y: number; w: number };

type Piece = {
    src: string;
    alt: string;
    width: number;
    height: number;
    portrait?: Box;
    landscape?: Box;
    role: string;
};

const MOTHER: Piece[] = [
    {
        src: "/otkrytka/mother.svg",
        alt: "Мать в якутском наряде прижимает к себе младенца",
        width: 427,
        height: 550,
        portrait: { x: 110, y: 26, w: 180 },
        landscape: { x: 150, y: 125, w: 427 },
        role: "figure",
    },
    {
        src: "/otkrytka/mother-amulet.svg",
        alt: "Оберег матери",
        width: 151,
        height: 150,
        portrait: { x: 52, y: 282, w: 58 },
        landscape: { x: 37, y: 725, w: 151 },
        role: "amulet",
    },
    {
        src: "/otkrytka/mother-title.svg",
        alt: "Ийэ күнүнэн!",
        width: 487,
        height: 86,
        portrait: { x: 120, y: 293, w: 220 },
        landscape: { x: 196, y: 757, w: 487 },
        role: "title",
    },
    {
        src: "/otkrytka/mother-sub.svg",
        alt: "Ийэ — өрүү биһигини кытта баар сылаас",
        width: 494,
        height: 32,
        portrait: { x: 40, y: 352, w: 320 },
        landscape: { x: 190, y: 846, w: 494 },
        role: "sub",
    },
];

const FATHER: Piece[] = [
    {
        src: "/otkrytka/father.svg",
        alt: "Отец в якутском наряде держит сына на плечах",
        width: 371,
        height: 588,
        portrait: { x: 122, y: 452, w: 156 },
        landscape: { x: 895, y: 70, w: 371 },
        role: "figure",
    },
    {
        src: "/otkrytka/father-amulet.svg",
        alt: "Оберег отца",
        width: 151,
        height: 150,
        portrait: { x: 52, y: 712, w: 58 },
        landscape: { x: 779, y: 725, w: 151 },
        role: "amulet",
    },
    {
        src: "/otkrytka/father-title.svg",
        alt: "Аҕа күнүнэн!",
        width: 441,
        height: 74,
        portrait: { x: 122, y: 725, w: 212 },
        landscape: { x: 958, y: 763, w: 441 },
        role: "title",
    },
    {
        src: "/otkrytka/father-sub.svg",
        alt: "Эн биһиги күүспүт, көмүскэлбит буолаҕын.",
        width: 448,
        height: 28,
        portrait: { x: 40, y: 784, w: 320 },
        landscape: { x: 955, y: 846, w: 448 },
        role: "sub",
    },
];

const FAMILY_PHRASE =
    "Ийэ уонна аҕа дьиэ кэргэн икки кынаттара буолаллар.";

const FAMILY: Piece[] = [
    {
        src: "/otkrytka/family-amulet.svg",
        alt: "Общий оберег семьи",
        width: 532,
        height: 532,
        portrait: { x: 88, y: 58, w: 224 },
        landscape: { x: 731, y: 214, w: 532 },
        role: "amulet",
    },
    {
        src: "/otkrytka/family.svg",
        alt: "Мать, отец и сын вместе",
        width: 521,
        height: 558,
        portrait: { x: 30, y: 292, w: 340 },
        landscape: { x: 177, y: 158, w: 521 },
        role: "figure",
    },
    // Фраза одной строкой — для альбомной раскладки, как в макете
    {
        src: "/otkrytka/family-text.svg",
        alt: FAMILY_PHRASE,
        width: 1242,
        height: 60,
        landscape: { x: 99, y: 823, w: 1242 },
        role: "text",
    },
    // …и двумя строками для телефона: одной она была бы слишком мелкой
    {
        src: "/otkrytka/family-text-1.svg",
        alt: FAMILY_PHRASE,
        width: 615,
        height: 60,
        portrait: { x: 32, y: 680, w: 336 },
        role: "text",
    },
    {
        src: "/otkrytka/family-text-2.svg",
        alt: "",
        width: 622,
        height: 60,
        portrait: { x: 30, y: 724, w: 340 },
        role: "text",
    },
];

function boxVars(p: Piece): React.CSSProperties {
    const vars: Record<string, number> = {};
    if (p.portrait) {
        vars["--px"] = p.portrait.x;
        vars["--py"] = p.portrait.y;
        vars["--pw"] = p.portrait.w;
    }
    if (p.landscape) {
        vars["--lx"] = p.landscape.x;
        vars["--ly"] = p.landscape.y;
        vars["--lw"] = p.landscape.w;
    }
    return vars as React.CSSProperties;
}

function pieceClass(p: Piece) {
    const only = !p.portrait ? " oc-only-l" : !p.landscape ? " oc-only-p" : "";
    return `oc-el oc-${p.role}${only}`;
}

function Pieces({ items, side }: { items: Piece[]; side: string }) {
    return items.map((p) => (
        <Image
            key={p.src}
            src={p.src}
            alt={p.alt}
            width={p.width}
            height={p.height}
            unoptimized
            priority
            draggable={false}
            data-side={side}
            data-role={p.role}
            className={pieceClass(p)}
            style={boxVars(p)}
        />
    ));
}

type Phase = "intro" | "idle" | "joining" | "joined" | "parting";

export default function FamilyCard() {
    const root = useRef<HTMLElement>(null);
    const joinTl = useRef<gsap.core.Timeline | null>(null);
    const [phase, setPhase] = useState<Phase>("intro");

    // Появление: половины въезжают навстречу друг другу с внешних краёв
    useEffect(() => {
        const el = root.current;
        if (!el) return;
        const { gsap } = ensureGsap();
        const q = gsap.utils.selector(el);
        const landscape = matchMedia("(min-aspect-ratio: 1/1)").matches;
        const axis = landscape ? "xPercent" : "yPercent";

        const ctx = gsap.context(() => {
            gsap.set(q(".oc-family .oc-el, .oc-merge, .oc-flash, .oc-edge"), {
                autoAlpha: 0,
            });
            gsap.set(q(".oc-replay"), { autoAlpha: 0 });

            if (prefersReducedMotion()) {
                gsap.from(q(".oc-half, .oc-parents .oc-el, .oc-hint, .oc-hint-label"), {
                    autoAlpha: 0,
                    duration: 0.6,
                    onComplete: () => setPhase("idle"),
                });
                return;
            }

            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
                onComplete: () => setPhase("idle"),
            });
            tl.from(q(".oc-half-mother"), { [axis]: -100, duration: 1 }, 0)
                .from(q(".oc-half-father"), { [axis]: 100, duration: 1 }, 0)
                .from(
                    q(".oc-parents .oc-figure"),
                    { autoAlpha: 0, y: 24, duration: 1.1 },
                    0.55,
                )
                .from(
                    q(".oc-parents .oc-amulet"),
                    { autoAlpha: 0, scale: 0.86, duration: 0.9 },
                    0.9,
                )
                .from(
                    q(".oc-parents .oc-title"),
                    {
                        clipPath: "inset(0% 100% 0% 0%)",
                        duration: 1.1,
                        ease: "power1.inOut",
                    },
                    1.05,
                )
                .from(
                    q(".oc-parents .oc-sub"),
                    { autoAlpha: 0, y: 8, duration: 0.8 },
                    1.7,
                )
                .from(q(".oc-seam"), { autoAlpha: 0, duration: 0.8 }, 1.2)
                .from(
                    q(".oc-hint, .oc-hint-label"),
                    { autoAlpha: 0, y: 10, duration: 0.7 },
                    2,
                );
        }, el);

        return () => ctx.revert();
    }, []);

    function join() {
        const el = root.current;
        if (!el || phase !== "idle") return;
        const { gsap } = ensureGsap();
        const q = gsap.utils.selector(el);
        joinTl.current?.kill();
        setPhase("joining");

        const landscape = matchMedia("(min-aspect-ratio: 1/1)").matches;
        const cx = innerWidth / 2;
        const cy = innerHeight / 2;
        const done = () => setPhase("joined");

        if (prefersReducedMotion()) {
            joinTl.current = gsap
                .timeline({
                    onComplete: done,
                    onReverseComplete: () => setPhase("idle"),
                })
                .to(q(".oc-parents .oc-el, .oc-hint, .oc-hint-label, .oc-seam"), {
                    autoAlpha: 0,
                    duration: 0.5,
                })
                .to(q(".oc-merge"), { autoAlpha: 1, duration: 0.6 }, 0.2)
                .to(q(".oc-family .oc-el"), { autoAlpha: 1, duration: 0.6 }, 0.6)
                .to(q(".oc-replay"), { autoAlpha: 1, duration: 0.4 });
            return;
        }

        // Каждая фигура летит ровно в центр шва — откуда бы ни стояла
        const figures = q(".oc-parents .oc-figure");
        const deltas = figures.map((f) => {
            const r = f.getBoundingClientRect();
            return {
                x: cx - (r.left + r.width / 2),
                y: cy - (r.top + r.height / 2),
            };
        });

        const clipFrom = landscape
            ? "inset(0% 50% 0% 50%)"
            : "inset(50% 0% 50% 0%)";
        const edgeAxis = landscape ? "x" : "y";
        const edgeTravel = (landscape ? innerWidth : innerHeight) / 2;

        const tl = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: done,
            onReverseComplete: () => setPhase("idle"),
        });

        tl.to(
            q(".oc-hint, .oc-hint-label"),
            { autoAlpha: 0, y: 8, duration: 0.35 },
            0,
        )
            .to(
                q(".oc-parents .oc-amulet, .oc-parents .oc-title, .oc-parents .oc-sub"),
                {
                    autoAlpha: 0,
                    scale: 0.94,
                    filter: "blur(6px)",
                    duration: 0.55,
                    ease: "power2.in",
                    stagger: { each: 0.04, from: "edges" },
                },
                0,
            )
            // Сближение: обе фигуры зеркально, одной длительностью
            .to(
                figures,
                {
                    x: (i) => deltas[i].x,
                    y: (i) => deltas[i].y,
                    scale: 0.5,
                    duration: 1.25,
                },
                0.2,
            )
            .to(
                figures,
                {
                    autoAlpha: 0,
                    filter: "blur(10px)",
                    duration: 0.45,
                    ease: "power2.in",
                },
                1.0,
            )
            .to(q(".oc-seam"), { autoAlpha: 0, duration: 0.4 }, 1.1)
            // В точке встречи — вспышка
            .fromTo(
                q(".oc-flash"),
                { autoAlpha: 0, scale: 0.2 },
                { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power2.out" },
                1.15,
            )
            .to(
                q(".oc-flash"),
                { autoAlpha: 0, scale: 1.8, duration: 0.9, ease: "power2.out" },
                1.6,
            )
            // Фиолетовый растекается от шва к обоим краям одновременно
            .fromTo(
                q(".oc-merge"),
                { autoAlpha: 1, clipPath: clipFrom },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.15,
                    ease: "power2.inOut",
                },
                1.3,
            )
            .fromTo(
                q(".oc-edge"),
                { autoAlpha: 1, [edgeAxis]: 0 },
                {
                    [edgeAxis]: (i: number) => (i === 0 ? -edgeTravel : edgeTravel),
                    duration: 1.15,
                    ease: "power2.inOut",
                },
                1.3,
            )
            .to(q(".oc-edge"), { autoAlpha: 0, duration: 0.3 }, 2.15)
            // Общая семья
            .fromTo(
                q(".oc-family .oc-amulet"),
                { autoAlpha: 0, scale: 0.9 },
                { autoAlpha: 1, scale: 1, duration: 1.4, ease: "power2.out" },
                2.0,
            )
            .fromTo(
                q(".oc-family .oc-figure"),
                { autoAlpha: 0, y: 28, scale: 0.96 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 1.3, ease: "power3.out" },
                2.15,
            )
            .fromTo(
                q(".oc-family .oc-text"),
                { autoAlpha: 1, clipPath: "inset(0% 100% 0% 0%)" },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.4,
                    ease: "power1.inOut",
                    stagger: 1.0,
                },
                2.8,
            )
            .fromTo(
                q(".oc-replay"),
                { autoAlpha: 0, y: 8 },
                { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" },
                "-=0.3",
            );

        joinTl.current = tl;
    }

    function part() {
        const tl = joinTl.current;
        if (!tl || phase !== "joined") return;
        setPhase("parting");
        tl.timeScale(1.8).reverse();
    }

    return (
        <main
            ref={root}
            className="oc-root"
            data-phase={phase}
            onClick={join}
            aria-label="Открытка ко Дню отца и Дню матери в Якутии"
        >
            <div className="oc-half oc-half-mother" />
            <div className="oc-half oc-half-father" />
            <div className="oc-seam" aria-hidden />

            <div className="oc-merge" aria-hidden />
            <div className="oc-edge oc-edge-a" aria-hidden />
            <div className="oc-edge oc-edge-b" aria-hidden />

            <div className="oc-frame oc-parents" aria-hidden={phase === "joined"}>
                <Pieces items={MOTHER} side="mother" />
                <Pieces items={FATHER} side="father" />
            </div>

            <div className="oc-flash" aria-hidden />

            <div className="oc-frame oc-family" aria-hidden={phase !== "joined"}>
                <Pieces items={FAMILY} side="family" />
            </div>

            <button
                type="button"
                className="oc-hint"
                onClick={(e) => {
                    e.stopPropagation();
                    join();
                }}
                disabled={phase !== "idle"}
            >
                <span className="oc-hint-ring" aria-hidden>
                    <span />
                    <span />
                </span>
                <span className="sr-only">Соединить</span>
            </button>
            <p className="oc-hint-label oc-label" aria-hidden>
                Коснитесь, чтобы соединить
            </p>

            <button
                type="button"
                className="oc-replay oc-label"
                onClick={(e) => {
                    e.stopPropagation();
                    part();
                }}
                disabled={phase !== "joined"}
            >
                Ещё раз
            </button>
        </main>
    );
}

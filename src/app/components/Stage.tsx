"use client";

import { useCallback } from "react";
import { useTransform } from "framer-motion";

import {
    SECTION_WINDOWS,
    TOTAL_SCROLL,
    scrollTargetFor,
    type SectionId,
} from "@/lib/stage";
import { useStageScroll } from "@/lib/useStageScroll";

import Background from "./Background";
import FitToViewport from "./FitToViewport";
import SectionLayer from "./SectionLayer";
import SectionNav from "./SectionNav";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Journey from "./sections/Journey";
import Cases from "./sections/Cases";
import Results from "./sections/Results";
import Contacts from "./sections/Contacts";

const CASES = SECTION_WINDOWS.find((w) => w.id === "cases")!;

/**
 * Сцена: один неподвижный кадр с общим фоном, поверх которого
 * сменяются секции. Прокрутка страницы — единственный «плеер»:
 * она задаёт и появление секций, и движение ленты кейсов.
 */
export default function Stage() {
    const { progress, active } = useStageScroll();

    // 0..1 внутри секции кейсов — этим ведём горизонтальную ленту
    const casesInner = useTransform(
        progress,
        [CASES.holdStart, CASES.holdEnd],
        [0, 1],
    );

    const goTo = useCallback((index: number) => {
        window.scrollTo({
            top: scrollTargetFor(index) * window.innerHeight,
            behavior: "smooth",
        });
    }, []);

    const seekCases = useCallback((fraction: number) => {
        const span = CASES.holdEnd - CASES.holdStart;
        window.scrollTo({
            top: (CASES.holdStart + fraction * span) * window.innerHeight,
            behavior: "smooth",
        });
    }, []);

    const render = (id: SectionId, isActive: boolean) => {
        switch (id) {
            case "hero":
                return <Hero active={isActive} />;
            case "about":
                return <About active={isActive} />;
            case "skills":
                return <Skills active={isActive} />;
            case "journey":
                return <Journey active={isActive} />;
            case "cases":
                return (
                    <Cases
                        active={isActive}
                        inner={casesInner}
                        onSeek={seekCases}
                    />
                );
            case "results":
                return <Results active={isActive} />;
            case "contacts":
                return <Contacts active={isActive} />;
        }
    };

    return (
        <>
            <Background progress={progress} />

            {/* Высота этого блока и есть вся длина прокрутки сайта */}
            <div style={{ height: `${(TOTAL_SCROLL + 1) * 100}vh` }}>
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {SECTION_WINDOWS.map((win, i) => (
                        <SectionLayer
                            key={win.id}
                            progress={progress}
                            win={win}
                            z={10 + i}
                        >
                            {/* Кейсы и Hero занимают весь кадр сами:
                                у первых горизонтальная лента, у второго
                                фото, привязанное к краю экрана */}
                            {win.id === "cases" || win.id === "hero" ? (
                                <div className="h-full w-full">
                                    {render(win.id, active === i)}
                                </div>
                            ) : (
                                // Секция обязана помещаться в кадр целиком
                                <FitToViewport>
                                    {render(win.id, active === i)}
                                </FitToViewport>
                            )}
                        </SectionLayer>
                    ))}
                </div>
            </div>

            <SectionNav active={active} onGo={goTo} />
        </>
    );
}

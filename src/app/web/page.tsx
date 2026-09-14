import SpaceJourney from "./components/SpaceJourney";
import SocialRail from "./components/SocialRail";
import SceneBackdrop from "./components/SceneBackdrop";
import DeviceZoom from "./components/DeviceZoom";
import { LAPTOP_SCREEN, PHONE_SCREEN } from "@/lib/devices";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Pain from "./components/sections/Pain";
import Portfolio from "./components/sections/Portfolio";
import Process from "./components/sections/Process";
import Objections from "./components/sections/Objections";
import Pricing from "./components/sections/Pricing";
import Faq from "./components/sections/Faq";
import Contacts from "./components/sections/Contacts";
import Footer from "./components/sections/Footer";

export default function Home() {
  return (
    <main className="relative">
      <SpaceJourney />
      <SocialRail />

      {/* Кадр с планетами: включается, как только камера вошла в экран
          ноутбука, и держится до появления телефона. */}
      <SceneBackdrop
        src="/images/space/planets.webp"
        fromId="zoom-laptop"
        toId="zoom-phone"
      />

      {/* Кадр с человеком в поле держится от экрана телефона до кейсов —
          на нём же стоит блок с болями клиента. */}
      <SceneBackdrop
        src="/images/space/field-stars.webp"
        fromId="zoom-phone"
        toId="portfolio"
      />

      {/* Дальше камера поднимается обратно в космос: планеты и звёзды
          возвращаются и держатся до тарифов, у которых свои кадры.
          Здесь смена идёт на голом фоне, поэтому кадр разгорается
          плавно, перекрываясь с уходящим полем. */}
      <SceneBackdrop
        src="/images/space/planets.webp"
        fromId="pain"
        startPlacement="bottom bottom"
        toId="tier-impulse"
        fadeIn={0.12}
      />

      {/* Первый экран: камера наезжает на ноутбук, и сцена с его экрана
          разворачивается во весь экран — дальше идёт рассказ о себе.
          Кадр с планетами тянется отсюда и до самого телефона. */}
      <DeviceZoom
        id="zoom-laptop"
        geometry={LAPTOP_SCREEN}
        frameSrc="/images/hero/laptop-frame.webp"
        frameAlt="Ноутбук с будущим сайтом"
        revealSrc="/images/space/planets.webp"
        revealAlt="Планеты и Млечный Путь"
        aspect="1065 / 711"
        devicePositionClassName="items-center justify-center pt-[47vh] pb-[11vh] lg:items-center lg:justify-end lg:pt-0 lg:pb-0"
        deviceSizeClassName="w-[54vw] max-w-[420px] lg:w-[52vw] lg:max-w-[900px]"
        runwayClassName="h-[250vh]"
        // Тот же кадр продолжается в секции ниже, поэтому затемнение
        // ровное: с градиентом на стыке появлялась бы тёмная полоса.
        revealOverlayClassName="bg-[rgba(3,5,12,0.45)]"
        handOffToBackdrop
        overlay={<Hero />}
        priority
      />

      <About />

      {/* Тот же приём на телефоне: наезд ведёт в сцену, с которой
          начинается блок про боли клиента. */}
      <DeviceZoom
        id="zoom-phone"
        geometry={PHONE_SCREEN}
        frameSrc="/images/hero/phone-frame.webp"
        frameAlt="Телефон с сайтом"
        revealSrc="/images/space/field-stars.webp"
        revealAlt="Человек в поле смотрит на звёзды"
        aspect="368 / 718"
        deviceSizeClassName="h-[66svh] w-auto max-w-none"
        runwayClassName="h-[210vh]"
        revealOverlayClassName="bg-[rgba(3,5,12,0.45)]"
        handOffToBackdrop
        priority
      />

      <Pain />
      <Portfolio />
      <Process />
      <Objections />
      <Pricing />
      <Faq />
      <Contacts />
      <Footer />
    </main>
  );
}

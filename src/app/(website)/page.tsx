import { FaqSection } from "@/components/web-pages/faq-section";
import { HomeAbout } from "@/components/web-pages/home-about";
import { HomeCta } from "@/components/web-pages/home-cta";
import { HomeHero } from "@/components/web-pages/home-hero";
import { HomeMarquee } from "@/components/web-pages/home-marquee";
import { HomeProcess } from "@/components/web-pages/home-process";
import { HomePros } from "@/components/web-pages/home-pros";
import { HomeServices } from "@/components/web-pages/home-services";
import { HomeWhyChoose } from "@/components/web-pages/home-why-choose";

import { PricingPlans } from "@/components/web-pages/pricing-plans";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeMarquee />
      <HomeAbout />
      <HomeServices />
      <HomeProcess />
      <HomeWhyChoose />
      <HomePros />
      <PricingPlans />
      <FaqSection />
      <HomeCta />
    </>
  );
}
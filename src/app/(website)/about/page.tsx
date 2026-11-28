import type { Metadata } from "next";
import { AboutContent } from "@/components/web-pages/about-content";

export const metadata: Metadata = {
  title: "About Us  A Marketplace for Every Skilled Worker | Nutsumo",
  description:
    "Nutsumo is a verified marketplace connecting individuals, households and businesses with all types of skilled workers and professionals  formal and informal  backed by 100% escrow protection and statutory compliance.",
};

export default function AboutPage() {
  return <AboutContent />;
}

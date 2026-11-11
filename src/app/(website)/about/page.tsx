import type { Metadata } from "next";
import { AboutContent } from "@/components/web-pages/about-content";

export const metadata: Metadata = {
  title: "About Us — Empowering Ghana's Artisan Economy | Nutsumo",
  description:
    "Nutsumo is Ghana's leading verified artisan marketplace, connecting homeowners and businesses directly with skilled craftsmen backed by 100% escrow protection and statutory compliance.",
};

export default function AboutPage() {
  return <AboutContent />;
}

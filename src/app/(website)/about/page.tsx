import type { Metadata } from "next";
import { AboutContent } from "@/components/web-pages/about-content";

export const metadata: Metadata = {
  title: "About Us — Keeping Homes Running Smoothly | LocalHomeFix",
  description:
    "Austin's direct home services platform connecting homeowners directly with verified, licensed trade pros with transparent upfront pricing and zero middleman markups.",
};

export default function AboutPage() {
  return <AboutContent />;
}


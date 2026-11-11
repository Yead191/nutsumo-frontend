import type { Metadata } from "next";
import { HowItWorksContent } from "@/components/web-pages/how-it-works-content";

export const metadata: Metadata = {
  title: "How It Works — 100% Escrow Protected Marketplace | Nutsumo",
  description:
    "Learn how Nutsumo protects clients and artisans across Ghana with verified profiles, direct custom quotes, and milestone-based escrow payments.",
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}

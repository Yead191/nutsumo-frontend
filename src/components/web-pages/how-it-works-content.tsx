"use client";

import { useState } from "react";
import {
  ClipboardList,
  FileCheck2,
  ShieldCheck,
  UserPlus,
  Wallet,
  CalendarDays,
  CreditCard,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/layout/page-banner";
import { ProcessGrid } from "@/components/ui/process-grid";
import { FaqSection } from "@/components/web-pages/faq-section";
import { photos } from "@/lib/media";
import { cn } from "@/lib/cn";
import { postJobHref } from "@/lib/role-access";

type TabKey = "homeowner" | "pro";

const tabs: { key: TabKey; label: string }[] = [
  { key: "homeowner", label: "Homeowners" },
  { key: "pro", label: "Professionals" },
];

const journeys: Record<
  TabKey,
  {
    eyebrow: string;
    title: string;
    summary: string;
    steps: { n: string; title: string; text: string; icon: LucideIcon }[];
    cta: { href: string; label: string };
    secondary?: { href: string; label: string };
  }
> = {
  homeowner: {
    eyebrow: "For Homeowners",
    title: "How to hire with zero hassle",
    summary: "Browse verified local pros for free, post your job, compare bids, and pay directly upon completion.",
    steps: [
      {
        n: "01",
        title: "Post your repair request",
        text: "Tell us what needs fixing, your preferred timing, and add photos. It takes under 2 minutes.",
        icon: ClipboardList,
      },
      {
        n: "02",
        title: "Receive itemized quotes",
        text: "Cleared local contractors in your neighborhood review the details and submit price estimates.",
        icon: FileCheck2,
      },
      {
        n: "03",
        title: "Compare bids & ratings",
        text: "Inspect labor, parts, estimated arrival times, and verified neighbor reviews in one private dashboard.",
        icon: Star,
      },
      {
        n: "04",
        title: "Hire & pay when done",
        text: "Accept one quotation to confirm the booking. Pay the professional directly — HomeFix never takes a repair fee.",
        icon: Wallet,
      },
    ],
    cta: { href: "/login?next=%2Faccount%2Fpost-job", label: "Post a job free ↗" },
    secondary: { href: "/browse-pros", label: "Browse pros first ↗" },
  },
  pro: {
    eyebrow: "For Contractors & Pros",
    title: "Win local jobs without per-lead fees",
    summary: "Keep 100% of what you earn. No bidding wars or paying for dead leads.",
    steps: [
      {
        n: "01",
        title: "Submit simple application",
        text: "Share your business details, trade licenses, and local service coverage areas.",
        icon: UserPlus,
      },
      {
        n: "02",
        title: "Clear credential check",
        text: "Our team verifies your trade licenses and background so homeowners can hire with confidence.",
        icon: ShieldCheck,
      },
      {
        n: "03",
        title: "Enjoy 3 months free",
        text: "Quote homeowner jobs in your area with zero platform fees or commissions during your free trial.",
        icon: CalendarDays,
      },
      {
        n: "04",
        title: "Flat monthly membership",
        text: "After your trial, continue for just $19.99/mo flat. Quote unlimited jobs and keep every dollar you charge.",
        icon: CreditCard,
      },
    ],
    cta: { href: "/pro-register", label: "Apply as a pro ↗" },
    secondary: { href: "/#pricing", label: "See pricing breakdown ↗" },
  },
};

export function HowItWorksContent() {
  const [tab, setTab] = useState<TabKey>("homeowner");
  const user = null;
  const journey = journeys[tab];
  const ctaHref = tab === "homeowner" ? postJobHref(user) : journey.cta.href;

  return (
    <div>
      <PageBanner
        eyebrow="How It Works"
        title="Simple, transparent home repairs"
        description="Direct, transparent, and commission-free home repairs for Austin homeowners and trade pros."
        image={photos.banners.how}
      />

      <section className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
        <div className="container-site">
          <div className="mx-auto max-w-xl">
            <div
              role="tablist"
              aria-label="Choose your role"
              className="grid grid-cols-2 overflow-hidden rounded-full border border-line bg-white p-1"
            >
              {tabs.map((item) => {
                const active = tab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setTab(item.key)}
                    className={cn(
                      "min-h-[44px] rounded-full font-display text-sm font-bold transition-colors",
                      active ? "bg-primary text-white" : "bg-transparent text-title hover:text-primary",
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div role="tabpanel" className="mt-8">
            <ProcessGrid
              badge={journey.eyebrow}
              title={journey.title}
              description={journey.summary}
              items={journey.steps}
              cta={{
                href: ctaHref,
                title: journey.cta.label,
                text: journey.secondary?.label
                  ? `Or ${journey.secondary.label.toLowerCase()}.`
                  : "Continue when you are ready.",
                linkLabel: journey.cta.label,
              }}
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={ctaHref}>{journey.cta.label}</Button>
            {journey.secondary ? (
              <Button href={journey.secondary.href} variant="ghost">
                {journey.secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </section>
      <FaqSection className="bg-surface" />
    </div>
  );
}

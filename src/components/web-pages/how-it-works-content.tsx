"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { stock } from "@/lib/stock-photos";

type Audience = "client" | "artisan";

const TRACKS: Record<
  Audience,
  {
    tab: string;
    heroImage: string;
    heroAlt: string;
    cta: { href: string; label: string };
    steps: Array<{ title: string; description: string; badge: string; image: string }>;
  }
> = {
  client: {
    tab: "For clients & businesses",
    heroImage: stock.consultation,
    heroAlt: "A client discussing a job with a professional",
    cta: { href: "/browse-pros", label: "Start browsing verified pros" },
    steps: [
      {
        title: "Discover pros or request a custom quote",
        description:
          "Browse verified workers and professionals in any field  tradespeople, chefs, drivers, nannies, security, office and creative talent  view their profiles and ratings, or request a custom quote describing the job you need.",
        badge: "Free & fast",
        image: stock.laptopWork,
      },
      {
        title: "Receive itemized quotations",
        description:
          "Selected professionals review your job details and submit clear, transparent quotes. Inspect proposed pricing, duration, and the statutory tax breakdown before deciding.",
        badge: "No obligation",
        image: stock.finance,
      },
      {
        title: "Fund 100% secure escrow",
        description:
          "Accept your preferred quotation and fund the job via card or Mobile Money. Your funds are held securely in escrow  the professional cannot withdraw them until you approve.",
        badge: "Zero cash risk",
        image: stock.cardPayment,
      },
      {
        title: "Inspect, sign off & rate",
        description:
          "The professional completes the job according to your requirements. After reviewing the work, approve the release of funds and leave an authentic verified review.",
        badge: "Satisfaction guaranteed",
        image: stock.electrician,
      },
    ],
  },
  artisan: {
    tab: "For workers & professionals",
    heroImage: stock.constructionTeam,
    heroAlt: "A team of skilled workers on a job site",
    cta: { href: "/pro-register", label: "Apply to join as a professional" },
    steps: [
      {
        title: "Identity & skill verification",
        description:
          "Sign up with any skill  formal or informal. Upload your Ghana Card and show your experience, certificates or past work. Our verification team reviews your profile within 24 hours.",
        badge: "Verified badge",
        image: stock.portraitManSmile,
      },
      {
        title: "Receive high-intent job requests",
        description:
          "Get instant notifications when clients in your coverage area request a custom quote or post a job matching your skills.",
        badge: "Direct clients",
        image: stock.carpenter,
      },
      {
        title: "Submit official itemized quotations",
        description:
          "Propose your exact rate (hourly or fixed) and completion timeline. The quote shows 22.5% in total: 15% VAT, 2.5% NHIL, 2.5% GETFund, and a 2.5% platform fee.",
        badge: "Zero dead-lead fees",
        image: stock.signing,
      },
      {
        title: "Work with secured escrow & fast payout",
        description:
          "Once the client accepts and funds escrow, begin work with the payment held by Nutsumo. After completion, your net is released to your balance and you withdraw it to a bank account or mobile money.",
        badge: "Guaranteed payout",
        image: stock.checkout,
      },
    ],
  },
};

const FEES = [
  { label: "VAT", value: 15, className: "bg-title" },
  { label: "NHIL", value: 2.5, className: "bg-[#8A1D35]" },
  { label: "GETFund", value: 2.5, className: "bg-[#C2264A]" },
  { label: "Platform fee", value: 2.5, className: "bg-primary" },
];

const COMPARISON = [
  { feature: "Upfront deposit safety", cash: "0% (high risk)", nutsumo: "100% escrow protected" },
  { feature: "Professional identity verification", cash: "None (unverified)", nutsumo: "Ghana Card biometric audit" },
  { feature: "Dispute resolution desk", cash: "No recourse", nutsumo: "Accra arbitration team" },
  { feature: "Payment release timing", cash: "Before work starts", nutsumo: "Only after client sign-off" },
];

export function HowItWorksContent() {
  const [audience, setAudience] = useState<Audience>("client");
  const track = TRACKS[audience];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero */}
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">How it works</p>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-[58px] lg:leading-[1.05] font-semibold text-title">
              Hire with confidence. <span className="text-primary">Get paid with certainty.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-copy">
              A simple discovery and escrow payment flow built for Ghana  so
              clients only pay for approved work, and professionals know the
              money is there before they start.
            </p>

            <div role="tablist" aria-label="Choose who you are" className="mt-9 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
              {(Object.keys(TRACKS) as Audience[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={audience === key}
                  onClick={() => setAudience(key)}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition cursor-pointer sm:px-6 ${
                    audience === key ? "bg-title text-white!" : "text-copy hover:text-title"
                  }`}
                >
                  {TRACKS[key].tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-3xl sm:aspect-[21/9]">
            <Image
              key={track.heroImage}
              src={track.heroImage}
              alt={track.heroAlt}
              fill
              priority
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover animate-[fadeUp_.5s_ease_both]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0" />
          </div>
        </div>
      </section>

      {/* 2. Zig-zag numbered steps */}
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-title">
            {audience === "client" ? "Get your job done in four steps" : "Start earning in four steps"}
          </h2>

          <ol key={audience} className="mt-14 space-y-16 sm:space-y-24">
            {track.steps.map((step, index) => (
              <li key={step.title} className="grid items-center gap-8 md:grid-cols-2 md:gap-16 animate-[fadeUp_.45s_ease_both]">
                <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl ${index % 2 ? "md:order-2" : ""}`}>
                  <Image src={step.image} alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-primary font-display text-lg font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl sm:text-3xl font-semibold text-title">{step.title}</h3>
                  <p className="mt-4 max-w-lg text-base sm:text-lg leading-relaxed text-copy">{step.description}</p>
                  <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    Backed by escrow protection
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-16 flex justify-center">
            <Link
              href={track.cta.href}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              {track.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Fee breakdown */}
      <section className="pb-20 sm:pb-28 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative grid gap-10 overflow-hidden rounded-[28px] bg-[#2A0A12] px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Transparent pricing</p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-white!">
                Every cedi accounted for
              </h2>
              <p className="mt-4 max-w-md text-base sm:text-lg text-white/70">
                Each quotation shows a 22.5% statutory and platform deduction,
                itemized line by line. Professionals keep 77.5% net take-home
                earnings.
              </p>
            </div>

            <div className="relative rounded-2xl bg-white p-6 sm:p-8">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-copy">Deductions on a quote</p>
                <p className="font-display text-3xl font-semibold text-title">22.5%</p>
              </div>
              <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-slate-100">
                {FEES.map((fee) => (
                  <span key={fee.label} className={fee.className} style={{ width: `${(fee.value / 22.5) * 100}%` }} />
                ))}
              </div>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-x-8">
                {FEES.map((fee) => (
                  <li key={fee.label} className="flex items-center gap-2.5">
                    <span className={`h-3 w-3 rounded-full ${fee.className}`} />
                    <span className="text-sm text-copy">{fee.label}</span>
                    <span className="ml-auto text-sm font-semibold text-title">{fee.value}%</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                <span className="text-sm font-semibold text-emerald-800">Professional take-home</span>
                <span className="font-display text-xl font-semibold text-emerald-700">77.5%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Cash vs escrow comparison */}
      <section className="bg-slate-50 py-20 sm:py-28 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Escrow protection</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-title">
              Cash payment vs. Nutsumo escrow
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
            <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-3 border-b border-slate-200 bg-slate-50/60 px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-copy sm:px-8">
              <span>Feature</span>
              <span>Cash / informal</span>
              <span className="text-primary">Nutsumo escrow</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {COMPARISON.map((row) => (
                <li key={row.feature} className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-3 px-5 py-5 text-sm sm:px-8 sm:text-[15px]">
                  <span className="font-semibold text-title">{row.feature}</span>
                  <span className="flex items-start gap-2 text-copy">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    {row.cash}
                  </span>
                  <span className="flex items-start gap-2 font-medium text-title">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                    {row.nutsumo}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white px-6 py-5 ring-1 ring-slate-200 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </span>
              <p className="text-[15px] font-semibold text-title">Still have questions about escrow, fees or verification?</p>
            </div>
            <Link href="/faq" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4">
              Read the FAQ <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CTA band */}
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#4A0D1E] px-6 py-12 sm:px-14 sm:py-16 lg:py-20">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
              <Image src={stock.cleaner} alt="" fill sizes="50vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-r from-[#4A0D1E] via-[#4A0D1E]/40 to-transparent" />
            </div>
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
            <div className="relative max-w-lg">
              <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-white!">
                Ready when <span className="text-primary">you are</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/75">
                Post a job for free and compare quotes  or join as a
                professional and start receiving job requests.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/account/post-job" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors">
                  Post a job
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pro-register" className="inline-flex items-center rounded-lg border border-white/50 px-6 py-3 text-base font-semibold text-white! hover:bg-white/10 transition-colors">
                  Become a pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

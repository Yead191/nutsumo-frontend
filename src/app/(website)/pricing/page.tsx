import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, ShieldCheck, HelpCircle, Wallet } from "lucide-react";
import { stock } from "@/lib/stock-photos";

export const metadata: Metadata = {
  title: "Pricing & Transparent Platform Fees | Nutsumo",
  description:
    "100% free for clients to browse and request quotes. Zero upfront lead fees for professionals. Learn about the 22.5% fee: statutory levies plus a 2.5% platform fee.",
};

const BREAKDOWN = [
  { name: "Ghana VAT (Standard)", rate: 15, note: "Direct statutory value-added tax", color: "#4A0D1E" },
  { name: "NHIL (National Health Insurance)", rate: 2.5, note: "Healthcare infrastructure fund", color: "#8A1D35" },
  { name: "GETFund (Ghana Education Trust)", rate: 2.5, note: "National education support levy", color: "#C2264A" },
  { name: "Nutsumo platform fee", rate: 2.5, note: "Charged only on a completed funded job", color: "#FE375D" },
];
const TOTAL = 22.5;
const NET = 77.5;
/** Worked example on a GH₵ 1,000 job, computed from the rates above. */
const EXAMPLE_JOB = 1000;

const CLIENT_FEATURES = [
  "Free unlimited custom quote requests",
  "100% escrow protection included automatically",
  "Zero buyer markup or hidden checkout fees",
  "Free access to the Nutsumo Dispute Resolution Desk",
];

const PRO_FEATURES = [
  { strong: "Zero upfront cost:", text: "free profile listing and quote submission" },
  { strong: "Zero pay-per-lead charges:", text: "never pay for dead inquiries" },
  { strong: "77.5% net:", text: "lands in your Nutsumo balance, then withdraw to bank or mobile money" },
  { strong: "Full breakdown:", text: "15% VAT, 2.5% NHIL, 2.5% GETFund, plus a 2.5% platform fee" },
];

const cedi = (value: number) =>
  `GH₵ ${value.toLocaleString("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white pt-18">
      {/* 1. Hero */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:px-8">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-copy">
              <Link href="/" className="hover:text-title">Home</Link>
              <span className="mx-2 text-slate-300">/</span>
              <span className="text-title">Pricing</span>
            </nav>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-title sm:text-5xl lg:text-[56px]">
              Zero upfront fees. <span className="text-primary">Zero hidden surprises.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-copy sm:text-lg">
              Nutsumo runs on complete transparency. Clients hire for free with 100% escrow
              protection. Professionals pay zero upfront membership or per-lead fees.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/browse-pros"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Hire for free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pro-register"
                className="inline-flex items-center rounded-lg border border-title px-6 py-3 text-base font-semibold text-title hover:bg-title hover:text-white transition-colors"
              >
                Join as a pro
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
              <Image
                src={stock.cardPayment}
                alt="Paying securely online"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.35)] sm:-left-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-title">Held in escrow</p>
                <p className="text-xs text-copy">Released only on approval</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Plan cards */}
      <section className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Simple pricing</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-title sm:text-4xl">
              One fair model for everyone
            </h2>
          </div>

          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-2">
            {/* Clients */}
            <div className="flex flex-col rounded-3xl bg-white p-8 ring-1 ring-slate-200 sm:p-10">
              <p className="text-sm font-semibold text-copy">For clients &amp; businesses</p>
              <p className="mt-4 font-display text-5xl font-semibold text-title sm:text-6xl">GH₵ 0</p>
              <p className="mt-1 text-sm font-medium text-emerald-700">100% free, forever</p>
              <p className="mt-5 text-[15px] leading-relaxed text-copy">
                Post requests, browse verified professional profiles and receive custom quotes
                without spending a pesewa.
              </p>
              <ul className="mt-8 flex-1 space-y-4 border-t border-slate-100 pt-8">
                {CLIENT_FEATURES.map((feature) => (
                  <li key={feature} className="flex gap-3 text-[15px] text-title">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2.5} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/browse-pros"
                className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-title py-3.5 text-base font-semibold text-white! hover:bg-black transition-colors"
              >
                Browse professionals free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Pros */}
            <div className="relative flex flex-col overflow-hidden rounded-3xl bg-[#2A0A12] p-8 text-white sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
              <div className="relative flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white/70">For workers &amp; professionals</p>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">No subscription</span>
              </div>
              <p className="relative mt-4 font-display text-5xl font-semibold text-white! sm:text-6xl">
                {TOTAL}%
              </p>
              <p className="relative mt-1 text-sm font-medium text-primary">Total deduction, only on completed jobs</p>
              <p className="relative mt-5 text-[15px] leading-relaxed text-white/70">
                No membership fees, no bidding tokens. Deducted only when you successfully
                complete a funded job.
              </p>
              <ul className="relative mt-8 flex-1 space-y-4 border-t border-white/10 pt-8">
                {PRO_FEATURES.map((feature) => (
                  <li key={feature.strong} className="flex gap-3 text-[15px] text-white/85">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </span>
                    <span>
                      <strong className="font-semibold text-white">{feature.strong}</strong> {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pro-register"
                className="relative mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Join as a professional <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Fee breakdown */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Tax transparency</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-title sm:text-4xl">
              Where every cedi of the {TOTAL}% goes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-copy">
              Most of the deduction is statutory Ghana tax. Our own platform fee is just 2.5%,
              and it&apos;s charged only when an escrow job is completed.
            </p>

            {/* Stacked bar */}
            <div className="mt-8">
              <div className="flex h-4 overflow-hidden rounded-full bg-emerald-500" role="img" aria-label={`${TOTAL}% deductions, ${NET}% to the professional`}>
                {BREAKDOWN.map((row) => (
                  <span key={row.name} style={{ width: `${row.rate}%`, backgroundColor: row.color }} />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-xs font-semibold">
                <span className="text-primary">{TOTAL}% deductions</span>
                <span className="text-emerald-700">{NET}% to the pro</span>
              </div>
            </div>

            {/* Worked example */}
            <div className="mt-10 rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary ring-1 ring-slate-200">
                  <Wallet className="h-5 w-5" />
                </span>
                <p className="font-semibold text-title">Example: a {cedi(EXAMPLE_JOB)} job</p>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                  <dt className="text-copy">Total deductions</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-title">{cedi((EXAMPLE_JOB * TOTAL) / 100)}</dd>
                </div>
                <div className="rounded-xl bg-white p-4 ring-1 ring-emerald-200">
                  <dt className="text-copy">Pro takes home</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold text-emerald-700">{cedi((EXAMPLE_JOB * NET) / 100)}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
            <ul className="divide-y divide-slate-100">
              {BREAKDOWN.map((row) => (
                <li key={row.name} className="flex items-center justify-between gap-4 px-5 py-5 sm:px-7">
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                    <div>
                      <p className="text-[15px] font-semibold text-title">{row.name}</p>
                      <p className="mt-0.5 text-sm text-copy">{row.note}</p>
                    </div>
                  </div>
                  <span className="font-display text-lg font-semibold text-title">{row.rate.toFixed(1)}%</span>
                </li>
              ))}
              <li className="flex items-center justify-between gap-4 bg-slate-50 px-5 py-5 sm:px-7">
                <p className="text-[15px] font-semibold text-title">Total deduction</p>
                <span className="font-display text-lg font-semibold text-title">{TOTAL.toFixed(1)}%</span>
              </li>
              <li className="flex items-center justify-between gap-4 bg-emerald-50 px-5 py-5 sm:px-7">
                <p className="text-[15px] font-semibold text-emerald-800">Professional net take-home</p>
                <span className="font-display text-lg font-semibold text-emerald-700">{NET.toFixed(1)}%</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Questions banner */}
      <section className="bg-white pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid overflow-hidden rounded-[28px] bg-[#4A0D1E] md:grid-cols-[1.2fr_1fr]">
            <div className="relative px-6 py-12 sm:px-12 sm:py-14">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-primary">
                <HelpCircle className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold text-white! sm:text-4xl">
                Still have questions about fees?
              </h2>
              <p className="mt-3 max-w-md text-base text-white/70">
                Read how escrow, payouts and refunds work, or talk to our team directly.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/faq"
                  className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
                >
                  Read the FAQ
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-lg border border-white/40 px-6 py-3 text-base font-semibold text-white! hover:bg-white/10 transition-colors"
                >
                  Contact us
                </Link>
              </div>
            </div>
            <div className="relative hidden min-h-[280px] md:block">
              <Image src={stock.consultation} alt="" fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-r from-[#4A0D1E] to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

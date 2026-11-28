"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageBanner } from "@/components/layout/page-banner";
import { stock } from "@/lib/stock-photos";
import {
  HelpCircle,
  Plus,
  Minus,
  Search,
  ShieldCheck,
  Lock,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  category: "homeowner" | "artisan";
}

const faqs: FaqItem[] = [
  // Homeowner FAQs
  {
    category: "homeowner",
    q: "Is it completely free for clients to request quotes and hire?",
    a: "Yes. Posting a job, requesting custom quotes, and browsing verified professional profiles on Nutsumo is 100% free with zero obligation. You only pay the exact agreed-upon quote amount into secure escrow when you hire.",
  },
  {
    category: "homeowner",
    q: "How does Nutsumo 100% Escrow Protection work?",
    a: "When you accept a quotation, you fund the job via card or Mobile Money into our secure escrow vault. The professional cannot withdraw these funds until the job is completed and you personally review it and click 'Sign Off & Release'. If the professional fails to deliver, our dispute desk issues a full refund.",
  },
  {
    category: "homeowner",
    q: "How are workers and professionals on Nutsumo verified?",
    a: "Everyone offering services on Nutsumo  tradespeople, chefs, drivers, nannies, security personnel, office, creative and domestic workers  verifies their identity against their national Ghana Card and shares their skills and experience before they receive the 'Verified Pro' badge.",
  },
  {
    category: "homeowner",
    q: "What is the difference between posting a job and requesting a custom quote?",
    a: "Requesting a Custom Quote lets you send your job directly to a specific verified professional you selected from the directory. Posting a Public Job broadcasts your requirements to all verified workers in that category and location so they can submit competitive proposals.",
  },
  {
    category: "homeowner",
    q: "What happens if the work is subpar or incomplete?",
    a: "Because your payment remains locked in Nutsumo Escrow, you should never release payment for incomplete or substandard work. Simply open a dispute from your booking dashboard. Our Accra dispute resolution team will inspect the case and either require rework or refund your escrow deposit.",
  },

  // Artisan FAQs
  {
    category: "artisan",
    q: "Do I have to pay to view leads or submit quotations?",
    a: "No! Unlike legacy directories that force you to buy expensive credits to bid or pay for shared dead leads, Nutsumo has ZERO upfront lead fees. You browse jobs and submit quotations completely free.",
  },
  {
    category: "artisan",
    q: "How does the 22.5% fee work?",
    a: "Nutsumo deducts 22.5% only when a funded job is completed and released. That is 15% Ghana VAT, 2.5% NHIL, 2.5% GETFund, and a 2.5% Nutsumo platform fee. You keep 77.5% in your Nutsumo balance.",
  },
  {
    category: "artisan",
    q: "How and when do I receive payout after job completion?",
    a: "After you deliver and the customer confirms, Nutsumo reviews the job and releases your 77.5% net into your Nutsumo balance. From Overview you withdraw that balance to a Ghanaian bank account or MTN MoMo, Vodafone Cash, or AirtelTigo.",
  },
  {
    category: "artisan",
    q: "How do I become a Verified Pro on Nutsumo?",
    a: "Complete your professional registration with any skill  formal or informal  upload your valid Ghana Card, and add your experience, certificates or examples of past work. Our compliance team verifies your identity within 24 business hours.",
  },
  {
    category: "artisan",
    q: "What if a client refuses to release escrow after I finished the work?",
    a: "Nutsumo protects both sides! If you completed the agreed job and uploaded proof (photos, job milestones), but the customer refuses to respond, our Dispute Resolution Desk steps in, evaluates the job evidence, and releases your funds automatically.",
  },
];

const TABS = [
  { key: "homeowner", label: "For clients & businesses" },
  { key: "artisan", label: "For workers & professionals" },
] as const;

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<"homeowner" | "artisan">("homeowner");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredFaqs = faqs.filter(
    (f) => f.category === activeTab && (!q || `${f.q} ${f.a}`.toLowerCase().includes(q)),
  );

  return (
    <div className="bg-white min-h-screen pb-20 sm:pb-28">
      {/* 1. HERO BANNER with search */}
      <PageBanner
        eyebrow="Help centre"
        title="How can we help?"
        description="Clear answers about escrow protection, verified worker screening, statutory taxes and fast payouts."
        image={stock.consultation}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      >
        <label className="relative block max-w-xl">
          <span className="sr-only">Search the FAQ</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenIndex(0);
            }}
            placeholder="Search questions, e.g. escrow, fee, payout"
            className="w-full rounded-xl bg-white py-4 pl-12 pr-4 text-[15px] text-title placeholder:text-slate-400 shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/30"
          />
        </label>
      </PageBanner>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14">
          {/* 2. TABS + ACCORDION */}
          <div>
            <div role="tablist" aria-label="FAQ audience" className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setOpenIndex(0);
                  }}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition cursor-pointer ${
                    activeTab === tab.key ? "bg-title text-white!" : "bg-slate-100 text-title hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left cursor-pointer"
                    >
                      <span className={`font-display text-base font-semibold transition-colors sm:text-lg ${isOpen ? "text-primary" : "text-title group-hover:text-primary"}`}>
                        {faq.q}
                      </span>
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${
                          isOpen ? "bg-primary text-white" : "bg-slate-100 text-title group-hover:bg-slate-200"
                        }`}
                      >
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="-mt-2 pb-6 pr-12 text-[15px] leading-relaxed text-copy animate-[fadeUp_.3s_ease_both]">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="mt-8 rounded-2xl bg-slate-50 px-6 py-10 text-center">
                <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 font-semibold text-title">No questions match “{query}”</p>
                <p className="mt-1 text-sm text-copy">Try another word, or contact our support team below.</p>
              </div>
            ) : null}
          </div>

          {/* 3. SIDEBAR */}
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl bg-[#2A0A12]">
              <div className="relative aspect-[16/10]">
                <Image src={stock.womenMeeting} alt="" fill sizes="340px" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-[#2A0A12] to-transparent" />
              </div>
              <div className="px-6 pb-7 -mt-6 relative">
                <p className="font-display text-xl font-semibold text-white!">Still have questions?</p>
                <p className="mt-2 text-sm text-white/75">
                  Our Accra support and dispute desk can help with any job, payment or account.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact support
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6">
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="text-copy"><span className="font-semibold text-title">100% escrow protection</span> on every funded job.</span>
                </li>
                <li className="flex gap-3">
                  <Lock className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-copy"><span className="font-semibold text-title">Ghana Card verified</span> workers and professionals.</span>
                </li>
              </ul>
              <Link href="/how-it-works" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-title underline-offset-4 hover:underline">
                How Nutsumo works <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

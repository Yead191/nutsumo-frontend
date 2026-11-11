"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Plus,
  Minus,
  Sparkles,
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
    a: "Yes. Posting a job, requesting custom quotes, and browsing verified artisan profiles on Nutsumo is 100% free with zero obligation. You only pay the exact agreed-upon quote amount into secure escrow when you hire.",
  },
  {
    category: "homeowner",
    q: "How does Nutsumo 100% Escrow Protection work?",
    a: "When you accept a quotation, you fund the project via card or Mobile Money into our secure escrow vault. The artisan cannot withdraw these funds until the job is completed and you personally inspect and click 'Sign Off & Release'. If the artisan fails to deliver, our dispute desk issues a full refund.",
  },
  {
    category: "homeowner",
    q: "How are artisans on Nutsumo verified?",
    a: "Every tradesperson on Nutsumo undergoes strict biometric verification against their national Ghana Card, criminal record auditing, and technical trade skill validation before they receive the 'Verified Pro' badge.",
  },
  {
    category: "homeowner",
    q: "What is the difference between posting a job and requesting a custom quote?",
    a: "Requesting a Custom Quote lets you send your project directly to a specific verified artisan you selected from the directory. Posting a Public Job broadcasts your requirements to all cleared artisans in your trade and location so they can submit competitive bids.",
  },
  {
    category: "homeowner",
    q: "What happens if the artisan's work is subpar or incomplete?",
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
    q: "How does the 20% platform and statutory deduction work?",
    a: "Nutsumo deducts a transparent 20% only when you successfully complete a funded job and the client releases escrow. This breakdown covers 15% standard Ghana VAT, 2.5% NHIL, and 2.5% GETFund. You keep 80% guaranteed net payout.",
  },
  {
    category: "artisan",
    q: "How and when do I receive payout after job completion?",
    a: "Once the customer signs off the completed milestone, your 80% net payout is automatically released. You can withdraw directly to your Ghanaian bank account or MTN MoMo / Vodafone Cash / AirtelTigo wallet with instant or same-day processing.",
  },
  {
    category: "artisan",
    q: "How do I become a Verified Pro on Nutsumo?",
    a: "Complete your artisan registration, upload your valid Ghana Card, and submit photos of past completed projects. Our compliance team verifies your identity and references within 24 business hours.",
  },
  {
    category: "artisan",
    q: "What if a client refuses to release escrow after I finished the work?",
    a: "Nutsumo protects both sides! If you completed the agreed project scope and uploaded proof (photos, job milestones), but the customer refuses to respond, our Dispute Resolution Desk steps in, evaluates the job evidence, and releases your funds automatically.",
  },
];

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<"homeowner" | "artisan">("homeowner");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((f) => f.category === activeTab);

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Help & Frequently Asked Questions</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-title tracking-tight max-w-3xl mx-auto">
            Everything You Need to Know About Nutsumo
          </h1>

          <p className="text-base sm:text-lg text-copy leading-relaxed max-w-2xl mx-auto font-sans">
            Transparent answers about 100% escrow protection, verified artisan screening, statutory tax compliance, and fast payouts.
          </p>

          {/* Interactive Switcher */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("homeowner");
                  setOpenIndex(0);
                }}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "homeowner"
                    ? "bg-white text-title shadow-sm"
                    : "text-muted hover:text-title"
                }`}
              >
                For Clients & Homeowners
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("artisan");
                  setOpenIndex(0);
                }}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "artisan"
                    ? "bg-white text-title shadow-sm"
                    : "text-muted hover:text-title"
                }`}
              >
                For Artisans & Trade Pros
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACCORDION LIST */}
      <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? "border-primary/40 bg-slate-50/50 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="font-display text-sm sm:text-base font-bold text-title">
                  {faq.q}
                </span>
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full shrink-0 transition-colors ${
                    isOpen ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {isOpen ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-copy leading-relaxed font-sans border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}

        {/* Still have questions card */}
        <div className="pt-10 text-center space-y-3">
          <p className="text-xs sm:text-sm text-muted">
            Still have questions or need help with a custom project?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-primary text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Contact Nutsumo Support Team</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

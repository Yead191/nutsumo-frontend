"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  FileCheck2,
  ShieldCheck,
  UserPlus,
  Lock,
  CalendarDays,
  CreditCard,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Banknote,
  Search,
} from "lucide-react";

export function HowItWorksContent() {
  const [activeTab, setActiveTab] = useState<"client" | "artisan">("client");

  const clientSteps = [
    {
      step: "01",
      title: "Discover or Request Custom Quote",
      description:
        "Browse verified Ghanaian master craftsmen by trade, view real project portfolios and ratings, or request a custom quote with your project description and photos.",
      icon: Search,
      badge: "Free & Fast",
    },
    {
      step: "02",
      title: "Receive Itemized Quotations",
      description:
        "Selected artisans review your project specs and submit clear, transparent quotes. Inspect proposed pricing, duration, and statutory tax breakdown before deciding.",
      icon: FileCheck2,
      badge: "No Obligation",
    },
    {
      step: "03",
      title: "Fund 100% Secure Escrow",
      description:
        "Accept your preferred quotation and fund the project via card or Mobile Money. Your funds are held securely in escrow—the artisan cannot withdraw them until you approve.",
      icon: Lock,
      badge: "Zero Cash Risk",
    },
    {
      step: "04",
      title: "Inspect, Sign Off & Rate",
      description:
        "The artisan completes the job according to your requirements. After inspecting the work, approve the release of funds and leave an authentic verified review.",
      icon: Star,
      badge: "Satisfaction Guaranteed",
    },
  ];

  const artisanSteps = [
    {
      step: "01",
      title: "Biometric Identity & Skill Verification",
      description:
        "Sign up as an artisan, upload your Ghana Card and proof of trade craftsmanship. Our verification team reviews your credentials within 24 hours.",
      icon: UserPlus,
      badge: "Verified Badge",
    },
    {
      step: "02",
      title: "Receive High-Intent Job Requests",
      description:
        "Get instant notifications when clients in your coverage area request a custom quote or post a project matching your specialized trade.",
      icon: ClipboardList,
      badge: "Direct Clients",
    },
    {
      step: "03",
      title: "Submit Official Itemized Quotations",
      description:
        "Propose your exact rate (hourly or fixed) and completion timeline. The quote shows 22.5% in total: 15% VAT, 2.5% NHIL, 2.5% GETFund, and a 2.5% platform fee.",
      icon: FileCheck2,
      badge: "Zero Dead Lead Fees",
    },
    {
      step: "04",
      title: "Work with Secured Escrow & Fast Payout",
      description:
        "Once the client accepts and funds escrow, begin work with the payment held by Nutsumo. After completion, your net is released to your balance and you withdraw it to a bank account or mobile money.",
      icon: Banknote,
      badge: "Guaranteed Payout",
    },
  ];

  const currentSteps = activeTab === "client" ? clientSteps : artisanSteps;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Nutsumo Escrow Journey</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-title tracking-tight max-w-3xl mx-auto">
            How Nutsumo Protects Both Clients and Craftsmen
          </h1>

          <p className="text-base sm:text-lg text-copy leading-relaxed max-w-2xl mx-auto font-sans">
            A step-by-step discovery and escrow payment flow modeled after industry leaders like Upwork and Fiverr, tailored for Ghana.
          </p>

          {/* Interactive Audience Switcher */}
          <div className="pt-6 flex justify-center">
            <div className="inline-flex rounded-2xl bg-slate-100 p-1.5 border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("client")}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "client"
                    ? "bg-white text-title shadow-sm"
                    : "text-muted hover:text-title"
                }`}
              >
                For Homeowners & Clients
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("artisan")}
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

      {/* 2. PROGRESSIVE 4-STEP CARDS */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 relative overflow-hidden group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-black text-slate-300 group-hover:text-primary transition-colors">
                      {s.step}
                    </span>
                    <span className="rounded-full bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-0.5">
                      {s.badge}
                    </span>
                  </div>

                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-title">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-copy leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Backed by Escrow Protection</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-12 text-center">
          {activeTab === "client" ? (
            <Link
              href="/browse-pros"
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-8 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Start Browsing Verified Pros</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/pro-register"
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-8 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Apply to Join as an Artisan</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* 3. ESCROW SECURITY COMPARISON TABLE */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-display">
              Escrow Protection
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-title">
              Traditional Cash Payment vs. Nutsumo Escrow
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-slate-100/80 p-4 border-b border-slate-200 text-xs font-bold text-title uppercase font-display">
              <div className="col-span-6 sm:col-span-5">Feature</div>
              <div className="col-span-3 text-center text-rose-700">Cash / Informal</div>
              <div className="col-span-3 sm:col-span-4 text-center text-primary">Nutsumo Escrow</div>
            </div>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 sm:col-span-5 font-semibold text-title">Upfront Deposit Safety</div>
                <div className="col-span-3 text-center text-rose-600 font-bold">0% (High Risk)</div>
                <div className="col-span-3 sm:col-span-4 text-center text-emerald-600 font-bold">100% Escrow Protected</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 sm:col-span-5 font-semibold text-title">Artisan Identity Verification</div>
                <div className="col-span-3 text-center text-rose-600 font-bold">None (Unverified)</div>
                <div className="col-span-3 sm:col-span-4 text-center text-emerald-600 font-bold">Ghana Card Biometric Audit</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 sm:col-span-5 font-semibold text-title">Dispute Resolution Desk</div>
                <div className="col-span-3 text-center text-rose-600 font-bold">No recourse</div>
                <div className="col-span-3 sm:col-span-4 text-center text-emerald-600 font-bold">Accra Arbitration Team</div>
              </div>

              <div className="grid grid-cols-12 p-4 items-center">
                <div className="col-span-6 sm:col-span-5 font-semibold text-title">Payment Release Timing</div>
                <div className="col-span-3 text-center text-slate-500">Before work starts</div>
                <div className="col-span-3 sm:col-span-4 text-center text-emerald-600 font-bold">Only after client sign-off</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

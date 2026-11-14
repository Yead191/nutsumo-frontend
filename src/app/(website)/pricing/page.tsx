import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Banknote,
  Percent,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing & Transparent Platform Fees | Nutsumo",
  description:
    "100% free for clients to browse and request quotes. Zero upfront lead fees for artisans. Learn about the 22.5% fee: statutory levies plus a 2.5% platform fee.",
};

export default function PricingPage() {
  const breakdownRows = [
    { name: "Ghana VAT (Standard)", rate: "15.0%", note: "Direct statutory value-added tax" },
    { name: "NHIL (National Health Insurance)", rate: "2.5%", note: "Healthcare infrastructure fund" },
    { name: "GETFund (Ghana Education Trust)", rate: "2.5%", note: "National education support levy" },
    { name: "Nutsumo platform fee", rate: "2.5%", note: "Charged only on a completed funded job" },
    { name: "Total deduction", rate: "22.5%", isTotal: true },
    { name: "Artisan net take-home", rate: "77.5%", isArtisan: true },
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fair & Transparent Economics</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-title tracking-tight max-w-3xl mx-auto">
            Zero Upfront Fees. Zero Hidden Surprises.
          </h1>

          <p className="text-base sm:text-lg text-copy leading-relaxed max-w-2xl mx-auto font-sans">
            Nutsumo operates on complete transparency. Clients hire for free with 100% escrow protection. Artisans pay zero upfront membership or per-lead fees.
          </p>
        </div>
      </section>

      {/* 2. DUAL PRICING PILLARS (Clients vs Artisans) */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* For Homeowners & Clients */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                <span>For Homeowners & Businesses</span>
              </div>

              <div>
                <div className="font-display text-4xl sm:text-5xl font-black text-title">
                  GH₵ 0
                  <span className="text-xs sm:text-sm font-normal text-muted ml-1.5">
                    100% Free Forever
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-copy mt-2 leading-relaxed">
                  Post requests, browse verified artisan profiles, and receive custom quotes without spending a pesewa.
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Free unlimited custom quote requests</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Escrow Protection included automatically</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Zero buyer markup or hidden checkout fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Free access to Nutsumo Dispute Resolution Desk</span>
                </div>
              </div>
            </div>

            <Link
              href="/browse-pros"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-title hover:bg-slate-800 text-white py-3.5 text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <span>Browse Artisans Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* For Artisans & Trade Pros */}
          <div className="rounded-3xl border-2 border-primary bg-primary/5 p-8 sm:p-10 shadow-md flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                <span>For Artisans & Trade Pros</span>
              </div>

              <div>
                <div className="font-display text-4xl sm:text-5xl font-black text-primary">
                  22.5%
                  <span className="text-xs sm:text-sm font-bold text-slate-700 ml-1.5">
                    Total deduction
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-copy mt-2 leading-relaxed">
                  No membership fees, no bidding tokens. Deducted only when you successfully complete a funded job.
                </p>
              </div>

              <div className="space-y-3.5 pt-4 border-t border-primary/10 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Zero upfront cost:</strong> Free profile listing and quote submission</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Zero pay-per-lead charges:</strong> Never pay for dead inquiries</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>77.5% net:</strong> Lands in your Nutsumo balance, then you withdraw to bank or mobile money</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span><strong>Full breakdown:</strong> 15% VAT, 2.5% NHIL, 2.5% GETFund, plus a 2.5% platform fee</span>
                </div>
              </div>
            </div>

            <Link
              href="/pro-register"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white py-3.5 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Join as an Artisan</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. STATUTORY 20% BREAKDOWN TABLE */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-display">
              Tax Transparency
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-title">
              Complete breakdown of the 22.5% deduction
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Here is exactly how every cedi is allocated when an escrow order is completed:
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {breakdownRows.map((row, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 sm:px-6 ${
                    row.isArtisan
                      ? "bg-emerald-50/70 font-bold text-emerald-800"
                      : row.isTotal
                        ? "bg-slate-100 font-bold text-title"
                        : "text-slate-700"
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-semibold block">
                      {row.name}
                    </span>
                    {row.note && (
                      <span className="text-[11px] text-muted block">
                        {row.note}
                      </span>
                    )}
                  </div>
                  <span className="font-display text-sm sm:text-base font-extrabold">
                    {row.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

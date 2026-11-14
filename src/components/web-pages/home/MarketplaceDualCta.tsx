import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Wrench,
  ShieldCheck,
  Check,
} from "lucide-react";

export function MarketplaceDualCta() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 1. FOR CLIENTS / HOMEOWNERS */}
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 border border-white/15">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span>For Homeowners &amp; Clients</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Have a project that needs skilled hands?
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Post your job details or browse verified trade pros directly.
                Review transparent proposals and fund escrow with 100% milestone
                protection.
              </p>

              <ul className="space-y-2 text-xs text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Free to post and compare quotes</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Pay only after work is inspected &amp; approved</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>0% hidden platform markup for clients</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 relative z-10">
              <Link
                href="/account/post-job"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-7 py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Post a Job Request</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* 2. FOR ARTISANS & SERVICE PROS */}
          <div className="rounded-3xl bg-primary text-white p-8 sm:p-10 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl">
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#00A1DE]/30 blur-3xl" />

            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white border border-white/20">
                <Wrench className="h-3.5 w-3.5 text-amber-300" />
                <span>For Craftsmen &amp; Trade Specialists</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                Are you a skilled professional looking for verified work?
              </h3>

              <p className="text-sm text-blue-100 leading-relaxed font-sans">
                Join Nutsumo as a verified pro. Connect with high-intent local
                clients, submit custom quotes, and enjoy guaranteed escrow
                payouts without chasing unpaid invoices.
              </p>

              <ul className="space-y-2 text-xs text-blue-100 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>Client escrow held before you lift a single tool</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>
                    Keep 77.5% net, then withdraw it from your Nutsumo balance
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>
                    Direct client communication &amp; portfolio showcase
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 relative z-10">
              <Link
                href="/pro-register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-slate-100 text-title px-7 py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Join as a Verified Pro</span>
                <ArrowRight className="h-4 w-4 text-primary" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { Briefcase, ShieldCheck, Sparkles, PlusCircle } from "lucide-react";

export function JobsSearchHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
      {/* BACKGROUND ACCENT GLOW */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#FE375D]/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        {/* EYEBROW */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-rose-300 backdrop-blur-md mb-4">
          <Sparkles className="h-3.5 w-3.5 text-[#FE375D]" />
          <span>Real-time Ghana Job Opportunities</span>
        </div>

        {/* HEADLINE */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Find Jobs & <span className="text-[#FE375D]">Submit Proposals</span>
        </h1>

        {/* SUBTITLE */}
        <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
          Browse active repair, construction, and service requests from verified clients across Ghana.
          Review job specifications, submit competitive quotations in Ghana Cedis (GH₵), and get hired directly.
        </p>

        {/* QUICK STATS & POST JOB CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#FE375D]/20 text-[#FE375D]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <span className="text-slate-300">100% Verified Clients</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Briefcase className="h-3.5 w-3.5" />
            </span>
            <span className="text-slate-300">0% Commission on Quotes</span>
          </div>

          <div className="sm:ml-auto">
            <Link
              href="/account/post-job"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-all backdrop-blur-md"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>I Need Work Done &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

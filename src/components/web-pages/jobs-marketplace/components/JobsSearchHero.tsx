"use client";

import Link from "next/link";
import Image from "next/image";
import { Briefcase, ShieldCheck, PlusCircle } from "lucide-react";
import { stock } from "@/lib/stock-photos";

export function JobsSearchHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl bg-[#2A0A12] text-white">
      {/* Photo + brand wash */}
      <Image
        src={stock.constructionTeam}
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 1216px, 100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#2A0A12] via-[#2A0A12]/85 to-[#2A0A12]/30" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 -z-10 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />

      <div className="max-w-2xl px-6 py-12 sm:px-12 sm:py-16 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Jobs board</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-white! sm:text-5xl">
          Find jobs &amp; <span className="text-primary">submit proposals</span>
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
          Browse active job requests from verified clients across Ghana: domestic, driving,
          catering, trades, office, creative and more. Quote in Ghana Cedis (GH₵) and get hired directly.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <span className="inline-flex items-center gap-2 text-white/85">
            <ShieldCheck className="h-4 w-4 text-primary" />
            100% verified clients
          </span>
          <span className="inline-flex items-center gap-2 text-white/85">
            <Briefcase className="h-4 w-4 text-emerald-400" />
            0% commission on quotes
          </span>
        </div>

        <Link
          href="/account/post-job"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-title transition-colors hover:bg-primary hover:text-white"
        >
          <PlusCircle className="h-4 w-4" />
          I need work done
        </Link>
      </div>
    </section>
  );
}

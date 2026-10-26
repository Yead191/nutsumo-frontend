"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Home, Minus, Plus, Wrench } from "lucide-react";
import { cn } from "@/lib/cn";
import { faqs as defaultFaqs, homeownerFaqs, proFaqs } from "@/lib/site-content";

export function FaqSection({
  eyebrow = "FAQ",
  title = "Questions? We’ve got answers.",
  description,
  items = defaultFaqs,
  className,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: { q: string; a: string }[];
  className?: string;
}) {
  const [tab, setTab] = useState<"homeowner" | "pro">("homeowner");
  const [open, setOpen] = useState(0);

  const displayItems =
    items !== defaultFaqs ? items : tab === "homeowner" ? homeownerFaqs : proFaqs;

  const dynamicDescription =
    description ||
    (tab === "homeowner"
      ? "See how to post a request, compare quotes, and pay your pro. Ask us if something is still unclear."
      : "See how to join, get requests, and get paid. Apply if you want to take jobs.");

  return (
    <section id="faq" className={cn("bg-surface py-[var(--section-sm)] md:py-[var(--section)]", className)}>
      <div className="container-site grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left Column: Editorial Sticky Heading & Contextual Actions */}
        <div className="lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 font-geist text-[13px] sm:text-[13.5px] font-semibold uppercase tracking-wider text-primary">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary"
            />
            <span>{eyebrow}</span>
          </div>

          <h2 className="mt-4 font-display text-[32px] sm:text-[40px] md:text-[46px] font-medium uppercase leading-[1.08] tracking-[-0.04em] text-title">
            {title}
          </h2>

          <p className="mt-4 max-w-sm font-sans text-[15px] sm:text-[16px] leading-relaxed text-muted transition-all duration-300">
            {dynamicDescription}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {tab === "homeowner" ? (
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3.5 rounded-full border border-title bg-white pl-5 pr-2 py-2 font-display text-xs sm:text-sm font-medium text-title shadow-2xs transition-all duration-300 hover:border-primary hover:text-primary hover:shadow-xs"
              >
                <span>Ask a Question</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-title text-white transition-colors duration-300 group-hover:bg-primary">
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            ) : (
              <Link
                href="/pro-register"
                className="group inline-flex items-center gap-3.5 rounded-full border border-primary bg-primary pl-5 pr-2 py-2 font-display text-xs sm:text-sm font-medium text-white shadow-2xs transition-all duration-300 hover:bg-primary/90 hover:shadow-xs"
              >
                <span>Join as a Pro</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-primary transition-colors duration-300">
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Audience Switcher Header + Accordion Cards */}
        <div className="space-y-4">
          {/* Top Segmented Audience Switcher (Gestalt Law of Proximity: positioned right on top of questions) */}
          <div className="flex items-center pb-3 border-b border-line/70">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/70 shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  setTab("homeowner");
                  setOpen(0);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                  tab === "homeowner"
                    ? "bg-white text-title shadow-2xs"
                    : "text-muted hover:text-title",
                )}
              >
                <Home className="h-4 w-4 text-primary shrink-0" />
                <span>For Homeowners</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                    tab === "homeowner" ? "bg-primary/10 text-primary" : "bg-slate-200/60 text-muted",
                  )}
                >
                  {homeownerFaqs.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab("pro");
                  setOpen(0);
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                  tab === "pro"
                    ? "bg-white text-title shadow-2xs"
                    : "text-muted hover:text-title",
                )}
              >
                <Wrench className="h-4 w-4 text-primary shrink-0" />
                <span>For Contractors &amp; Pros</span>
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                    tab === "pro" ? "bg-primary/10 text-primary" : "bg-slate-200/60 text-muted",
                  )}
                >
                  {proFaqs.length}
                </span>
              </button>
            </div>
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-3 sm:space-y-3.5 pt-1">
            {displayItems.map((item, index) => {
              const active = open === index;
              return (
                <div
                  key={item.q}
                  className={cn(
                    "overflow-hidden rounded-xl bg-white transition-all duration-200",
                    active
                      ? "border border-primary/40 shadow-sm ring-1 ring-primary/15"
                      : "border border-line/80 shadow-2xs hover:border-slate-300",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(active ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer sm:px-6 sm:py-4.5"
                    aria-expanded={active}
                  >
                    <span
                      className={cn(
                        "font-display text-[15px] font-semibold leading-snug tracking-tight transition-colors sm:text-[16.5px]",
                        active ? "text-primary" : "text-title",
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors sm:h-8 sm:w-8",
                        active ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                      )}
                    >
                      {active ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  {active && (
                    <div className="border-t border-line/40 px-5 pb-4.5 pt-3 sm:px-6 sm:pb-5">
                      <p className="font-sans text-xs sm:text-sm leading-relaxed text-muted">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
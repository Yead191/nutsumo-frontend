"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { stock } from "@/lib/stock-photos";

const FLOWS = {
  clients: {
    label: "For clients",
    cta: { href: "/account/post-job", label: "Post a job for free" },
    steps: [
      {
        title: "Post a job or search",
        text: "Describe what you need in a few lines, or browse verified pros by category and city.",
        image: stock.laptopWork,
      },
      {
        title: "Compare quotes & chat",
        text: "Get custom quotes, check reviews and ID badges, and message pros privately before you decide.",
        image: stock.consultation,
      },
      {
        title: "Pay safely, get it done",
        text: "Your payment sits in escrow and is released only when you approve the finished work.",
        image: stock.electrician,
      },
    ],
  },
  pros: {
    label: "For pros",
    cta: { href: "/pro-register", label: "Become a pro" },
    steps: [
      {
        title: "Create your profile",
        text: "Show your skills, rates, portfolio and service areas. Get verified to stand out.",
        image: stock.portraitManSmile,
      },
      {
        title: "Win jobs near you",
        text: "Receive job leads and quote requests from clients who need exactly what you do.",
        image: stock.carpenter,
      },
      {
        title: "Get paid securely",
        text: "Funds are secured in escrow before you start, so you always get paid for approved work.",
        image: stock.cardPayment,
      },
    ],
  },
} as const;

type FlowKey = keyof typeof FLOWS;

/** Three photo-led steps with a clients / pros toggle. */
export function HowItWorksVisual() {
  const [flow, setFlow] = useState<FlowKey>("clients");
  const current = FLOWS[flow];

  return (
    <section className="bg-slate-50 py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">How it works</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-title">
              Hire or get hired in three steps
            </h2>
          </div>
          <div role="tablist" aria-label="Choose who you are" className="inline-flex self-start rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200 sm:self-auto">
            {(Object.keys(FLOWS) as FlowKey[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={flow === key}
                onClick={() => setFlow(key)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition cursor-pointer ${
                  flow === key ? "bg-title text-white!" : "text-copy hover:text-title"
                }`}
              >
                {FLOWS[key].label}
              </button>
            ))}
          </div>
        </div>

        <ol key={flow} className="mt-12 grid gap-6 md:grid-cols-3">
          {current.steps.map((step, index) => (
            <li
              key={step.title}
              className="group overflow-hidden rounded-3xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 animate-[fadeUp_.45s_ease_both]"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={step.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white font-display text-lg font-bold text-primary shadow-md">
                  {index + 1}
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="font-display text-xl font-semibold text-title">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-copy">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href={current.cta.href}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            {current.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/how-it-works" className="text-sm font-semibold text-title underline-offset-4 hover:underline">
            Learn more about how Nutsumo works
          </Link>
        </div>
      </div>
    </section>
  );
}

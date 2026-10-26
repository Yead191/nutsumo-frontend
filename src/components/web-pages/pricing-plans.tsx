"use client";

import {
  Search,
  ClipboardList,
  Layers,
  ShieldCheck,
  CheckCircle2,
  BadgePercent,
  Briefcase,
  MessagesSquare,
  Zap,
  BadgeCheck,
  Award,
  Phone,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { plans, type PlanItem } from "@/lib/site-content";
import { useRoleAccess } from "@/hooks/use-role-access";

function getPlanIcon(name: string) {
  switch (name) {
    case "search":
      return Search;
    case "clipboard":
      return ClipboardList;
    case "layers":
      return Layers;
    case "shield":
      return ShieldCheck;
    case "percent":
      return BadgePercent;
    case "briefcase":
      return Briefcase;
    case "message":
      return MessagesSquare;
    case "zap":
      return Zap;
    case "badgeCheck":
    case "sparkles":
      return BadgeCheck;
    case "award":
      return Award;
    case "phone":
      return Phone;
    case "trending":
      return TrendingUp;
    default:
      return CheckCircle2;
  }
}

export function PricingPlans({
  eyebrow = "Transparent Pricing",
  title = "100% free for homeowners. Simple subscription for pros.",
  description = "Homeowners never pay any commissions, booking fees, or hidden markups — it's completely free. Service professionals simply choose a flat subscription and keep 100% of their earnings.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const { access, membershipActive } = useRoleAccess();

  return (
    <section id="pricing" className="bg-white py-[var(--section-sm)] md:py-[var(--section)]">
      <div className="container-site">
        <div className="flex flex-col items-center text-center">
          <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} />
        </div>

        <div className="mx-auto mt-14 sm:mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan: PlanItem) => {
            const isHome = plan.id === "homeowner";
            const isPro = plan.id === "pro" || plan.id === "pro-annual";
            const yours =
              (isHome && access.audience === "homeowner") ||
              (isPro && access.audience === "pro" && membershipActive);

            let href = plan.href;
            let cta = plan.cta;
            if (isHome) {
              if (access.audience === "homeowner") {
                href = "/account/post-job";
                cta = "Post a request ↗";
              } else if (access.audience === "pro") {
                href = "/pro/jobs";
                cta = "Stay on pro jobs ↗";
              }
            }
            if (isPro) {
              if (access.audience === "pro") {
                href = "/pro/pricing";
                cta = membershipActive ? "Manage membership ↗" : "Start free trial ↗";
              } else if (access.audience === "homeowner") {
                href = "/pro-register";
                cta = "Apply with a pro account ↗";
              }
            }

            return (
              <article
                key={plan.name}
                className={cn(
                  "relative flex flex-col justify-between rounded-[24px] bg-white p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  plan.featured
                    ? "border-2 border-primary/50 shadow-md ring-1 ring-primary/20"
                    : isHome
                    ? "border-2 border-emerald-500/30 shadow-xs"
                    : "border border-line shadow-xs",
                )}
              >
                {/* Subtle top brand dot glow on featured card */}
                {plan.featured ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl"
                  />
                ) : null}

                <div>
                  {/* Top Bar: Title & Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-[20px] sm:text-[22px] font-medium tracking-tight text-title">
                      {plan.name}
                    </h3>
                    {yours ? (
                      <span className="rounded-full bg-smoke px-3 py-0.5 font-display text-xs font-semibold text-primary">
                        Your plan
                      </span>
                    ) : plan.badge ? (
                      <span
                        className={cn(
                          "rounded-full px-3 py-0.5 font-display text-xs font-semibold",
                          isHome
                            ? "border border-emerald-500/30 bg-emerald-50 text-emerald-700"
                            : plan.featured
                            ? "border border-primary/25 bg-primary/10 text-primary"
                            : "border border-line bg-smoke text-title/70",
                        )}
                      >
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>

                  {/* Tagline */}
                  <p className="mt-2 font-sans text-xs sm:text-[13px] leading-relaxed text-[#757575] min-h-[36px]">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-[38px] sm:text-[42px] font-medium leading-none tracking-tight text-title">
                      {plan.price}
                    </span>
                    <span className="font-sans text-xs sm:text-sm text-[#757575]">
                      {plan.period}
                    </span>
                  </div>

                  {/* CTA Button placed with generous top margin */}
                  <div className="mt-7">
                    {plan.featured ? (
                      <Button
                        href={href}
                        className="w-full"
                      >
                        {cta}
                      </Button>
                    ) : (
                      <Button
                        href={href}
                        variant="ghost"
                        className="w-full"
                      >
                        {cta}
                      </Button>
                    )}
                  </div>

                  {/* Generous Divider separating CTA button from Features */}
                  <div className="mt-8 mb-6 border-t border-line/70" />

                  {/* Features List with comfortable breathing room */}
                  <ul className="space-y-3.5">
                    {plan.features.map((feat) => {
                      const Icon = getPlanIcon(feat.icon);
                      return (
                        <li key={feat.text} className="flex items-center gap-3.5">
                          <span
                            className={cn(
                              "grid h-6 w-6 shrink-0 place-items-center rounded-md",
                              plan.featured
                                ? "bg-primary/10 text-primary"
                                : "bg-smoke text-title/70",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <span className="font-sans text-xs sm:text-[13.5px] leading-snug text-title/90 font-normal">
                            {feat.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

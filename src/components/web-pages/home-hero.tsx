"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Briefcase,
  MapPin,
  Repeat,
  Search,
  TriangleAlert,
  Wrench,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { EmergencyBanner } from "@/components/shared/emergency-banner";
import { photos } from "@/lib/media";
import { categories } from "@/Mockdata";
import { loginAs } from "@/redux/slices/authSlice";
import { saveDraft } from "@/redux/slices/intakeSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { postJobHref } from "@/lib/role-access";
import { cn } from "@/lib/cn";

const EMERGENCY_PATTERNS = [
  "gas leak",
  "smell gas",
  "gas odor",
  "electrical fire",
  "sparks",
  "sparking",
  "flames",
  "fire",
  "flooding",
  "burst pipe",
  "carbon monoxide",
  "co detector",
  "ceiling collapsing",
  "exposed live wire",
];

function detectEmergency(text: string): boolean {
  const lower = text.toLowerCase();
  return EMERGENCY_PATTERNS.some((pattern) => lower.includes(pattern));
}

function guessServiceCategory(problem: string): string {
  const p = problem.toLowerCase();
  if (p.includes("leak") || p.includes("sink") || p.includes("pipe") || p.includes("faucet") || p.includes("drain") || p.includes("toilet") || p.includes("water heater") || p.includes("clog")) {
    return "plumbing";
  }
  if (p.includes("circuit") || p.includes("breaker") || p.includes("outlet") || p.includes("wiring") || p.includes("light") || p.includes("switch") || p.includes("power")) {
    return "electrical";
  }
  if (p.includes("ac") || p.includes("air condition") || p.includes("furnace") || p.includes("heat") || p.includes("thermostat") || p.includes("cooling")) {
    return "hvac";
  }
  if (p.includes("roof") || p.includes("shingle") || p.includes("gutter") || p.includes("skylight")) {
    return "roofing";
  }
  if (p.includes("fridge") || p.includes("refrigerator") || p.includes("washer") || p.includes("dryer") || p.includes("dishwasher") || p.includes("oven") || p.includes("stove")) {
    return "appliance-repair";
  }
  if (p.includes("tree") || p.includes("lawn") || p.includes("grass") || p.includes("sprinkler")) {
    return "landscaping";
  }
  if (p.includes("clean") || p.includes("maid") || p.includes("housekeep")) {
    return "house-cleaning";
  }
  if (p.includes("paint") || p.includes("drywall") || p.includes("door") || p.includes("deck") || p.includes("shelf") || p.includes("lock") || p.includes("fence")) {
    return "handyman";
  }
  return "";
}

function buildDraft(problem: string, categorySlug: string, zip: string) {
  const guessed = categorySlug || guessServiceCategory(problem) || "handyman";
  const match = categories.find((item) => item.slug === guessed);
  return {
    problem,
    categorySlug: guessed,
    zip,
    title: match ? match.name : "Home service request",
    summary: problem,
    followUps: [
      "What type of property is this?",
      "Are there access details the contractor should know?",
      "Which days or times work best for your schedule?",
      "Can you upload photos of the area?",
    ],
  };
}

function fiveDigitZip(value?: string) {
  const match = value?.trim().match(/\d{5}/);
  return match?.[0] ?? "";
}

export function HomeHero() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const addresses = useAppSelector((state) => state.features.addresses);
  const home = addresses.find((item) => item.label.toLowerCase() === "home") ?? addresses[0];
  const knownZip = fiveDigitZip(user?.zip) || fiveDigitZip(home?.zip);
  const [mode, setMode] = useState<"ai" | "direct">("ai");
  const [problem, setProblem] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [zip, setZip] = useState(knownZip);
  const [error, setError] = useState("");
  const [showEmergency, setShowEmergency] = useState(false);
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  const [preview, setPreview] = useState<ReturnType<typeof buildDraft> | null>(null);

  const suggested = useMemo(
    () => categories.find((item) => item.slug === preview?.categorySlug),
    [preview],
  );

  function handleSummarize() {
    // 1. Safety check for life-threatening emergencies
    if (detectEmergency(problem)) {
      setShowEmergency(true);
      return;
    }

    if (mode === "ai" && problem.trim().length < 8) {
      setError("Please describe the issue in a few words (e.g. 'pipe leaking under kitchen sink').");
      return;
    }

    if (mode === "direct" && !categorySlug) {
      setError("Please choose a service trade.");
      return;
    }

    if (zip.trim().length < 2) {
      setError("Please enter your ZIP code or city.");
      return;
    }

    setError("");
    const draft = buildDraft(problem.trim(), categorySlug, zip.trim());
    setPreview(draft);
    dispatch(saveDraft(draft));
  }

  const isPro = user?.role === "pro";

  return (
    <>
      {showEmergency ? (
        <EmergencyBanner onDismiss={() => setShowEmergency(false)} />
      ) : null}

      <section className="relative min-h-[680px] overflow-hidden bg-title text-white md:min-h-[740px] lg:min-h-[780px]">
        <div
          className="absolute inset-0 bg-cover bg-[center_20%]"
          style={{ backgroundImage: `url(${photos.hero})` }}
        />
        <div className="hero-wash absolute inset-0 z-[1]" />

        <div className="container-site relative z-[2] grid min-h-[680px] items-center gap-10 py-14 md:min-h-[740px] md:py-16 lg:min-h-[780px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-24">
          {isPro ? (
            <div className="relative z-[1] max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 font-display text-xs font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Verified Pro Contractor Portal
              </span>
              <h1 className="hero-title mt-4 text-white !text-white text-[38px] sm:text-[48px] lg:text-[62px] font-[500] leading-[1.08] lg:leading-[65px] tracking-[-1.8px] lg:tracking-[-3px]">
                Welcome back,{" "}
                <span className="text-secondary">{user.name.split(" ")[0]}</span>
              </h1>
              <p className="mt-4 max-w-[540px] font-['Inter_Display',Inter,sans-serif] text-[18px] font-normal leading-[25px] tracking-[-0.18px] text-white/85">
                New homeowner repair requests are waiting in your service area. Quote directly, chat with clients, and keep 100% of your earnings with zero job fees.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button href="/pro/jobs" variant="white" size="lg" className="font-semibold text-sm">
                  View Available Jobs (6) ↗
                </Button>
                <Button href="/pro/profile" variant="ghost" size="lg" className="text-white hover:bg-white/10 border-white/30 text-sm">
                  My Storefront & Offers ↗
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative z-[1] max-w-xl">
              <h1 className="hero-title text-white !text-white text-[38px] sm:text-[48px] lg:text-[64px] font-[500] leading-[1.08] lg:leading-[67px] tracking-[-1.8px] lg:tracking-[-3.2px]">
                Find trusted local pros for{" "}
                <span className="text-secondary">home repairs</span>
              </h1>
              <p className="mt-4 max-w-[540px] font-['Inter_Display',Inter,sans-serif] text-[18px] font-normal leading-[25px] tracking-[-0.18px] text-white/85">
                Compare upfront bids from background-checked local contractors. Pay them directly when the job is done — with zero platform fees.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button href="/browse-pros" variant="white" size="lg" className="font-medium text-sm">
                  Browse Pros ↗
                </Button>
                <Button href="/how-it-works" variant="ghost" size="lg" className="text-white hover:bg-white/10 border-white/30 text-sm">
                  How it works ↗
                </Button>
              </div>
            </div>
          )}

          {isPro ? (
            <div className="relative z-10 rounded-[24px] border border-white/80 bg-white/95 p-6 text-title shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-7">
              <div className="flex items-center justify-between border-b border-line/60 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Briefcase className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-geist text-[17px] sm:text-[19px] font-medium tracking-tight text-title">
                      Contractor Dispatch Hub
                    </h2>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Austin Market Live
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-line/80 bg-surface/50 p-3">
                    <span className="block text-[11px] font-medium text-muted uppercase tracking-wider">
                      Open Requests
                    </span>
                    <span className="mt-1 block font-display text-2xl font-bold text-title">
                      6 Jobs
                    </span>
                    <span className="text-[11px] text-emerald-600 font-medium">Ready for bids</span>
                  </div>
                  <div className="rounded-xl border border-line/80 bg-surface/50 p-3">
                    <span className="block text-[11px] font-medium text-muted uppercase tracking-wider">
                      Platform Fee
                    </span>
                    <span className="mt-1 block font-display text-2xl font-bold text-title">
                      $0.00
                    </span>
                    <span className="text-[11px] text-muted">Keep 100% direct</span>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-title">
                      Special Offer: $25 OFF Active
                    </span>
                    <Link
                      href="/pro/profile"
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Edit Offer
                    </Link>
                  </div>
                  <p className="mt-1 text-xs text-[#757575]">
                    Shown to Austin homeowners when browsing your public storefront.
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <Button
                    href="/pro/jobs"
                    size="md"
                    className="w-full justify-center shadow-xs"
                  >
                    Browse Available Jobs Board ↗
                  </Button>
                  <Button
                    href="/pro/messages"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-center"
                  >
                    Open Client Messages ↗
                  </Button>
                </div>

                <div className="border-t border-line/60 pt-3 flex items-center justify-between">
                  <span className="text-xs text-muted">Need work done at your own home?</span>
                  <button
                    type="button"
                    onClick={() => dispatch(loginAs("homeowner"))}
                    className="inline-flex items-center gap-1.5 font-display text-xs font-semibold text-primary hover:underline"
                  >
                    <Repeat className="h-3 w-3" />
                    Switch to Homeowner Mode
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 rounded-[24px] border border-white/80 bg-white/95 p-6 text-title shadow-[0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-7">
              {/* Minimal Header with Mode Switcher */}
              <div className="flex items-center justify-between border-b border-line/60 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary">
                    {mode === "ai" ? <Wrench className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                  </span>
                  <h2 className="font-geist text-[17px] sm:text-[19px] font-medium tracking-tight text-title">
                    {mode === "ai" ? "What needs fixing?" : "Select your trade"}
                  </h2>
                </div>

                {/* Minimalist Segmented Pill */}
                <div className="inline-flex rounded-full bg-smoke p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => { setMode("ai"); setError(""); }}
                    className={cn(
                      "rounded-full px-3 py-1 font-medium transition-all text-xs",
                      mode === "ai" ? "bg-white text-title font-semibold shadow-xs" : "text-[#757575] hover:text-title",
                    )}
                  >
                    Describe
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode("direct"); setError(""); }}
                    className={cn(
                      "rounded-full px-3 py-1 font-medium transition-all text-xs",
                      mode === "direct" ? "bg-white text-title font-semibold shadow-xs" : "text-[#757575] hover:text-title",
                    )}
                  >
                    Pick Trade
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {mode === "direct" || isChangingCategory ? (
                  <div className="relative">
                    <Wrench className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <NativeSelect
                      value={categorySlug}
                      onChange={(event) => {
                        setCategorySlug(event.target.value);
                        if (preview) {
                          setPreview({
                            ...preview,
                            categorySlug: event.target.value,
                          });
                        }
                      }}
                      className="pl-10 text-sm rounded-xl border-line/80 bg-surface/50 focus:bg-white"
                    >
                      <option value="">Select a trade (e.g. Plumbing, HVAC, Electrician)</option>
                      {categories.map((item) => (
                        <option key={item.id} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>
                ) : null}

                {mode === "ai" ? (
                  <div>
                    <TextArea
                      value={problem}
                      onChange={(event) => {
                        setProblem(event.target.value);
                        if (detectEmergency(event.target.value)) {
                          setShowEmergency(true);
                        }
                      }}
                      placeholder="Describe your issue (e.g. water leaking under sink, AC blowing warm air upstairs...)"
                      className="min-h-[84px] resize-none text-sm rounded-xl border-line/80 bg-surface/50 p-3.5 focus:bg-white transition-colors"
                      rows={3}
                    />
                  </div>
                ) : null}

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <TextField
                    value={zip}
                    onChange={(event) => setZip(event.target.value)}
                    placeholder="Enter ZIP code or city (e.g. 78701)"
                    className="pl-10 text-sm rounded-xl border-line/80 bg-surface/50 focus:bg-white"
                  />
                </div>

                <div className="pt-1">
                  <Button
                    type="button"
                    size="md"
                    className="w-full justify-center shadow-xs transition-all hover:shadow-md"
                    onClick={handleSummarize}
                  >
                    {mode === "ai" ? "Review My Request ↗" : "Find Matching Pros ↗"}
                  </Button>
                </div>

                {error ? (
                  <p className="flex items-center gap-1.5 text-xs text-error font-medium" role="alert">
                    <TriangleAlert className="h-3.5 w-3.5 shrink-0" />
                    {error}
                  </p>
                ) : null}

                {preview ? (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-primary">
                          Recommended trade:
                        </p>
                        <p className="mt-0.5 font-display text-[16px] font-semibold text-title">
                          {suggested?.name ?? "General Home Repair"}
                        </p>
                        <p className="mt-0.5 text-xs text-[#757575]">
                          A few questions, then matching pros you can request a quote from.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsChangingCategory(!isChangingCategory)}
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                        {isChangingCategory ? "Done" : "Change"}
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 border-t border-primary/10 pt-2.5">
                      <Button size="sm" href={postJobHref(user)} className="flex-1 text-xs">
                        Continue
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        href={`/browse-pros?category=${preview.categorySlug}&location=${encodeURIComponent(preview.zip)}`}
                        className="text-xs"
                      >
                        Browse {suggested?.name ?? "pros"} ↗
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-[11.5px] text-[#757575] pt-0.5">
                    100% Free to post • No spam sales calls • Direct to pro
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
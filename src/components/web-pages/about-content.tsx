"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  DollarSign,
  Wrench,
  Zap,
  ShieldCheck,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/layout/page-banner";
import { photos } from "@/lib/media";
import { postJobHref } from "@/lib/role-access";
import { useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";

export interface AboutPillarData {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface AboutContentData {
  pageTitle: string;
  pageSubtitle: string;
  bannerImage?: string;
  whoWeAreEyebrow?: string;
  missionHeading: string;
  missionDescription: string;
  heroImage?: string;
  approachEyebrow?: string;
  solutionHeading: string;
  solutionDescription: string;
  visionDescription?: string;
  checklist?: string[];
  storyImage?: string;
  whyChooseEyebrow?: string;
  whyChooseHeading: string;
  whyChooseSubtitle: string;
  craftsmanImage?: string;
  pillars: AboutPillarData[];
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
}

const defaultAboutData: AboutContentData = {
  pageTitle: "About Us",
  pageSubtitle: "Connecting Austin homeowners directly with verified local trade professionals.",
  bannerImage: "/images/about/banner.jpg",
  whoWeAreEyebrow: "Who We Are",
  missionHeading: "Keeping Homes Running Smoothly with Expert Local Pros",
  missionDescription: "Austin's direct home services platform dedicated to master craftsmanship, upfront transparent pricing, and vetted local trade pros who treat your home with genuine care.",
  heroImage: "/images/about/hero.jpg",
  approachEyebrow: "Our Approach",
  solutionHeading: "Trusted Home Service Solutions for Every Home",
  solutionDescription: "At LocalHomeFix, our mission is to eliminate predatory middleman fees and restore direct, transparent relationships between homeowners and vetted local trade pros. We provide a protected, commission-free platform where quality work and fair compensation thrive together.",
  visionDescription: "To build the nation's most trusted and transparent neighborhood home services ecosystem—where every homeowner enjoys complete pricing clarity, independent trade contractors keep 100% of their earnings, and every repair is backed by genuine accountability.",
  checklist: [
    "Fast & reliable service",
    "Certified & licensed pros",
    "Transparent initial pricing",
    "100% workmanship guarantee",
  ],
  storyImage: "/images/about/solutions.jpg",
  whyChooseEyebrow: "Why Choose LocalHomeFix",
  whyChooseHeading: "Why Choose LocalHomeFix for Your Home Repairs",
  whyChooseSubtitle: "Traditional lead generation directories sell your private phone number to dozens of contractors who spam you for weeks. LocalHomeFix restores honesty with private, direct connections and fair pricing.",
  craftsmanImage: "/images/about/craftsman.jpg",
  pillars: [
    {
      id: "pillar-1",
      title: "Skilled & certified contractors",
      description: "Every technician in our network is thoroughly vetted for active Texas trade licensing, minimum $1M general liability insurance, and passed criminal background checks before submitting quotes.",
      iconName: "Wrench",
    },
    {
      id: "pillar-2",
      title: "Transparent & fair pricing",
      description: "Upfront, itemized estimates directly from the professional. Zero platform commissions, zero hidden markups, and direct payments so technicians keep 100% of what they earn.",
      iconName: "DollarSign",
    },
    {
      id: "pillar-3",
      title: "24/7 emergency & rapid response",
      description: "Urgent leaks, electrical outages, or HVAC breakdowns can't wait. Our broadcast dispatch alerts on-duty Austin specialists for rapid dispatch—often on-site within hours.",
      iconName: "Zap",
    },
  ],
  ctaEyebrow: "Ready to get started?",
  ctaHeading: "Experience Stress-Free Home Repairs Today",
  ctaDescription: "Post your project in under 2 minutes, get quotes from verified Austin contractors, and keep full control over your home.",
  ctaPrimaryText: "Post a Job for Free ↗",
  ctaSecondaryText: "Join as a Contractor ↗",
};

const STORAGE_KEY = "homefix_about_cms";

function getPillarIcon(name?: string) {
  switch (name) {
    case "DollarSign":
      return DollarSign;
    case "Zap":
      return Zap;
    case "ShieldCheck":
      return ShieldCheck;
    case "Clock":
      return Clock;
    case "Award":
      return Award;
    case "Wrench":
    default:
      return Wrench;
  }
}

export function AboutContent() {
  const user = useAppSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState<"mission" | "vision">("mission");
  const [data, setData] = useState<AboutContentData>(defaultAboutData);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData((prev) => ({
          ...prev,
          ...parsed,
          pillars: Array.isArray(parsed.pillars) && parsed.pillars.length > 0 ? parsed.pillars : prev.pillars,
          checklist: Array.isArray(parsed.checklist) && parsed.checklist.length > 0 ? parsed.checklist : prev.checklist,
        }));
      }
    } catch {
      // fallback to default
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setData((prev) => ({
            ...prev,
            ...parsed,
            pillars: Array.isArray(parsed.pillars) && parsed.pillars.length > 0 ? parsed.pillars : prev.pillars,
            checklist: Array.isArray(parsed.checklist) && parsed.checklist.length > 0 ? parsed.checklist : prev.checklist,
          }));
        } catch {}
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="bg-white text-title min-h-screen">
      {/* ========================================================================= */}
      {/* STANDARD SITE BANNER WITH BACKGROUND IMAGE AND BREADCRUMBS                */}
      {/* ========================================================================= */}
      <PageBanner
        eyebrow="About"
        title={data.pageTitle || "About Us"}
        description={data.pageSubtitle || "Connecting Austin homeowners directly with verified local trade professionals."}
        image={data.bannerImage || photos.banners.about}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      {/* ========================================================================= */}
      {/* SECTION 1: HERO SHOWCASE (100% Consistent with Global Design System)      */}
      {/* ========================================================================= */}
      <section className="pt-12 sm:pt-16 pb-12 sm:pb-16 bg-white border-b border-line/60">
        <div className="container-site">
          {/* Eyebrow: Global Design System standard with blue ring indicator */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
              />
              <span>{data.whoWeAreEyebrow || "Who We Are"}</span>
            </div>
          </div>

          {/* Heading: Global Design System standard (font-geist, font-medium, Title Case, no all-caps) */}
          <div className="mt-3.5 text-center max-w-3xl mx-auto">
            <h2 className="font-geist text-[32px] sm:text-[40px] md:text-[46px] font-medium leading-[1.14] tracking-[-1.5px] sm:tracking-[-2px] md:tracking-[-2.5px] !text-black">
              {data.missionHeading || "Keeping Homes Running Smoothly with Expert Local Pros"}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-['Inter_Display',Inter,sans-serif] text-[16px] sm:text-[18px] font-normal leading-[25px] tracking-[-0.18px] text-[#757575]">
              {data.missionDescription}
            </p>
          </div>

          {/* Wide Hero Showcase Image Banner */}
          <div className="mt-8 sm:mt-12 relative h-[280px] sm:h-[420px] md:h-[500px] w-full overflow-hidden rounded-[24px] sm:rounded-[32px] border border-line/70 shadow-sm group">
            <Image
              src={data.heroImage || "/images/about/hero.jpg"}
              alt="LocalHomeFix verified trade technicians collaborating on a residential service project"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: TRUSTED SOLUTIONS (Interactive Mission / Vision)              */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white border-b border-line/60">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 items-center">
            {/* Left Column: Heading, Interactive Tabs, Checklist */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
                />
                <span>{data.approachEyebrow || "Our Approach"}</span>
              </div>

              {/* Title */}
              <h2 className="mt-3.5 font-geist text-[30px] sm:text-[38px] md:text-[42px] font-medium leading-[1.14] tracking-[-1.5px] sm:tracking-[-2px] !text-black">
                {data.solutionHeading || "Trusted Home Service Solutions for Every Home"}
              </h2>

              {/* Interactive Tabs: Our Mission vs Our Vision */}
              <div className="mt-7 flex items-center gap-6 border-b border-line/80 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("mission")}
                  className={cn(
                    "relative pb-2 font-geist text-[15px] sm:text-[16px] font-medium tracking-tight transition-colors cursor-pointer",
                    activeTab === "mission"
                      ? "text-primary"
                      : "text-[#757575] hover:text-title"
                  )}
                >
                  Our Mission
                  {activeTab === "mission" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("vision")}
                  className={cn(
                    "relative pb-2 font-geist text-[15px] sm:text-[16px] font-medium tracking-tight transition-colors cursor-pointer",
                    activeTab === "vision"
                      ? "text-primary"
                      : "text-[#757575] hover:text-title"
                  )}
                >
                  Our Vision
                  {activeTab === "vision" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                  )}
                </button>
              </div>

              {/* Tab Description Copy */}
              <div className="mt-5 min-h-[96px]">
                {activeTab === "mission" ? (
                  <p className="font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[16px] leading-[1.65] text-[#555] animate-fadeIn">
                    {data.solutionDescription}
                  </p>
                ) : (
                  <p className="font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[16px] leading-[1.65] text-[#555] animate-fadeIn">
                    {data.visionDescription || "To build the nation's most trusted and transparent neighborhood home services ecosystem—where every homeowner enjoys complete pricing clarity, independent trade contractors keep 100% of their earnings, and every repair is backed by genuine accountability."}
                  </p>
                )}
              </div>

              {/* Feature Checkmarks (2x2 Grid) */}
              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(data.checklist && data.checklist.length > 0 ? data.checklist : [
                  "Fast & reliable service",
                  "Certified & licensed pros",
                  "Transparent initial pricing",
                  "100% workmanship guarantee",
                ]).map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </span>
                    <span className="font-geist text-[14px] sm:text-[14.5px] font-medium text-title">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Call to Action Button */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="/browse-pros" size="lg">
                  Browse Verified Pros ↗
                </Button>
                <Link
                  href="/how-it-works"
                  className="font-geist text-sm font-medium text-[#555] hover:text-primary transition-colors px-2 py-2"
                >
                  See how it works ↗
                </Link>
              </div>
            </div>

            {/* Right Column: Solutions Photo */}
            <div className="lg:col-span-6 relative pb-6 lg:pb-0">
              <div className="relative h-[320px] sm:h-[440px] md:h-[480px] w-full overflow-hidden rounded-[24px] sm:rounded-[30px] border border-line/70 shadow-sm group">
                <Image
                  src={data.storyImage || "/images/about/solutions.jpg"}
                  alt="Certified home repair technician inspecting digital blueprints and work order specifications"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: WHY CHOOSE US (Global Design System Typography)                */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-surface/50 border-b border-line/60">
        <div className="container-site">
          {/* Header Row: Title on Left, Description on Right */}
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 font-geist text-[13.5px] sm:text-[14px] font-medium tracking-tight text-title">
                <span
                  aria-hidden="true"
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-primary"
                />
                <span>{data.whyChooseEyebrow || "Why Choose LocalHomeFix"}</span>
              </div>
              <h2 className="mt-3.5 font-geist text-[30px] sm:text-[38px] md:text-[42px] font-medium leading-[1.14] tracking-[-1.5px] sm:tracking-[-2px] !text-black">
                {data.whyChooseHeading || "Why Choose LocalHomeFix for Your Home Repairs"}
              </h2>
            </div>
            <div className="md:col-span-5 md:pb-1">
              <p className="font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[16px] leading-[1.65] text-[#757575]">
                {data.whyChooseSubtitle}
              </p>
            </div>
          </div>

          {/* 2-Column Body: Left Image Box + Right 3 Numbered Feature Cards */}
          <div className="mt-10 sm:mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Column: Craftsman Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-[340px] sm:h-[440px] md:h-[480px] w-full overflow-hidden rounded-[24px] sm:rounded-[30px] border border-line/80 shadow-sm group">
                <Image
                  src={data.craftsmanImage || "/images/about/craftsman.jpg"}
                  alt="Austin master craftsman repairing residential woodwork and fixtures"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </div>

            {/* Right Column: 3 Numbered Feature Items */}
            <div className="lg:col-span-7 flex flex-col divide-y divide-line/70">
              {data.pillars.map((feature, idx) => {
                const IconComponent = getPillarIcon(feature.iconName);
                const numberStr = String(idx + 1).padStart(2, "0");
                return (
                  <div
                    key={feature.id || numberStr}
                    className={cn(
                      "flex items-start gap-4 sm:gap-5",
                      idx === 0 ? "pb-6 sm:pb-7" : idx === data.pillars.length - 1 ? "pt-6 sm:pt-7" : "py-6 sm:py-7",
                    )}
                  >
                    {/* Number Badge */}
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="font-geist text-[14px] sm:text-[15px] font-semibold">{numberStr}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-primary shrink-0" />
                        <h3 className="font-geist text-[17px] sm:text-[18px] font-medium text-title tracking-tight">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="mt-1.5 font-['Inter_Display',Inter,sans-serif] text-[14px] sm:text-[15px] leading-[1.6] text-[#666]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: CALL TO ACTION (Global Design System Typography)               */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-title text-white relative overflow-hidden">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

        <div className="container-site relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 font-geist text-[13px] font-medium tracking-tight text-white/90">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border-[1.75px] border-white"
            />
            <span>{data.ctaEyebrow || "Ready to get started?"}</span>
          </div>
          <h2 className="mt-3.5 font-geist text-[24px] sm:text-[30px] md:text-[36px] lg:text-[42px] font-medium leading-[1.15] tracking-[-1px] sm:tracking-[-1.5px] text-white whitespace-normal sm:whitespace-nowrap">
            {data.ctaHeading || "Experience Stress-Free Home Repairs Today"}
          </h2>
          <p className="mt-3.5 font-['Inter_Display',Inter,sans-serif] text-[15px] sm:text-[17px] leading-relaxed text-white/85 max-w-xl mx-auto">
            {data.ctaDescription || "Post your project in under 2 minutes, get quotes from verified Austin contractors, and keep full control over your home."}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-xs sm:max-w-none mx-auto">
            <Button href={postJobHref(user)} size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white">
              {data.ctaPrimaryText || "Post a Job for Free ↗"}
            </Button>
            <Button
              href="/login?role=pro"
              variant="onDark"
              size="lg"
              className="w-full sm:w-auto"
            >
              {data.ctaSecondaryText || "Join as a Contractor ↗"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

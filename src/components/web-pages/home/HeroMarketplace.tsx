"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Star,
  Users,
  Lock,
  Sparkles,
} from "lucide-react";

interface HeroMarketplaceProps {
  popularCategories?: Array<{ name: string; slug: string }>;
}

export function HeroMarketplace({
  popularCategories = [],
}: HeroMarketplaceProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append("q", searchTerm.trim());
    if (location.trim()) params.append("location", location.trim());
    router.push(`/browse-pros?${params.toString()}`);
  };

  const defaultPopular = [
    { name: "Plumbing", slug: "plumbing" },
    { name: "Electrical", slug: "electrical" },
    { name: "House Cleaning", slug: "house-cleaning" },
    { name: "Painting", slug: "painting" },
    { name: "Carpentry", slug: "carpentry" },
    { name: "Appliance Repair", slug: "appliance-repair" },
  ];

  const chips =
    popularCategories.length > 0
      ? popularCategories.slice(0, 6)
      : defaultPopular;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-8 pb-16 sm:pt-14  sm:pb-24 border-b border-slate-200/70">
      {/* Background Subtle Gradient Blobs */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-32 h-80 w-80 rounded-full bg-[#00A1DE]/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Nutsumo Escrow Guarantee: 100% Protected Milestones</span>
            <span className="hidden sm:inline-block text-slate-300">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" /> 0% Hidden Client Fees
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-title tracking-tight leading-[1.12]">
            Find the Right Professional for Any Job with{" "}
            <span className="text-primary underline decoration-primary/20 decoration-wavy underline-offset-4">
              Escrow Protection
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-copy max-w-2xl mx-auto leading-relaxed font-sans">
            Connect with top-rated local professionals. Request custom quotes,
            review transparent pricing, and release funds only after the work is
            delivered to your exact satisfaction.
          </p>

          {/* Hero Interactive Search Box */}
          <div className="pt-3 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="rounded-2xl sm:rounded-full bg-white p-2.5 sm:p-2 border border-slate-200 shadow-[0_12px_40px_-15px_rgba(13,86,214,0.12)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1"
            >
              {/* Search Query Input */}
              <div className="flex-1 flex items-center gap-3 pl-3 sm:pl-4 py-2 sm:py-0">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What service do you need? (e.g. Plumber, Cleaner)"
                  className="w-full bg-transparent text-sm font-medium text-title placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-7 w-px bg-slate-200 shrink-0" />

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-3 pl-3 sm:pl-3 py-2 sm:py-0">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or Postcode (e.g. Accra, 10001)"
                  className="w-full bg-transparent text-sm font-medium text-title placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-primary hover:bg-primary-hover text-white px-7 py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.99] cursor-pointer shrink-0"
              >
                <span>Find Pros</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Popular Category Chips */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-muted font-semibold">Popular:</span>
            {chips.map((cat: any) => (
              <Link
                key={cat._id || cat.slug}
                href={`/categories/${cat._id || cat.slug}`}
                className="rounded-full bg-white border border-slate-200/90 px-3 py-1 text-copy font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all shadow-2xs"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Live Marketplace Trust Highlights Grid */}
        <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-10 border-t border-slate-200/70">
          <div className="rounded-2xl bg-white/90 p-4 sm:p-5 border border-slate-200/80 shadow-2xs text-center space-y-1">
            <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary mb-1">
              <Users className="h-5 w-5" />
            </div>
            <strong className="block font-display text-xl sm:text-2xl font-bold text-title">
              2,500+
            </strong>
            <span className="text-xs text-muted block font-medium">
              Screened &amp; Verified Pros
            </span>
          </div>

          <div className="rounded-2xl bg-white/90 p-4 sm:p-5 border border-slate-200/80 shadow-2xs text-center space-y-1">
            <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-1">
              <Lock className="h-5 w-5" />
            </div>
            <strong className="block font-display text-xl sm:text-2xl font-bold text-title">
              100% Escrow
            </strong>
            <span className="text-xs text-muted block font-medium">
              Safe Milestone Payments
            </span>
          </div>

          <div className="rounded-2xl bg-white/90 p-4 sm:p-5 border border-slate-200/80 shadow-2xs text-center space-y-1">
            <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 mb-1">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
            <strong className="block font-display text-xl sm:text-2xl font-bold text-title">
              4.9 / 5.0
            </strong>
            <span className="text-xs text-muted block font-medium">
              Verified Client Satisfaction
            </span>
          </div>

          <div className="rounded-2xl bg-white/90 p-4 sm:p-5 border border-slate-200/80 shadow-2xs text-center space-y-1">
            <div className="inline-grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 mb-1">
              <Sparkles className="h-5 w-5" />
            </div>
            <strong className="block font-display text-xl sm:text-2xl font-bold text-title">
              20% Statutory
            </strong>
            <span className="text-xs text-muted block font-medium">
              Transparent Ghana Levies
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

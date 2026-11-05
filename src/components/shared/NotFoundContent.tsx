"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Compass,
  FileQuestion,
  HelpCircle,
  Home,
  PlusCircle,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export function NotFoundContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?searchTerm=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/jobs");
    }
  };

  const quickLinks = [
    {
      title: "Browse Available Jobs",
      description: "Explore active requests and submit quotes to homeowners.",
      href: "/jobs",
      icon: Briefcase,
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      title: "Post a Service Request",
      description: "Need repair or renovation? Get quotes from verified pros.",
      href: "/account/post-job",
      icon: PlusCircle,
      color: "bg-rose-50 text-[#FE375D] border-rose-100",
    },
    {
      title: "Explore All Services",
      description: "Browse plumbing, electrical, carpentry, HVAC & more.",
      href: "/services",
      icon: Wrench,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Help & FAQs",
      description: "Learn how Nutsumo escrow, verified badges & guarantees work.",
      href: "/faq",
      icon: HelpCircle,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 overflow-hidden">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#FE375D]/10 via-[#FE375D]/5 to-transparent blur-3xl rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-10 w-[400px] h-[250px] bg-blue-500/5 blur-3xl rounded-full"
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-8">
        {/* TOP STATUS BADGE */}
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/90 backdrop-blur-xs px-4 py-1.5 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FE375D] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FE375D]" />
          </span>
          <span className="text-xs font-bold text-title uppercase tracking-wider">
            Error 404 · Page Not Found
          </span>
        </div>

        {/* HERO 404 TYPOGRAPHY */}
        <div className="relative">
          <h1 className="font-display text-8xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FE375D] via-[#ff5376] to-[#e0284e] select-none drop-shadow-xs">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
            <Compass className="h-44 w-44 text-slate-900" />
          </div>
        </div>

        {/* HEADLINE & EXPLANATION */}
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-title tracking-tight">
            Oops! This project took an unexpected turn
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable. Don&apos;t worry — our marketplace of verified artisans is ready to assist you.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-md mx-auto">
          <form
            onSubmit={handleSearch}
            className="relative flex items-center rounded-full border border-line bg-white shadow-sm hover:border-[#FE375D]/40 focus-within:border-[#FE375D] focus-within:ring-2 focus-within:ring-[#FE375D]/15 transition-all p-1.5"
          >
            <div className="grid h-9 w-9 place-items-center text-muted pl-2">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs or services (e.g. plumbing, electrical)..."
              className="w-full bg-transparent px-3 text-xs sm:text-sm text-title placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2 text-xs font-bold transition-all shadow-2xs hover:scale-[1.02] cursor-pointer shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* PRIMARY CTA BUTTONS */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Back to Homepage</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white hover:bg-slate-50 px-6 py-3 text-xs sm:text-sm font-bold text-title hover:border-title transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 text-muted" />
            <span>Go Back</span>
          </button>
        </div>

        {/* HELPFUL QUICK DESTINATIONS */}
        <div className="pt-6 border-t border-line/60">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-4">
            Helpful Destinations on Nutsumo
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-line/70 bg-white p-4 shadow-2xs hover:border-[#FE375D]/40 hover:shadow-md transition-all duration-200 flex items-start gap-3.5"
                >
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${item.color} group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-display text-sm font-bold text-title group-hover:text-[#FE375D] transition-colors truncate">
                        {item.title}
                      </h3>
                      <ArrowRight className="h-3.5 w-3.5 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight, ShieldCheck, Star, Users } from "lucide-react";

interface HeroMarketplaceProps {
  popularCategories?: Array<{ name: string; slug: string }>;
}

const DEFAULT_POPULAR = [
  { name: "Chef", slug: "chef" },
  { name: "Driver", slug: "driver" },
  { name: "Nanny", slug: "nanny" },
  { name: "Electrician", slug: "electrician" },
  { name: "Plumber", slug: "plumber" },
];

export function HeroMarketplace({ popularCategories = [] }: HeroMarketplaceProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Respect users who prefer reduced motion: keep the poster frame instead.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) video.pause();
    else video.play().catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchTerm.trim();
    router.push(q ? `/browse-pros?q=${encodeURIComponent(q)}` : "/browse-pros");
  };

  const chips = popularCategories.length > 0 ? popularCategories.slice(0, 5) : DEFAULT_POPULAR;

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-[#0a0708] min-h-[640px] sm:min-h-[720px] flex items-center"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src="/videos/hero.mp4"
        poster="/videos/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      {/* Readability wash */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/85 via-black/60 to-black/25" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-black/60 to-transparent" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-36 sm:pb-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-[40px] leading-[1.08] sm:text-6xl sm:leading-[1.05] font-semibold text-white! tracking-tight">
            Our verified pros will{" "}
            <span className="text-primary">take it from here</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-white/80 max-w-xl">
            Chefs, drivers, nannies, tradespeople, office and creative talent 
            hire with confidence and pay only when the job is done.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex items-stretch rounded-xl bg-white p-1 shadow-2xl max-w-xl"
            role="search"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search for any service
            </label>
            <input
              id="hero-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for any service…"
              className="min-w-0 flex-1 bg-transparent px-4 text-base text-title placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          {/* Popular chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {chips.map((cat) => (
              <Link
                key={cat.slug}
                href={`/browse-pros?q=${encodeURIComponent(cat.name)}`}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-white/40 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white hover:text-title! transition-colors"
              >
                {cat.name}
                <ArrowRight className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-14 sm:mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/70">
          <span className="font-semibold text-white/50">Trusted for:</span>
          <span className="inline-flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> 2,500+ verified pros
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> 100% escrow-protected payments
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="h-4 w-4 fill-primary text-primary" /> 4.9/5 client satisfaction
          </span>
        </div>
      </div>
    </section>
  );
}

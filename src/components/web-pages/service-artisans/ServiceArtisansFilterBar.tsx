"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  X,
  Loader2,
  Clock,
} from "lucide-react";

interface ServiceArtisansFilterBarProps {
  initialSearch?: string;
  initialLocation?: string;
  initialSort?: string;
  initialAvailability?: string;
  initialRating?: string;
  totalFound: number;
}

export function ServiceArtisansFilterBar({
  initialSearch = "",
  initialLocation = "",
  initialSort = "-rating",
  initialAvailability = "all",
  initialRating = "all",
  totalFound = 0,
}: ServiceArtisansFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const applyFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    params.delete("page"); // Reset to page 1 on filter change

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ searchTerm: search.trim(), location: location.trim() });
  };

  const currentAvailability = searchParams.get("availability") || initialAvailability;
  const currentRating = searchParams.get("rating") || initialRating;
  const currentSort = searchParams.get("sort") || initialSort;

  const hasActiveFilters = Boolean(
    searchParams.get("searchTerm") ||
    searchParams.get("location") ||
    searchParams.get("availability") ||
    searchParams.get("rating") ||
    searchParams.get("sort")
  );

  const handleReset = () => {
    setSearch("");
    setLocation("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4">
      {/* 1. TOP BAR: Search & Location Form */}
      <form
        onSubmit={handleSearchSubmit}
        className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
      >
        {/* Keyword Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by artisan or business name..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Location / Area Search */}
        <div className="md:col-span-4 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, neighborhood, or postcode (e.g. Accra, Osu)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Search Submit Button */}
        <div className="md:col-span-3 flex items-center gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white py-3 px-5 text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Apply Filters</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              title="Reset all filters"
              className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* 2. BOTTOM BAR: Filter Chips & Server Sorting */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Availability Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-muted text-[11px] uppercase tracking-wider font-display mr-1">
            Status:
          </span>

          <button
            type="button"
            onClick={() => applyFilters({ availability: "all" })}
            className={`px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              currentAvailability === "all"
                ? "bg-title text-white shadow-2xs"
                : "bg-slate-100 text-muted hover:text-title"
            }`}
          >
            All Artisans
          </button>

          <button
            type="button"
            onClick={() => applyFilters({ availability: "Available" })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              currentAvailability === "Available"
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for Hire</span>
          </button>
        </div>

        {/* Right Side: Rating & Server Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Rating Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-muted text-[11px] uppercase tracking-wider font-display">
              Rating:
            </span>
            <select
              value={currentRating}
              onChange={(e) => applyFilters({ rating: e.target.value })}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-title focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">Any Rating</option>
              <option value="4.5">4.5 ★ & Above</option>
              <option value="4.0">4.0 ★ & Above</option>
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-muted text-[11px] uppercase tracking-wider font-display">
              Sort:
            </span>
            <select
              value={currentSort}
              onChange={(e) => applyFilters({ sort: e.target.value })}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-title focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="-rating">Top Rated ★</option>
              <option value="-completedJobs">Most Completed Jobs</option>
              <option value="hourlyRate">Starting Rate: Low to High</option>
              <option value="-hourlyRate">Starting Rate: High to Low</option>
            </select>
          </div>

          <span className="text-[11px] font-bold text-muted bg-slate-100 px-2.5 py-1 rounded-full">
            {totalFound} {totalFound === 1 ? "Artisan" : "Artisans"} Available
          </span>
        </div>
      </div>
    </div>
  );
}


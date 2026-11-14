"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Filter,
  DollarSign,
  Briefcase,
  X,
  SlidersHorizontal,
  Sparkles,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  IArtisanProfileItem,
  ICategoryItem,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { DirectQuoteModal } from "@/components/web-pages/DirectQuoteModal";

interface BrowseProsClientProps {
  artisans: IArtisanProfileItem[];
  categories: ICategoryItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  } | null;
  filterParams: {
    searchTerm?: string;
    category?: string;
    trade?: string;
    location?: string;
    availabilityStatus?: string;
    sort?: string;
    rating?: string;
    page?: number;
  };
}

export function BrowseProsClient({
  artisans,
  categories,
  pagination,
  filterParams,
}: BrowseProsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local form inputs
  const [searchTerm, setSearchTerm] = useState(filterParams.searchTerm || "");
  const [location, setLocation] = useState(filterParams.location || "");

  // Direct Quote Modal State
  const [quoteTargetArtisan, setQuoteTargetArtisan] =
    useState<IArtisanProfileItem | null>(null);

  // Server Filter Updater
  const updateServerFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 unless pagination is being changed
    if (!("page" in updates)) {
      params.delete("page");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateServerFilters({
      searchTerm: searchTerm.trim(),
      location: location.trim(),
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setLocation("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const currentAvailability =
    searchParams.get("availabilityStatus") ||
    filterParams.availabilityStatus ||
    "all";
  const currentSort = searchParams.get("sort") || filterParams.sort || "-rating";
  const currentRating = searchParams.get("rating") || filterParams.rating || "all";

  const hasActiveFilters = Boolean(
    searchParams.get("searchTerm") ||
    searchParams.get("trade") ||
    searchParams.get("category") ||
    searchParams.get("location") ||
    searchParams.get("availabilityStatus") ||
    searchParams.get("rating") ||
    searchParams.get("sort")
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* 1. FILTER & SEARCH CONTROL BAR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-title font-bold text-sm sm:text-base">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Search &amp; Filter Verified Professionals</span>
            {isPending && <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Search & Location Bar */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, trade or skill..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-3 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, region, or postcode..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-3 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-xs cursor-pointer transition-all disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span>Find Professionals</span>
            </button>
          </div>
        </form>

        {/* Dropdown Filters (Category, Availability, Rating, Sort) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted uppercase font-display block">
              Trade Category
            </label>
            <select
              value={searchParams.get("category") || filterParams.category || ""}
              onChange={(e) =>
                updateServerFilters({
                  category: e.target.value,
                  trade: null,
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-title focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="">All Trade Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted uppercase font-display block">
              Availability
            </label>
            <select
              value={currentAvailability}
              onChange={(e) => updateServerFilters({ availabilityStatus: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-title focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">All Professionals</option>
              <option value="Available">🟢 Available Now</option>
              <option value="Booked">🟡 Currently Booked</option>
            </select>
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted uppercase font-display block">
              Minimum Rating
            </label>
            <select
              value={currentRating}
              onChange={(e) => updateServerFilters({ rating: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-title focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">Any Star Rating</option>
              <option value="4.5">4.5 ★ &amp; Above</option>
              <option value="4.0">4.0 ★ &amp; Above</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-muted uppercase font-display block">
              Sort By
            </label>
            <select
              value={currentSort}
              onChange={(e) => updateServerFilters({ sort: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-title focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="-rating">Highest Rated ★</option>
              <option value="-completedJobs">Most Completed Jobs</option>
              <option value="hourlyRate">Starting Rate: Low to High</option>
              <option value="-hourlyRate">Starting Rate: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. RESULTS SUMMARY HEADER */}
      <div className="flex items-center justify-between pb-2">
        <div className="text-xs sm:text-sm text-muted">
          Showing <strong className="text-title font-bold">{artisans.length}</strong> verified{" "}
          {artisans.length === 1 ? "artisan" : "artisans"} in Ghana
        </div>

        <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          <span>100% Escrow Protected Direct Contracts</span>
        </div>
      </div>

      {/* 3. ARTISANS GRID */}
      {artisans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Search className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-display text-base font-bold text-title">
              No Professionals Found
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              We couldn't find any artisans matching your exact filters. Try broadening your search or resetting filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-white px-5 py-2 text-xs font-bold shadow-xs cursor-pointer"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisans.map((artisan) => {
            const user = artisan.user || ({} as any);
            const avatarUrl = user.image ? getImageUrl(user.image) : null;
            const displayName =
              artisan.businessName || user.name || "Master Artisan";
            const trade = artisan.trade || "Craftsman";
            const locationText =
              artisan.location || artisan.city || user.location || "Location not set";
            const isAvailable =
              artisan.availability !== "BOOKED" &&
              artisan.availabilityStatus?.toLowerCase() !== "booked";

            const reviewsCount = artisan.reviewsCount || 0;
            const rating =
              reviewsCount > 0 ? Number(artisan.rating || 0).toFixed(1) : "New";
            const completedJobs = artisan.completedJobs || 0;
            const matched = artisan.matchedOffering;
            const price = matched || artisan.startingOffer;
            const rateAmount =
              price?.rateAmount || artisan.startingRate || artisan.hourlyRate || 0;
            const rateSuffix =
              String(price?.rateType || "").toUpperCase() === "DAILY" ? "/ day" : "/ hr";

            const initials = (user.name || displayName || "A")
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((w: string) => w[0]?.toUpperCase())
              .join("");

            const profileHref = `/job-seeker/${user._id || artisan._id}`;

            return (
              <div
                key={artisan._id}
                className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Header: Avatar, Name, Trade */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={displayName}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center bg-primary/10 text-primary font-bold text-lg font-display">
                            {initials}
                          </div>
                        )}
                        {user.verified && (
                          <div
                            title="Verified Pro"
                            className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-white shadow-xs"
                          >
                            <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={profileHref}
                            className="font-display text-base font-bold text-title group-hover:text-primary transition-colors hover:underline"
                          >
                            {displayName}
                          </Link>
                          {user.verified && (
                            <span className="text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-primary rounded-md bg-primary/10 px-2 py-0.5 text-[11px]">
                            {matched?.name || trade}
                          </span>

                          {isAvailable ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Booked
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-muted block tracking-wider">
                        Starting At
                      </span>
                      <div className="font-display text-lg font-black text-title">
                        {rateAmount ? `GH₵ ${rateAmount}` : "Quote"}
                        {rateAmount ? (
                          <span className="text-xs font-normal text-muted ml-0.5">
                            {rateSuffix}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {artisan.bio ? (
                    <p className="text-xs text-copy line-clamp-2 leading-relaxed">
                      {artisan.bio}
                    </p>
                  ) : null}

                  {/* Metrics */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-muted border-t border-slate-100">
                    <div className="flex items-center gap-1 font-bold text-title">
                      <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                      <span>{rating}</span>
                      {reviewsCount > 0 ? (
                        <span className="text-muted font-normal text-[11px]">
                          ({reviewsCount})
                        </span>
                      ) : null}
                    </div>

                    <span>•</span>

                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{completedJobs} completed</span>
                    </div>

                    <span>•</span>

                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="line-clamp-1">{locationText}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
                  <Link
                    href={profileHref}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-title py-2.5 text-xs font-bold transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setQuoteTargetArtisan(artisan)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary hover:bg-primary-hover text-white py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer transform active:scale-95"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Request Quote</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. SERVER PAGINATION CONTROLS */}
      {pagination && pagination.totalPage > 1 && (
        <div className="pt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1 || isPending}
            onClick={() => updateServerFilters({ page: String(pagination.page - 1) })}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-title disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-semibold text-muted px-3">
            Page {pagination.page} of {pagination.totalPage}
          </span>

          <button
            type="button"
            disabled={pagination.page >= pagination.totalPage || isPending}
            onClick={() => updateServerFilters({ page: String(pagination.page + 1) })}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-title disabled:opacity-40 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 5. DIRECT CUSTOM QUOTE MODAL */}
      {quoteTargetArtisan && (
        <DirectQuoteModal
          isOpen={Boolean(quoteTargetArtisan)}
          onClose={() => setQuoteTargetArtisan(null)}
          artisan={{
            _id: quoteTargetArtisan._id,
            user: quoteTargetArtisan.user,
            trade: quoteTargetArtisan.trade,
            businessName: quoteTargetArtisan.businessName,
            location:
              quoteTargetArtisan.location ||
              quoteTargetArtisan.city ||
              (quoteTargetArtisan.user as any)?.location,
          }}
          categories={categories}
        />
      )}
    </div>
  );
}

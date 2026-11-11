"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
} from "lucide-react";
import type {
  IArtisanProfileItem,
  ICategoryItem,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { DirectQuoteModal } from "@/components/web-pages/DirectQuoteModal";

interface BrowseProsClientProps {
  initialArtisans: IArtisanProfileItem[];
  categories: ICategoryItem[];
}

export function BrowseProsClient({
  initialArtisans,
  categories,
}: BrowseProsClientProps) {
  const searchParams = useSearchParams();

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || searchParams.get("trade") || ""
  );
  const [location, setLocation] = useState(
    searchParams.get("location") || searchParams.get("zip") || ""
  );
  const [availability, setAvailability] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [sortBy, setSortBy] = useState("highest_rated");

  // Direct Quote Modal State
  const [quoteTargetArtisan, setQuoteTargetArtisan] =
    useState<IArtisanProfileItem | null>(null);

  // Filtered & Sorted Artisans
  const filteredArtisans = useMemo(() => {
    return (initialArtisans || []).filter((artisan) => {
      const user = artisan.user || {};
      const name = (user.name || artisan.businessName || "").toLowerCase();
      const trade = (artisan.trade || user.trade || "").toLowerCase();
      const bio = (artisan.bio || "").toLowerCase();
      const loc = (artisan.location || user.location || "").toLowerCase();
      const postCode = (artisan.postCode || "").toLowerCase();

      // 1. Text Query Filter
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const matchesQuery =
          name.includes(query) ||
          trade.includes(query) ||
          bio.includes(query) ||
          loc.includes(query);
        if (!matchesQuery) return false;
      }

      // 2. Category / Trade Filter
      if (selectedCategory.trim()) {
        const catQ = selectedCategory.trim().toLowerCase();
        // check category slug or name
        const matchedCat = categories.find(
          (c) =>
            c.slug.toLowerCase() === catQ ||
            c._id === catQ ||
            c.name.toLowerCase() === catQ
        );
        const targetTrade = matchedCat ? matchedCat.name.toLowerCase() : catQ;
        const matchesCat = trade.includes(targetTrade) || targetTrade.includes(trade);
        if (!matchesCat) return false;
      }

      // 3. Location Filter
      if (location.trim()) {
        const locQ = location.trim().toLowerCase();
        const matchesLoc = loc.includes(locQ) || postCode.includes(locQ);
        if (!matchesLoc) return false;
      }

      // 4. Availability Filter
      if (availability !== "all") {
        if (availability === "available" && artisan.availabilityStatus === "Booked") {
          return false;
        }
        if (availability === "booked" && artisan.availabilityStatus !== "Booked") {
          return false;
        }
      }

      // 5. Min Rating Filter
      if (minRating !== "all") {
        const threshold = Number(minRating);
        const actualRating = Number(artisan.rating) || 5.0;
        if (actualRating < threshold) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "highest_rated") {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      if (sortBy === "most_jobs") {
        return (Number(b.completedJobs) || 0) - (Number(a.completedJobs) || 0);
      }
      if (sortBy === "price_low") {
        const priceA = a.startingRate || a.hourlyRate || 0;
        const priceB = b.startingRate || b.hourlyRate || 0;
        return priceA - priceB;
      }
      if (sortBy === "price_high") {
        const priceA = a.startingRate || a.hourlyRate || 0;
        const priceB = b.startingRate || b.hourlyRate || 0;
        return priceB - priceA;
      }
      return 0;
    });
  }, [
    initialArtisans,
    categories,
    searchTerm,
    selectedCategory,
    location,
    availability,
    minRating,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setLocation("");
    setAvailability("all");
    setMinRating("all");
    setSortBy("highest_rated");
  };

  const hasActiveFilters = Boolean(
    searchTerm || selectedCategory || location || availability !== "all" || minRating !== "all"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* 1. FILTER & SEARCH CONTROL BAR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm mb-10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-title font-bold text-sm sm:text-base">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Search &amp; Filter Professionals</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Search Query */}
          <div>
            <label className="block text-muted font-semibold mb-1">Keywords</label>
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Name, trade, skills..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-muted font-semibold mb-1">Specialty / Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug || c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location / Postcode */}
          <div>
            <label className="block text-muted font-semibold mb-1">City or Postcode</label>
            <div className="relative">
              <MapPin className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Accra, 10001"
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
              />
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-muted font-semibold mb-1">Sort Results</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
            >
              <option value="highest_rated">Highest Rated (★ 5.0)</option>
              <option value="most_jobs">Most Completed Jobs</option>
              <option value="price_low">Lowest Rate</option>
              <option value="price_high">Highest Rate</option>
            </select>
          </div>
        </div>

        {/* Secondary Pill Filters (Availability & Rating) */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted font-medium">Availability:</span>
            <button
              type="button"
              onClick={() => setAvailability("all")}
              className={`px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                availability === "all"
                  ? "bg-primary text-white border-primary font-bold"
                  : "bg-slate-50 text-title border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Status
            </button>
            <button
              type="button"
              onClick={() => setAvailability("available")}
              className={`px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                availability === "available"
                  ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                  : "bg-slate-50 text-title border-slate-200 hover:bg-slate-100"
              }`}
            >
              🟢 Available for Hire
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted font-medium">Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-title focus:outline-none"
            >
              <option value="all">Any Rating</option>
              <option value="4.5">★ 4.5 &amp; Up</option>
              <option value="4.0">★ 4.0 &amp; Up</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. RESULTS HEADER & COUNT */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-title">
            Available Verified Professionals
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Showing {filteredArtisans.length} vetted craftsmen ready for booking.
          </p>
        </div>
      </div>

      {/* 3. ARTISANS RESULT CARDS GRID */}
      {filteredArtisans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center space-y-3">
          <Briefcase className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="font-display text-lg font-bold text-title">
            No professionals found matching your filters
          </h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            Try adjusting your search query, selecting &ldquo;All Categories&rdquo;, or resetting your filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary text-white px-6 py-2.5 text-xs font-bold shadow-xs cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredArtisans.map((artisan) => {
            const user = artisan.user || {};
            const avatarUrl = user.image ? getImageUrl(user.image) : null;
            const displayName = user.name || artisan.businessName || "Verified Pro";
            const trade = artisan.trade || user.trade || "Trade Specialist";
            const loc = artisan.location || user.location || "Ghana";
            const rating = Number(artisan.rating) || 5.0;
            const reviewsCount = Number(artisan.reviewsCount) || 1;
            const completedJobs = Number(artisan.completedJobs) || 0;
            const rate = artisan.startingRate || artisan.hourlyRate || 35;
            const isAvailable = artisan.availabilityStatus !== "Booked";
            const profileUrl = `/browse-pros/${user._id || artisan._id}`;

            return (
              <div
                key={artisan._id}
                className="group rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Avatar & Availability */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-2xs">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={displayName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-primary/10 text-primary font-bold text-lg font-display">
                          {displayName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isAvailable ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      <span>{isAvailable ? "Available" : "Booked"}</span>
                    </span>
                  </div>

                  {/* Name & Trade */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-base sm:text-lg font-bold text-title group-hover:text-primary transition-colors line-clamp-1">
                        {displayName}
                      </h3>
                      {user.verified !== false && (
                        <span title="Verified Pro">
                          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-primary/90 line-clamp-1">
                      {trade}
                    </p>

                    <p className="flex items-center gap-1 text-xs text-muted pt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{loc}</span>
                    </p>
                  </div>

                  {/* Rating & Completed Jobs Strip */}
                  <div className="my-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-bold text-title">{rating.toFixed(1)}</span>
                      <span className="text-muted text-[11px]">({reviewsCount})</span>
                    </div>

                    <div className="flex items-center gap-1 text-right justify-end text-emerald-700 font-medium text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>{completedJobs > 0 ? `${completedJobs} jobs` : "Verified Pro"}</span>
                    </div>
                  </div>

                  {/* Starting Rate */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-xs mb-4">
                    <span className="text-muted">Starting Rate:</span>
                    <strong className="font-display font-bold text-title text-sm text-primary">
                      GH₵ {rate}
                      <span className="text-[10px] text-muted font-normal ml-0.5">/hr</span>
                    </strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Link
                    href={profileUrl}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white py-2.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>View 360° Profile</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setQuoteTargetArtisan(artisan)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-primary py-2 text-xs font-semibold text-title transition-colors cursor-pointer"
                  >
                    <span>Request Custom Quote</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DIRECT QUOTE MODAL */}
      {quoteTargetArtisan && (
        <DirectQuoteModal
          isOpen={Boolean(quoteTargetArtisan)}
          onClose={() => setQuoteTargetArtisan(null)}
          artisan={quoteTargetArtisan}
          categories={categories}
        />
      )}
    </div>
  );
}

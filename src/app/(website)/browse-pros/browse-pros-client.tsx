"use client";

import { useEffect, useState, useTransition } from "react";
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
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  Clock,
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

const availabilityOptions = [
  { value: "all", label: "Anyone" },
  { value: "Available", label: "Available" },
  { value: "Booked", label: "Booked" },
];

const ratingOptions = [
  { value: "all", label: "Any rating" },
  { value: "4", label: "4.0+" },
  { value: "4.5", label: "4.5+" },
];

const sortOptions = [
  { value: "-rating", label: "Top rated" },
  { value: "-completedJobs", label: "Most jobs" },
  { value: "hourlyRate", label: "Price: low" },
  { value: "-hourlyRate", label: "Price: high" },
];

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
  const [searchTerm, setSearchTerm] = useState(filterParams.searchTerm || "");
  const [location, setLocation] = useState(filterParams.location || "");
  const [quoteTargetArtisan, setQuoteTargetArtisan] =
    useState<IArtisanProfileItem | null>(null);

  useEffect(() => {
    setSearchTerm(filterParams.searchTerm || "");
    setLocation(filterParams.location || "");
  }, [filterParams.searchTerm, filterParams.location]);

  const updateServerFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    if (!("page" in updates)) params.delete("page");
    if ("searchTerm" in updates) params.delete("q");

    startTransition(() => {
      router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
    });
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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

  const appliedQuery = searchParams.get("searchTerm") || searchParams.get("q") || "";
  const appliedLocation = searchParams.get("location") || searchParams.get("zip") || "";
  const appliedCategory = searchParams.get("category") || filterParams.category || "";
  const appliedTrade = searchParams.get("trade") || "";
  const currentAvailability =
    searchParams.get("availabilityStatus") || filterParams.availabilityStatus || "all";
  const currentSort = searchParams.get("sort") || filterParams.sort || "-rating";
  const currentRating = searchParams.get("rating") || filterParams.rating || "all";
  const categoryName = categories.find((item) => item._id === appliedCategory)?.name;
  const total = pagination?.total ?? artisans.length;

  const chips = [
    appliedQuery ? { key: "searchTerm", label: appliedQuery } : null,
    appliedLocation ? { key: "location", label: appliedLocation } : null,
    categoryName ? { key: "category", label: categoryName } : null,
    appliedTrade ? { key: "trade", label: appliedTrade } : null,
    currentAvailability !== "all"
      ? { key: "availabilityStatus", label: currentAvailability }
      : null,
    currentRating !== "all" ? { key: "rating", label: `${currentRating}+ stars` } : null,
    currentSort !== "-rating"
      ? {
          key: "sort",
          label: sortOptions.find((item) => item.value === currentSort)?.label || "Sorted",
        }
      : null,
  ].filter((chip): chip is { key: string; label: string } => Boolean(chip));

  const clearChip = (key: string) => {
    if (key === "searchTerm") setSearchTerm("");
    if (key === "location") setLocation("");
    updateServerFilters({
      [key]: null,
      ...(key === "searchTerm" ? { q: null } : {}),
      ...(key === "location" ? { zip: null } : {}),
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <form
        onSubmit={handleSearchSubmit}
        className="rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.45)] sm:p-4"
      >
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try plumbing, garden, cleaning…"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-title outline-none transition focus:border-primary focus:bg-white"
            />
            {searchTerm ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => clearChip("searchTerm")}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-title"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <label className="relative min-w-0 lg:w-72">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City or postcode"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-title outline-none transition focus:border-primary focus:bg-white"
            />
            {location ? (
              <button
                type="button"
                aria-label="Clear location"
                onClick={() => clearChip("location")}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-title"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <FilterPill
            active={!appliedCategory}
            onClick={() => updateServerFilters({ category: null, trade: null })}
          >
            All trades
          </FilterPill>
          {categories.map((category) => (
            <FilterPill
              key={category._id}
              active={appliedCategory === category._id}
              onClick={() =>
                updateServerFilters({
                  category: appliedCategory === category._id ? null : category._id,
                  trade: null,
                })
              }
            >
              {category.name}
            </FilterPill>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {availabilityOptions.map((option) => (
              <FilterPill
                key={option.value}
                active={currentAvailability === option.value}
                onClick={() => updateServerFilters({ availabilityStatus: option.value })}
              >
                {option.label}
              </FilterPill>
            ))}
            <span className="mx-1 hidden h-4 w-px bg-slate-200 sm:block" />
            {ratingOptions.map((option) => (
              <FilterPill
                key={option.value}
                active={currentRating === option.value}
                onClick={() => updateServerFilters({ rating: option.value })}
              >
                {option.label}
              </FilterPill>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted">
            Sort
            <select
              value={currentSort}
              onChange={(event) => updateServerFilters({ sort: event.target.value })}
              className="h-9 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-title outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {chips.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={`${chip.key}-${chip.label}`}
                type="button"
                onClick={() => clearChip(chip.key)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1f3] px-3 py-1.5 text-xs font-semibold text-[#d4234c]"
              >
                {chip.label}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-title hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : null}
      </form>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold tracking-tight text-title">
            {total} {total === 1 ? "professional" : "professionals"}
          </p>
          <p className="mt-1 text-sm text-muted">
            Compare a rate, open the profile, or ask for a quote. Payment stays in escrow.
          </p>
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Escrow protected
        </p>
      </div>

      {artisans.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#fff1f3] text-[#d4234c]">
            <Search className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold text-title">No one matches this search</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Try a service name, a city, or clear a filter. Professionals appear when they offer that work.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {artisans.map((artisan) => (
            <ArtisanCard
              key={artisan._id}
              artisan={artisan}
              onQuote={() => setQuoteTargetArtisan(artisan)}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPage > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1 || isPending}
            onClick={() => updateServerFilters({ page: String(pagination.page - 1) })}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-title disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="px-3 text-sm text-muted">
            {pagination.page} / {pagination.totalPage}
          </span>
          <button
            type="button"
            disabled={pagination.page >= pagination.totalPage || isPending}
            onClick={() => updateServerFilters({ page: String(pagination.page + 1) })}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-title disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {quoteTargetArtisan ? (
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
              quoteTargetArtisan.user?.location,
          }}
          categories={categories}
        />
      ) : null}
    </div>
  );
}

function replyLabel(minutes: number) {
  if (minutes < 60) return `${Math.max(1, Math.round(minutes))}m reply`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h reply`;
  return `${Math.max(1, Math.round(minutes / (60 * 24)))}d reply`;
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-title text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-title"
      }`}
    >
      {children}
    </button>
  );
}

function ArtisanCard({
  artisan,
  onQuote,
}: {
  artisan: IArtisanProfileItem;
  onQuote: () => void;
}) {
  const user = artisan.user;
  const avatarUrl = user?.image ? getImageUrl(user.image) : null;
  const displayName = artisan.businessName || user?.name || "Professional";
  const trade = artisan.trade || user?.trade || "Trade";
  const locationText = artisan.location || artisan.city || user?.location || "Location not set";
  const isAvailable = artisan.availabilityStatus?.toLowerCase() !== "booked";
  const reviewsCount = artisan.reviewsCount || 0;
  const matched = artisan.matchedOffering;
  const price = matched?.rateAmount ? matched : artisan.startingOffer;
  const rateAmount = price?.rateAmount || artisan.startingRate || artisan.hourlyRate || 0;
  const rateSuffix = String(price?.rateType || "").toUpperCase() === "DAILY" ? "/ day" : "/ hr";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const profileHref = `/job-seeker/${user?._id || artisan._id}`;
  const showReply = (artisan.responseSamples || 0) >= 3 && artisan.responseTimeMinutes;

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.5)] transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_40px_-24px_rgba(254,55,93,0.45)]">
      <div className="flex items-start gap-3">
        <Link href={profileHref} className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt=""
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="grid h-full w-full place-items-center font-display text-lg font-bold text-[#d4234c]">
              {initials || "P"}
            </span>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={profileHref} className="flex items-center gap-1.5">
                <h2 className="truncate font-display text-lg font-bold tracking-tight text-title">
                  {displayName}
                </h2>
                {user?.verified ? (
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
                ) : null}
              </Link>
              <p className="mt-0.5 truncate text-sm text-muted">{matched?.name || trade}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">From</p>
              <p className="font-display text-lg font-bold leading-none text-title">
                {rateAmount ? `GH₵ ${rateAmount}` : "Quote"}
              </p>
              {rateAmount ? <p className="mt-1 text-[11px] text-muted">{rateSuffix}</p> : null}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-amber-500"}`} />
              {isAvailable ? "Available" : "Booked"}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <MapPin className="h-3 w-3" />
              <span className="max-w-[140px] truncate">{locationText}</span>
            </span>
          </div>
        </div>
      </div>

      {artisan.bio ? (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{artisan.bio}</p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1 font-semibold text-title">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {reviewsCount > 0 ? Number(artisan.rating || 0).toFixed(1) : "New"}
          {reviewsCount > 0 ? <span className="font-normal text-muted">({reviewsCount})</span> : null}
        </span>
        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          {artisan.completedJobs || 0} jobs
        </span>
        {showReply ? (
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {replyLabel(artisan.responseTimeMinutes || 0)}
          </span>
        ) : null}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <Link
          href={profileHref}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 text-sm font-semibold text-title transition hover:border-slate-300 hover:bg-slate-50"
        >
          Profile
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          onClick={onQuote}
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Request quote
        </button>
      </div>
    </article>
  );
}

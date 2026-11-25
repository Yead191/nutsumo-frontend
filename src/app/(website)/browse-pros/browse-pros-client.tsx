"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
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
  Check,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";
import {
  getServicesByCategory,
  type IArtisanProfileItem,
  type ICategoryItem,
  type IServiceItem,
} from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { DirectQuoteModal } from "@/components/web-pages/DirectQuoteModal";
import type { QuoteViewer } from "@/lib/quoteViewer";

interface BrowseProsClientProps {
  artisans: IArtisanProfileItem[];
  categories: ICategoryItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  } | null;
  viewer?: QuoteViewer | null;
  filterParams: {
    searchTerm?: string;
    category?: string;
    service?: string;
    serviceName?: string;
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
  viewer = null,
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
  const appliedService = searchParams.get("service") || filterParams.service || "";
  const serviceName = appliedService ? filterParams.serviceName || "Selected service" : "";
  const total = pagination?.total ?? artisans.length;

  const chips = [
    appliedQuery ? { key: "searchTerm", label: appliedQuery } : null,
    appliedLocation ? { key: "location", label: appliedLocation } : null,
    categoryName ? { key: "category", label: categoryName } : null,
    serviceName ? { key: "service", label: serviceName } : null,
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
      // A service belongs to its category, so removing the category drops the service too.
      ...(key === "category" ? { service: null } : {}),
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
              placeholder="Try chef, driver, nanny, electrician…"
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

        <CategoryFilter
          categories={categories}
          selectedId={appliedCategory}
          onSelect={(id) => updateServerFilters({ category: id, service: null, trade: null })}
          onSelectService={(categoryId, serviceId) =>
            updateServerFilters({ category: categoryId, service: serviceId, trade: null })
          }
          selectedServiceId={appliedService}
        />

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
          viewer={viewer}
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

const HOVER_OPEN_DELAY = 180;
const HOVER_CLOSE_DELAY = 150;

/**
 * Fiverr-style hover intent for category pills: waits briefly before opening
 * (so sweeping the mouse across pills doesn't flash panels), keeps the panel
 * open while the pointer moves into it, and lazily loads + caches each
 * category's services. Disabled on touch devices, where a tap just filters.
 */
function useCategoryHover() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, IServiceItem[]>>({});
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requested = useRef(new Set<string>());

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  useEffect(() => clearTimers, []);

  const load = useCallback((id: string) => {
    if (requested.current.has(id)) return;
    requested.current.add(id);
    setFailed((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    // Only cache real answers. A failed request (backend down, network error) must not be
    // remembered as "no services", otherwise the category looks empty until a full reload.
    const markFailed = () => {
      requested.current.delete(id);
      setFailed((prev) => new Set(prev).add(id));
    };

    getServicesByCategory(id)
      .then((res) => {
        if (!res?.success || !Array.isArray(res.data)) {
          markFailed();
          return;
        }
        const list = res.data;
        setCache((prev) => ({ ...prev, [id]: list }));
      })
      .catch(markFailed);
  }, []);

  const scheduleOpen = (id: string) => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover)").matches) return;
    clearTimers();
    load(id);
    // Already showing a panel → switch instantly; otherwise wait for hover intent.
    if (categoryId) {
      setCategoryId(id);
    } else {
      openTimer.current = setTimeout(() => setCategoryId(id), HOVER_OPEN_DELAY);
    }
  };

  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = null;
    closeTimer.current = setTimeout(() => setCategoryId(null), HOVER_CLOSE_DELAY);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const close = () => {
    clearTimers();
    setCategoryId(null);
  };

  return {
    categoryId,
    services: categoryId ? cache[categoryId] || [] : [],
    loading: Boolean(categoryId && !(categoryId in cache) && !failed.has(categoryId)),
    error: Boolean(categoryId && failed.has(categoryId)),
    servicesFor: (id: string) => cache[id] || [],
    isLoading: (id: string) => !(id in cache) && !failed.has(id),
    hasError: (id: string) => failed.has(id),
    load,
    scheduleOpen,
    scheduleClose,
    cancelClose,
    close,
  };
}

function ServicesLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
      Couldn’t load services right now.
      <button
        type="button"
        onClick={onRetry}
        className="font-semibold text-primary hover:underline"
      >
        Try again
      </button>
    </div>
  );
}

function FilterPill({
  active,
  highlighted = false,
  onClick,
  onMouseEnter,
  children,
}: {
  active: boolean;
  highlighted?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-title text-white"
          : highlighted
            ? "bg-slate-200 text-title"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-title"
      }`}
    >
      {children}
    </button>
  );
}

const VISIBLE_CATEGORY_COUNT = 8;

/**
 * One compact row of the most popular categories, plus a "More" toggle that
 * opens a searchable panel with every category. Keeps the filter bar short
 * no matter how many categories the backend returns.
 */
function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  onSelectService,
  selectedServiceId,
}: {
  categories: ICategoryItem[];
  selectedId: string;
  onSelect: (id: string | null) => void;
  onSelectService: (categoryId: string, serviceId: string) => void;
  selectedServiceId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const hover = useCategoryHover();

  // Categories arrive sorted by priority; pin the selected one to the front if it's hidden.
  const topCategories = categories.slice(0, VISIBLE_CATEGORY_COUNT);
  const selected = categories.find((item) => item._id === selectedId);
  const visible =
    selected && !topCategories.some((item) => item._id === selected._id)
      ? [selected, ...topCategories.slice(0, VISIBLE_CATEGORY_COUNT - 1)]
      : topCategories;
  const hiddenCount = categories.length - visible.length;

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? categories.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
    : categories;

  const choose = (id: string | null) => {
    onSelect(id);
    setOpen(false);
    setQuery("");
    hover.close();
  };

  const hoveredCategory = categories.find((item) => item._id === hover.categoryId);

  // "More" panel preview: hovered item, else the selected category, else the first match.
  const [previewId, setPreviewId] = useState<string | null>(null);
  const previewCategory =
    filtered.find((item) => item._id === previewId) ||
    filtered.find((item) => item._id === selectedId) ||
    filtered[0];
  const previewCategoryId = open ? previewCategory?._id : undefined;
  const loadServices = hover.load;
  useEffect(() => {
    if (previewCategoryId) loadServices(previewCategoryId);
  }, [previewCategoryId, loadServices]);

  return (
    <div className="relative mt-3">
      <div className="relative flex items-center gap-2">
        <div
          className="-mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 pb-0.5 scrollbar-none [&::-webkit-scrollbar]:hidden"
          onMouseLeave={hover.scheduleClose}
        >
          <FilterPill
            active={!selectedId}
            onMouseEnter={hover.scheduleClose}
            onClick={() => choose(null)}
          >
            All
          </FilterPill>
          {visible.map((category) => (
            <FilterPill
              key={category._id}
              active={selectedId === category._id}
              highlighted={hover.categoryId === category._id}
              onMouseEnter={() => {
                // The "More" panel already shows a services preview; don't stack a second panel on it.
                if (open) setPreviewId(category._id);
                else hover.scheduleOpen(category._id);
              }}
              onClick={() => choose(selectedId === category._id ? null : category._id)}
            >
              {category.name}
            </FilterPill>
          ))}
        </div>

        {hiddenCount > 0 ? (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => {
              hover.close();
              setPreviewId(null);
              setOpen((value) => !value);
            }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              open
                ? "border-title bg-title text-white"
                : "border-slate-200 bg-white text-title hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            {open ? "Close" : `More (${hiddenCount})`}
            <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
          </button>
        ) : null}

        {hoveredCategory ? (
          <div
            role="menu"
            aria-label={`${hoveredCategory.name} services`}
            onMouseEnter={hover.cancelClose}
            onMouseLeave={hover.scheduleClose}
            className="absolute inset-x-0 top-full z-30 pt-2"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_24px_48px_-20px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <p className="font-display text-sm font-bold text-title">{hoveredCategory.name}</p>
                <button
                  type="button"
                  onClick={() => choose(hoveredCategory._id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  All {hoveredCategory.name} pros
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {hover.error ? (
                <ServicesLoadError onRetry={() => hover.load(hoveredCategory._id)} />
              ) : hover.loading ? (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <span key={index} className="h-8 animate-pulse rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : hover.services.length > 0 ? (
                <div className="mt-2 grid max-h-64 grid-cols-2 gap-x-2 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">
                  {hover.services.map((service) => (
                    <button
                      key={service._id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onSelectService(hoveredCategory._id, service._id);
                        hover.close();
                      }}
                      className={`truncate rounded-lg px-2.5 py-2 text-left text-sm transition ${
                        selectedServiceId === service._id
                          ? "bg-[#fff1f3] font-semibold text-[#d4234c]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-title"
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">No services listed in this category yet.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {open ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                // Don't submit the outer search form; Enter picks the single match instead.
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (filtered.length === 1) choose(filtered[0]._id);
                }
                if (event.key === "Escape") setOpen(false);
              }}
              placeholder={`Search ${categories.length} categories…`}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-title outline-none transition focus:border-primary"
            />
          </label>

          {filtered.length > 0 ? (
            <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
              {/* Left: every category. Hovering one previews its services on the right. */}
              <div className="grid max-h-80 grid-cols-1 content-start gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((category) => {
                  const active = selectedId === category._id;
                  const previewing = previewCategory?._id === category._id;
                  return (
                    <button
                      key={category._id}
                      type="button"
                      onMouseEnter={() => setPreviewId(category._id)}
                      onFocus={() => setPreviewId(category._id)}
                      onClick={() => choose(active ? null : category._id)}
                      className={`flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${
                        active
                          ? "bg-title font-semibold text-white"
                          : previewing
                            ? "bg-white text-title shadow-sm"
                            : "text-slate-700 hover:bg-white hover:text-title"
                      }`}
                    >
                      <span className="truncate">{category.name}</span>
                      {active ? (
                        <Check className="h-4 w-4 shrink-0" />
                      ) : previewing ? (
                        <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-400 lg:block" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Right: services of the previewed category (desktop only — touch has no hover). */}
              {previewCategory ? (
                <div className="hidden max-h-80 flex-col rounded-xl border border-slate-200 bg-white p-3 lg:flex">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <p className="truncate font-display text-sm font-bold text-title">
                      {previewCategory.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => choose(previewCategory._id)}
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View all
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {hover.hasError(previewCategory._id) ? (
                    <ServicesLoadError onRetry={() => hover.load(previewCategory._id)} />
                  ) : hover.isLoading(previewCategory._id) ? (
                    <div className="mt-2 space-y-2">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <span key={index} className="block h-7 animate-pulse rounded-lg bg-slate-100" />
                      ))}
                    </div>
                  ) : hover.servicesFor(previewCategory._id).length > 0 ? (
                    <div className="mt-1 overflow-y-auto">
                      {hover.servicesFor(previewCategory._id).map((service) => (
                        <button
                          key={service._id}
                          type="button"
                          onClick={() => {
                            onSelectService(previewCategory._id, service._id);
                            setOpen(false);
                            setQuery("");
                          }}
                          className={`block w-full truncate rounded-lg px-2.5 py-1.5 text-left text-sm transition ${
                            selectedServiceId === service._id
                              ? "bg-[#fff1f3] font-semibold text-[#d4234c]"
                              : "text-slate-600 hover:bg-slate-50 hover:text-title"
                          }`}
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted">No services listed in this category yet.</p>
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 px-1 text-sm text-muted">No category matches “{query}”.</p>
          )}
        </div>
      ) : null}
    </div>
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

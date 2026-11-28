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
  ArrowRight,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ChevronDown,
  Home,
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
import { groupCategories } from "@/lib/category-groups";
import { categoryPhoto } from "@/lib/stock-photos";

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

  const heading =
    serviceName && serviceName !== "Selected service"
      ? serviceName
      : categoryName || (appliedQuery ? `Results for “${appliedQuery}”` : "Find verified professionals");

  return (
    <>
      <CategoryMegaNav
        categories={categories}
        selectedId={appliedCategory}
        selectedServiceId={appliedService}
        onSelectCategory={(id) => updateServerFilters({ category: id, service: null, trade: null })}
        onSelectService={(categoryId, serviceId) =>
          updateServerFilters({ category: categoryId, service: serviceId, trade: null })
        }
      />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm text-muted">
          <Link href="/" aria-label="Home" className="hover:text-title">
            <Home className="h-4 w-4" />
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/browse-pros" className="hover:text-title">
            Find Seekers
          </Link>
          {categoryName ? (
            <>
              <span aria-hidden="true">/</span>
              <span className="truncate font-medium text-title">{categoryName}</span>
            </>
          ) : null}
        </nav>

        {/* Title */}
        <div className="mt-4 max-w-3xl">
          <h1 className="font-display text-3xl font-semibold text-title sm:text-[40px]">{heading}</h1>
          <p className="mt-2 text-base text-copy">
            Hire verified workers and professionals across Ghana  compare rates, request a
            quote, and pay safely through escrow.
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          role="search"
          className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0 sm:rounded-xl sm:border sm:border-slate-300 sm:bg-white sm:p-1 sm:transition sm:focus-within:border-title"
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search services or skills</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try chef, driver, nanny, electrician…"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-10 text-[15px] text-title outline-none placeholder:text-slate-400 focus:border-title sm:h-11 sm:rounded-lg sm:border-0"
            />
            {searchTerm ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => clearChip("searchTerm")}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-title"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <span aria-hidden="true" className="my-2 hidden w-px bg-slate-200 sm:block" />

          <label className="relative min-w-0 sm:w-64">
            <span className="sr-only">City or postcode</span>
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="City or postcode"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-10 text-[15px] text-title outline-none placeholder:text-slate-400 focus:border-title sm:h-11 sm:rounded-lg sm:border-0"
            />
            {location ? (
              <button
                type="button"
                aria-label="Clear location"
                onClick={() => clearChip("location")}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-title"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60 sm:h-11 sm:rounded-lg cursor-pointer"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </form>

        {/* Dropdown filters + sort */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              label="Availability"
              value={currentAvailability}
              defaultValue="all"
              options={availabilityOptions}
              onChange={(value) => updateServerFilters({ availabilityStatus: value })}
            />
            <FilterDropdown
              label="Rating"
              value={currentRating}
              defaultValue="all"
              options={ratingOptions}
              onChange={(value) => updateServerFilters({ rating: value })}
            />
          </div>
          <FilterDropdown
            label="Sort by"
            value={currentSort}
            defaultValue="-rating"
            options={sortOptions}
            align="right"
            inline
            onChange={(value) => updateServerFilters({ sort: value })}
          />
        </div>

        {/* Active filters */}
        {chips.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={`${chip.key}-${chip.label}`}
                type="button"
                onClick={() => clearChip(chip.key)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-title hover:border-title"
              >
                {chip.label}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
            <button
              type="button"
              onClick={handleReset}
              className="px-1 text-sm font-semibold text-title underline-offset-2 hover:underline"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {/* Result count */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-copy">
            {total.toLocaleString()} {total === 1 ? "result" : "results"}
            {isPending ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : null}
          </p>
          <p className="hidden items-center gap-1.5 text-sm text-copy sm:inline-flex">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Every hire is escrow-protected
          </p>
        </div>

        {artisans.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100 text-title">
              <Search className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-title">No one matches this search</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Try a service name, a city, or clear a filter. Professionals appear when they offer that work.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-5 inline-flex h-11 items-center rounded-lg bg-title px-5 text-sm font-semibold text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className={`mt-5 grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity ${
              isPending ? "opacity-60" : ""
            }`}
          >
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
          <Pagination
            page={pagination.page}
            totalPage={pagination.totalPage}
            disabled={isPending}
            onChange={(page) => updateServerFilters({ page: String(page) })}
          />
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
    </>
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

/** Fiverr-style dropdown filter button with a radio list. */
function FilterDropdown({
  label,
  value,
  defaultValue,
  options,
  onChange,
  align = "left",
  inline = false,
}: {
  label: string;
  value: string;
  defaultValue: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  align?: "left" | "right";
  /** Renders as plain "Label: Value" text (used for sort). */
  inline?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((option) => option.value === value);
  const isSet = value !== defaultValue;

  const buttonClass = inline
    ? "border-transparent px-1 text-copy"
    : isSet
      ? "border-title bg-title text-white"
      : open
        ? "border-title bg-white text-title"
        : "border-slate-300 bg-white text-title hover:border-title";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition cursor-pointer ${buttonClass}`}
      >
        {inline ? (
          <span>
            <span className="font-normal">{label}:</span>{" "}
            <span className="text-title">{selected?.label}</span>
          </span>
        ) : (
          <span>{isSet ? selected?.label : label}</span>
        )}
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute top-full z-30 mt-2 min-w-[220px] rounded-xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.25)] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option) => {
            const checked = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={checked}
                onClick={() => {
                  setOpen(false);
                  if (!checked) onChange(option.value);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-title hover:bg-slate-50 cursor-pointer"
              >
                <span
                  className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 ${
                    checked ? "border-title" : "border-slate-300"
                  }`}
                >
                  {checked ? <span className="h-2 w-2 rounded-full bg-title" /> : null}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

/** Numbered circular pagination like Fiverr's results page. */
function Pagination({
  page,
  totalPage,
  disabled,
  onChange,
}: {
  page: number;
  totalPage: number;
  disabled: boolean;
  onChange: (page: number) => void;
}) {
  const items: Array<number | "gap"> = [];
  for (let p = 1; p <= totalPage; p++) {
    if (p === 1 || p === totalPage || Math.abs(p - page) <= 1) items.push(p);
    else if (items[items.length - 1] !== "gap") items.push("gap");
  }

  const circle =
    "grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition disabled:opacity-40 cursor-pointer disabled:cursor-default";

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1 || disabled}
        onClick={() => onChange(page - 1)}
        className={`${circle} border border-slate-300 text-title hover:border-title`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="w-6 text-center text-sm text-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            disabled={disabled}
            onClick={() => item !== page && onChange(item)}
            className={`${circle} ${
              item === page ? "bg-title text-white" : "text-title hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPage || disabled}
        onClick={() => onChange(page + 1)}
        className={`${circle} border border-slate-300 text-title hover:border-title`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

const MENU_OPEN_DELAY = 120;
const MENU_CLOSE_DELAY = 160;
const SERVICES_PER_CATEGORY = 8;

/**
 * Fiverr-style category bar: text links for each group; hovering (or tapping)
 * one opens a wide multi-column menu of category headings with their services.
 */
function CategoryMegaNav({
  categories,
  selectedId,
  selectedServiceId,
  onSelectCategory,
  onSelectService,
}: {
  categories: ICategoryItem[];
  selectedId: string;
  selectedServiceId?: string;
  onSelectCategory: (id: string | null) => void;
  onSelectService: (categoryId: string, serviceId: string) => void;
}) {
  const groups = groupCategories(categories);
  const services = useCategoryHover(); // used only for its lazy, cached service loading
  const [openKey, setOpenKey] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };
  useEffect(() => clearTimers, []);

  // Load services for every category in the open group (cached after the first time).
  const openGroup = groups.find((group) => group.key === openKey);
  const loadServices = services.load;
  const openCategoryIds = openGroup?.categories.map((category) => category._id).join(",") ?? "";
  useEffect(() => {
    openCategoryIds.split(",").filter(Boolean).forEach((id) => loadServices(id));
  }, [openCategoryIds, loadServices]);

  // Close on Escape / outside tap.
  useEffect(() => {
    if (!openKey) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpenKey(null);
    const onPointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpenKey(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [openKey]);

  const canHover = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const scheduleOpen = (key: string) => {
    if (!canHover()) return;
    clearTimers();
    if (openKey) setOpenKey(key);
    else openTimer.current = setTimeout(() => setOpenKey(key), MENU_OPEN_DELAY);
  };
  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = null;
    closeTimer.current = setTimeout(() => setOpenKey(null), MENU_CLOSE_DELAY);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const pickCategory = (id: string | null) => {
    clearTimers();
    setOpenKey(null);
    onSelectCategory(id);
  };
  const pickService = (categoryId: string, serviceId: string) => {
    clearTimers();
    setOpenKey(null);
    onSelectService(categoryId, serviceId);
  };

  const selectedGroupKey = groups.find((group) =>
    group.categories.some((category) => category._id === selectedId),
  )?.key;

  if (groups.length === 0) return null;

  return (
    <div ref={rootRef} className="relative z-30 border-b border-slate-200 bg-white" onMouseLeave={scheduleClose}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollerRef}
          className="flex gap-7 overflow-x-auto pr-10 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          <NavTab
            label="All"
            active={!selectedId && !openKey}
            onClick={() => pickCategory(null)}
            onMouseEnter={scheduleClose}
          />
          {groups.map((group) => (
            <NavTab
              key={group.key}
              label={group.label}
              active={openKey === group.key || (!openKey && selectedGroupKey === group.key)}
              expanded={openKey === group.key}
              onMouseEnter={() => scheduleOpen(group.key)}
              onClick={() => {
                // Touch devices: tap toggles the menu. Mouse users already opened it on hover.
                clearTimers();
                setOpenKey((current) => (current === group.key && !canHover() ? null : group.key));
              }}
            />
          ))}
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-4 w-16 bg-linear-to-l from-white to-transparent sm:right-6 lg:right-8"
        />
        <button
          type="button"
          aria-label="Scroll categories"
          onClick={() => scrollerRef.current?.scrollBy({ left: 280, behavior: "smooth" })}
          className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white text-title shadow-[0_1px_6px_rgba(0,0,0,0.15)] hover:text-primary cursor-pointer sm:right-5 lg:right-7"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {openGroup ? (
        <div
          role="menu"
          aria-label={`${openGroup.label} categories`}
          onMouseEnter={cancelClose}
          className="absolute inset-x-0 top-full"
        >
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-h-[70vh] overflow-y-auto border-x border-b border-slate-200 bg-white px-6 py-7 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] [scrollbar-width:thin] sm:rounded-b-xl sm:px-8">
              <div className="columns-1 gap-10 sm:columns-2 lg:columns-4">
                {openGroup.categories.map((category) => {
                  const list = services.servicesFor(category._id);
                  const loading = services.isLoading(category._id);
                  const failed = services.hasError(category._id);
                  const shown = list.slice(0, SERVICES_PER_CATEGORY);
                  const extra = list.length - shown.length;
                  return (
                    <div key={category._id} className="mb-7 break-inside-avoid">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => pickCategory(category._id)}
                        className={`text-left text-[15px] font-semibold transition hover:text-primary cursor-pointer ${
                          selectedId === category._id ? "text-primary" : "text-title"
                        }`}
                      >
                        {category.name}
                      </button>
                      {failed ? (
                        <ServicesLoadError onRetry={() => services.load(category._id)} />
                      ) : loading ? (
                        <div className="mt-3 space-y-2.5">
                          {[70, 85, 60].map((width) => (
                            <span
                              key={width}
                              style={{ width: `${width}%` }}
                              className="block h-3.5 animate-pulse rounded bg-slate-100"
                            />
                          ))}
                        </div>
                      ) : (
                        <ul className="mt-2 space-y-0.5">
                          {shown.map((service) => (
                            <li key={service._id}>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => pickService(category._id, service._id)}
                                className={`py-1 text-left text-[15px] transition hover:text-title cursor-pointer ${
                                  selectedServiceId === service._id
                                    ? "font-medium text-primary"
                                    : "text-copy"
                                }`}
                              >
                                {service.name}
                              </button>
                            </li>
                          ))}
                          {extra > 0 || list.length === 0 ? (
                            <li>
                              <button
                                type="button"
                                onClick={() => pickCategory(category._id)}
                                className="inline-flex items-center gap-1 py-1 text-[15px] font-medium text-primary hover:underline cursor-pointer"
                              >
                                {extra > 0 ? `+${extra} more` : "Browse pros"}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ) : null}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NavTab({
  label,
  active,
  expanded,
  onClick,
  onMouseEnter,
}: {
  label: string;
  active: boolean;
  expanded?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <button
      type="button"
      aria-haspopup={expanded === undefined ? undefined : "menu"}
      aria-expanded={expanded}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`relative shrink-0 whitespace-nowrap py-3.5 text-[15px] transition cursor-pointer ${
        active ? "text-title" : "text-copy hover:text-title"
      }`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-[3px] rounded-t bg-primary transition-transform origin-left ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
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
  const trade = artisan.trade || user?.trade || "Professional";
  const categoryLabel =
    artisan.category && typeof artisan.category === "object" ? artisan.category.name : "";
  const locationText = artisan.location || artisan.city || user?.location || "";
  const isAvailable = artisan.availabilityStatus?.toLowerCase() !== "booked";
  const reviewsCount = artisan.reviewsCount || 0;
  const matched = artisan.matchedOffering;
  const price = matched?.rateAmount ? matched : artisan.startingOffer;
  const rateAmount = price?.rateAmount || artisan.startingRate || artisan.hourlyRate || 0;
  const rateSuffix = String(price?.rateType || "").toUpperCase() === "DAILY" ? "/day" : "/hr";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const profileHref = `/job-seeker/${user?._id || artisan._id}`;
  const showReply = (artisan.responseSamples || 0) >= 3 && artisan.responseTimeMinutes;
  const service = matched?.name || trade;
  // Cover shows the kind of work (stock photo); falls back to the pro's avatar.
  const cover = categoryPhoto(service, trade, categoryLabel) || avatarUrl;

  return (
    <article className="group flex h-full flex-col">
      {/* Cover */}
      <Link
        href={profileHref}
        className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-slate-100"
      >
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="grid h-full w-full place-items-center bg-linear-to-br from-[#4A0D1E] to-primary">
            <span className="font-display text-4xl font-semibold text-white">{initials || "P"}</span>
          </span>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-title shadow-sm">
          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-amber-500"}`} />
          {isAvailable ? "Available" : "Booked"}
        </span>
      </Link>

      {/* Seller row */}
      <div className="mt-3 flex items-center gap-2">
        <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-slate-100">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="" fill sizes="28px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-[11px] font-bold text-primary">
              {initials || "P"}
            </span>
          )}
        </span>
        <Link href={profileHref} className="min-w-0 truncate text-sm font-semibold text-title hover:underline">
          {displayName}
        </Link>
        {user?.verified ? (
          <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
        ) : null}
      </div>

      {/* Title */}
      <Link
        href={profileHref}
        className="mt-2 line-clamp-2 text-[15px] leading-snug text-title hover:underline"
      >
        {artisan.bio || service}
      </Link>

      {/* Meta */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1 font-semibold text-title">
          <Star className="h-3.5 w-3.5 fill-title text-title" />
          {reviewsCount > 0 ? Number(artisan.rating || 0).toFixed(1) : "New"}
        </span>
        {reviewsCount > 0 ? <span className="text-muted">({reviewsCount})</span> : null}
        {artisan.completedJobs ? (
          <span className="text-muted">· {artisan.completedJobs} jobs</span>
        ) : null}
        {showReply ? (
          <span className="text-muted">· {replyLabel(artisan.responseTimeMinutes || 0)}</span>
        ) : null}
      </div>
      {locationText ? (
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{locationText}</span>
        </p>
      ) : null}

      {/* Price + quote */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
        <p className="text-base font-semibold text-title">
          {rateAmount ? (
            <>
              <span className="text-sm font-normal text-copy">From </span>GH₵ {rateAmount}
              <span className="text-sm font-normal text-muted">{rateSuffix}</span>
            </>
          ) : (
            <span className="text-sm font-normal text-copy">Price on quote</span>
          )}
        </p>
        <button
          type="button"
          onClick={onQuote}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline cursor-pointer"
        >
          Request quote
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}

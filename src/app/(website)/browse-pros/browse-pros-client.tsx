"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase, ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, NativeSelect, TextField } from "@/components/ui/field";
import { ProCard } from "@/components/shared/pro-card";
import { BudgetDropdownFilter } from "@/components/shared/budget-filter";
import { categories, professionals } from "@/Mockdata";
import { postJobHref } from "@/lib/role-access";
import { getProDistance, parseResponseTimeHours } from "@/lib/geo-distance";
import { cn } from "@/lib/cn";
import type { User } from "@/types";

const PAGE_SIZE = 8;

export function BrowseProsClient() {
  const params = useSearchParams();
  const user: any = null;
  const [filters, setFilters] = useState({
    query: "",
    category: params.get("category") || "",
    zip: params.get("zip") || params.get("location") || "",
    minPrice: "",
    maxPrice: "",
    budgetTier: "",
    minRating: "",
    sort: "rated",
  });
  const category = filters.category;
  const location = filters.zip;

  const [currentPage, setCurrentPage] = useState(1);
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const gridTopRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const locationQ = location.trim().toLowerCase();
    const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
    const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;
    const minRating = filters.minRating ? Number(filters.minRating) : null;

    const list = professionals.filter((pro) => {
      const matchesCategory = !category || pro.categorySlug === category;
      const locationHaystack = `${pro.zip} ${pro.city} ${pro.state}`.toLowerCase();
      const matchesLocation =
        !locationQ ||
        locationHaystack.includes(locationQ) ||
        (/^\d+$/.test(locationQ) && pro.zip.startsWith(locationQ.slice(0, 3)));
      const haystack = `${pro.name} ${pro.businessName} ${pro.trade} ${pro.bio}`.toLowerCase();
      const matchesQuery = !filters.query || haystack.includes(filters.query.toLowerCase());
      const matchesMinPrice = minPrice == null || !Number.isFinite(minPrice) || pro.startingPrice >= minPrice;
      const matchesMaxPrice = maxPrice == null || !Number.isFinite(maxPrice) || pro.startingPrice <= maxPrice;
      const matchesPrice = matchesMinPrice && matchesMaxPrice;
      const matchesRating = minRating == null || !Number.isFinite(minRating) || pro.rating >= minRating;
      return (
        matchesCategory &&
        matchesLocation &&
        matchesQuery &&
        matchesPrice &&
        matchesRating &&
        pro.clearance === "cleared"
      );
    });

    const withDistance = list.map((pro) => ({
      pro,
      distance: getProDistance(
        pro,
        location,
        undefined,
      ),
    }));

    return withDistance.sort((a, b) => {
      if (filters.sort === "nearest") {
        return a.distance - b.distance;
      }
      if (filters.sort === "recommended") {
        // Industry-standard blended score: high rating + verified + jobs volume - distance penalty
        const scoreA =
          a.pro.rating * 25 +
          Math.min(a.pro.reviewCount, 100) * 0.2 +
          Math.min(a.pro.jobsCompleted, 200) * 0.15 -
          Math.min(a.distance, 100) * 0.2;
        const scoreB =
          b.pro.rating * 25 +
          Math.min(b.pro.reviewCount, 100) * 0.2 +
          Math.min(b.pro.jobsCompleted, 200) * 0.15 -
          Math.min(b.distance, 100) * 0.2;
        return scoreB - scoreA;
      }
      if (filters.sort === "reviews") return b.pro.reviewCount - a.pro.reviewCount;
      if (filters.sort === "jobs") return b.pro.jobsCompleted - a.pro.jobsCompleted;
      if (filters.sort === "price_low") return a.pro.startingPrice - b.pro.startingPrice;
      if (filters.sort === "price_high") return b.pro.startingPrice - a.pro.startingPrice;
      if (filters.sort === "response") {
        return parseResponseTimeHours(a.pro.responseTime) - parseResponseTimeHours(b.pro.responseTime);
      }
      return b.pro.rating - a.pro.rating;
    });
  }, [category, filters, location, user]);

  // Reset to page 1 whenever search filters change without cascading effect
  const filterKey = `${category}|${location}|${filters.query}|${filters.minPrice}|${filters.maxPrice}|${filters.minRating}|${filters.sort}`;
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }

  const totalPages = Math.ceil(results.length / PAGE_SIZE) || 1;
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return results.slice(startIndex, startIndex + PAGE_SIZE);
  }, [results, currentPage]);

  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="bg-surface py-6 sm:py-8">
      <div className="container-site">
        {user?.role === "pro" && (
          <div className="mb-6 rounded-[16px] border border-primary/25 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-xs">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm sm:text-base font-bold text-title">
                      You are viewing as a Professional Contractor
                    </p>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Pro Mode
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#757575]">
                    This directory is for homeowners to find pros. To quote on live customer jobs, visit the Jobs Board.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <Button href="/pro/jobs" size="sm" className="font-semibold shadow-xs">
                  Available Jobs Board ↗
                </Button>
                <Button href="/browse-pros/pro-1" variant="ghost" size="sm">
                  My Storefront ↗
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-3 rounded-[14px] bg-white p-5 soft-shadow md:grid-cols-3 lg:grid-cols-6">
          <Field label="Search">
            <TextField
              value={filters.query}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, query: event.target.value }))
              }
              placeholder="Name or service"
            />
          </Field>
          <Field label="Category">
            <NativeSelect
              value={category}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, category: event.target.value }))
              }
            >
              <option value="">All services</option>
              {categories.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Location">
            <TextField
              value={location}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, zip: event.target.value }))
              }
              placeholder="ZIP or city"
            />
          </Field>
          <Field label="Budget">
            <BudgetDropdownFilter
              value={filters}
              onChange={(budget) =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: budget.minPrice,
                  maxPrice: budget.maxPrice,
                  budgetTier: budget.budgetTier,
                }))
              }
            />
          </Field>
          <Field label="Min rating">
            <NativeSelect
              value={filters.minRating}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, minRating: event.target.value }))
              }
            >
              <option value="">Any</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
              <option value="4.8">4.8+</option>
            </NativeSelect>
          </Field>
          <Field label="Sort">
            <NativeSelect
              value={filters.sort}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, sort: event.target.value }))
              }
            >
              <option value="rated">Highest rated</option>
              <option value="reviews">Most reviews</option>
              <option value="nearest">Nearest (Distance)</option>
            </NativeSelect>
          </Field>
        </div>

        <div ref={gridTopRef} className="scroll-mt-28" />

        {results.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="No reviewed professionals match this view"
              description="Try another service, price, or location — or post a request for offers."
              actionLabel="Post a request"
              href={postJobHref(user)}
            />
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
              {paginatedResults.map(({ pro, distance }) => (
                <div key={pro.id} className="min-w-0 flex h-full">
                  <ProCard pro={pro} distance={distance} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line/70 pt-6">
                <p className="text-xs font-medium text-muted order-2 sm:order-1">
                  Showing{" "}
                  <span className="font-semibold text-title">
                    {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, results.length)}
                  </span>{" "}
                  of <span className="font-semibold text-title">{results.length}</span> professionals
                </p>

                <nav
                  aria-label="Pagination Navigation"
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-line/80 bg-white p-1.5 shadow-xs order-1 sm:order-2"
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                      currentPage === 1
                        ? "text-muted/40 cursor-not-allowed"
                        : "text-title hover:bg-smoke cursor-pointer",
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                      const isActive = p === currentPage;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePageChange(p)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "grid h-8 w-8 place-items-center rounded-xl text-xs font-semibold transition-all cursor-pointer",
                            isActive
                              ? "bg-primary text-white shadow-xs font-bold"
                              : "text-title hover:bg-smoke hover:text-primary",
                          )}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                      currentPage === totalPages
                        ? "text-muted/40 cursor-not-allowed"
                        : "text-title hover:bg-smoke cursor-pointer",
                    )}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

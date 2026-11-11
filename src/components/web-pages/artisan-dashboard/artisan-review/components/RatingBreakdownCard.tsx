"use client";

import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ReviewStats, RatingBreakdownItem, FilterType } from "../types";

interface RatingBreakdownCardProps {
  stats: ReviewStats;
  breakdown: RatingBreakdownItem[];
  selectedFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

export function RatingBreakdownCard({
  stats,
  breakdown,
  selectedFilter,
  onSelectFilter,
}: RatingBreakdownCardProps) {
  const isStarFilter = selectedFilter.endsWith("-star");

  // Calculate positive satisfaction percentage (4 and 5 star reviews)
  const positiveReviews = breakdown
    .filter((b) => b.star >= 4)
    .reduce((sum, b) => sum + b.count, 0);
  const satisfactionRate =
    stats.total > 0 ? Math.round((positiveReviews / stats.total) * 100) : 100;

  return (
    <Card className="rounded-xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Column: Overall Rating Score */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left md:border-r border-line/70 md:pr-6 justify-between py-0.5">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted">
              Average Rating
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-title">
                {stats.total > 0 ? stats.avg.toFixed(1) : "0.0"}
              </span>
              <span className="text-sm font-medium text-muted">/ 5.0</span>
            </div>

            <div className="mt-2 flex items-center gap-1 text-amber-500">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <Star
                  key={starIndex}
                  className={cn(
                    "h-4 w-4",
                    stats.total > 0 && starIndex <= Math.round(stats.avg)
                      ? "fill-amber-400 text-amber-500"
                      : "fill-slate-100 text-slate-300",
                  )}
                />
              ))}
            </div>

            <p className="mt-2 text-xs font-medium text-title/70">
              Based on {stats.total} verified{" "}
              {stats.total === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-line/60 w-full flex items-center justify-center md:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {satisfactionRate}% Client Satisfaction
            </span>
          </div>
        </div>

        {/* Right Column: Rating Breakdown Bars */}
        <div className="md:col-span-8 flex flex-col justify-between py-0.5">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted px-2.5">
            <span>Rating Breakdown</span>
            {isStarFilter ? (
              <button
                type="button"
                onClick={() => onSelectFilter("all")}
                className="text-primary hover:underline text-[11px] font-medium lowercase first-letter:uppercase cursor-pointer"
              >
                Clear filter
              </button>
            ) : (
              <span className="text-[11px] font-normal text-muted lowercase">
                click star to filter
              </span>
            )}
          </div>

          <div className="space-y-1">
            {breakdown.map(({ star, count, percentage, filterKey }) => {
              const isSelected = selectedFilter === filterKey;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => onSelectFilter(isSelected ? "all" : filterKey)}
                  className={cn(
                    "group flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                    isSelected
                      ? "bg-slate-100 font-semibold text-title"
                      : "text-title hover:bg-slate-50",
                  )}
                >
                  <span className="flex w-10 shrink-0 items-center gap-1 font-medium text-title">
                    <span>{star}</span>
                    <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-500" />
                  </span>

                  {/* Visual Progress Bar Track */}
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden relative">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        count > 0
                          ? "bg-amber-400 group-hover:bg-amber-500"
                          : "bg-transparent",
                        isSelected && "bg-title",
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Percentage & Count Badge */}
                  <div className="w-16 text-right shrink-0 flex items-center justify-end gap-1 text-[11px]">
                    <span className="font-medium text-title">{count}</span>
                    <span className="text-muted">({percentage}%)</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

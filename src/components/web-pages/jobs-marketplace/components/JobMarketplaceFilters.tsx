"use client";

import { Search, Filter, RotateCcw, ArrowUpDown, Tag } from "lucide-react";
import type { IJobCategory } from "../types";

interface JobMarketplaceFiltersProps {
  categories: IJobCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (sort: string, order: "asc" | "desc") => void;
  onReset: () => void;
  totalResults: number;
}

export function JobMarketplaceFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  onReset,
  totalResults,
}: JobMarketplaceFiltersProps) {
  const hasActiveFilters = Boolean(
    searchTerm.trim() || selectedCategory || sortBy !== "createdAt",
  );

  return (
    <div className="space-y-5">
      {/* SEARCH BAR & QUICK SORT */}
      <div className="rounded-3xl border border-line bg-white p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search active jobs (e.g. plumbing, wiring, roofing)..."
              className="w-full rounded-2xl border border-line bg-smoke/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FE375D] transition-colors"
            />
          </div>

          {/* SORT SELECT */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="h-4 w-4 text-muted shrink-0 hidden sm:inline" />
            <select
              value={`${sortBy}:${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split(":");
                onSortChange(sb, so as "asc" | "desc");
              }}
              className="w-full sm:w-auto rounded-2xl border border-line bg-smoke/50 px-3.5 py-2.5 text-xs font-semibold text-title focus:border-[#FE375D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FE375D] cursor-pointer"
            >
              <option value="createdAt:desc">Newest Jobs</option>
              <option value="budget:desc">Highest Budget (GH₵)</option>
              <option value="budget:asc">Lowest Budget (GH₵)</option>
            </select>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={onReset}
                title="Reset filters"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-line bg-white text-muted hover:text-[#FE375D] hover:border-[#FE375D] transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectCategory("")}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            !selectedCategory
              ? "bg-[#FE375D] text-white shadow-xs"
              : "border border-line bg-white text-muted hover:text-title hover:border-title"
          }`}
        >
          All Categories ({totalResults})
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat._id;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => onSelectCategory(cat._id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#FE375D] text-white shadow-xs"
                  : "border border-line bg-white text-muted hover:text-title hover:border-title"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

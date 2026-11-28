"use client";

import { useState } from "react";
import { Search, Filter, RotateCcw, X, Tag } from "lucide-react";
import {
  ServiceCategoryFilterModal,
  type FilterSelection,
} from "@/components/shared/ServiceCategoryFilterModal";
import type { IJobCategory } from "../types";

interface JobMarketplaceFiltersProps {
  categories: IJobCategory[];
  selectedCategory: string;
  selectedService: string;
  onFilterChange: (selection: { category?: string; service?: string; label?: string }) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onReset: () => void;
  totalResults: number;
}

export function JobMarketplaceFilters({
  categories,
  selectedCategory,
  selectedService,
  onFilterChange,
  searchTerm,
  onSearchChange,
  onReset,
  totalResults,
}: JobMarketplaceFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilterLabel, setActiveFilterLabel] = useState<string>("");

  const hasActiveFilters = Boolean(
    searchTerm.trim() || selectedCategory || selectedService,
  );

  const handleApplyModalFilter = (selection: FilterSelection) => {
    const label = selection.serviceName
      ? `${selection.serviceName} (Service)`
      : selection.categoryName
        ? `${selection.categoryName} (Category)`
        : "";
    setActiveFilterLabel(label);

    onFilterChange({
      category: selection.categoryId,
      service: selection.serviceId,
      label,
    });
  };

  const handleClearCategoryService = () => {
    setActiveFilterLabel("");
    onFilterChange({ category: "", service: "" });
  };

  return (
    <div className="space-y-4">
      {/* SEARCH BAR & FILTER MODAL BUTTON (SORT REMOVED) */}
      <div className="rounded-2xl bg-white p-2 ring-1 ring-slate-200 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.35)] space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-copy" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search active jobs (e.g. chef, driver, cleaning, wiring)..."
              className="w-full rounded-xl border-0 bg-transparent pl-12 pr-4 py-3.5 text-[15px] text-title placeholder:text-copy/70 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>

          {/* FILTER MODAL TRIGGER BUTTON */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory || selectedService
                  ? "bg-primary/10 text-primary ring-1 ring-primary/40"
                  : "bg-title text-white! hover:bg-black"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>
                {selectedCategory || selectedService
                  ? "Filtered"
                  : "Filter Category / Service"}
              </span>
              {(selectedCategory || selectedService) && (
                <span className="h-2 w-2 rounded-full bg-[#FE375D]" />
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onReset}
                title="Reset filters"
                className="grid h-12 w-12 place-items-center rounded-xl ring-1 ring-slate-200 bg-white text-copy hover:text-primary hover:ring-primary transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE FILTER LABEL CHIP */}
        {(selectedCategory || selectedService) && (
          <div className="flex items-center gap-2 px-3 pb-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-muted">Active Filter:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#FE375D] border border-rose-200/60">
              <span>{activeFilterLabel || "Category/Service Filter"}</span>
              <button
                type="button"
                onClick={handleClearCategoryService}
                className="hover:text-rose-950 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* QUICK CATEGORY PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setActiveFilterLabel("");
            onFilterChange({ category: "", service: "" });
          }}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
            !selectedCategory && !selectedService
              ? "bg-title text-white!"
              : "bg-white text-title ring-1 ring-slate-200 hover:ring-title"
          }`}
        >
          All Requests
        </button>

        {categories.slice(0, 10).map((cat) => {
          const isSelected = selectedCategory === cat._id;
          return (
            <button
              key={cat._id}
              type="button"
              onClick={() => {
                setActiveFilterLabel(`${cat.name} (Category)`);
                onFilterChange({ category: cat._id, service: "" });
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                isSelected
                  ? "bg-title text-white!"
                  : "bg-white text-title ring-1 ring-slate-200 hover:ring-title"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* FILTER MODAL */}
      <ServiceCategoryFilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handleApplyModalFilter}
        initialCategoryId={selectedCategory}
        initialServiceId={selectedService}
      />
    </div>
  );
}

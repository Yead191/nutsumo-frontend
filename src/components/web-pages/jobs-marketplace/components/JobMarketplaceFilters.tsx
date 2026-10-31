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
      <div className="rounded-3xl border border-line bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search active jobs (e.g. plumbing, wiring, garden bed)..."
              className="w-full rounded-2xl border border-line bg-smoke/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FE375D] transition-colors"
            />
          </div>

          {/* FILTER MODAL TRIGGER BUTTON */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                selectedCategory || selectedService
                  ? "border-[#FE375D] bg-[#FE375D]/10 text-[#FE375D]"
                  : "border-line bg-smoke/50 text-title hover:bg-white hover:border-title"
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
                className="grid h-10 w-10 place-items-center rounded-2xl border border-line bg-white text-muted hover:text-[#FE375D] hover:border-[#FE375D] transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE FILTER LABEL CHIP */}
        {(selectedCategory || selectedService) && (
          <div className="flex items-center gap-2 pt-1 border-t border-line/60">
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            setActiveFilterLabel("");
            onFilterChange({ category: "", service: "" });
          }}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            !selectedCategory && !selectedService
              ? "bg-[#FE375D] text-white shadow-xs"
              : "border border-line bg-white text-muted hover:text-title hover:border-title"
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

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search,
  Loader2,
  Check,
  X,
  Layers,
  Wrench,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { getCatalogServices } from "@/helpers/next-fetch/apiActions/artisanActions";
import type { IPostJobCategory } from "../types";

interface ServiceFirstSelectorProps {
  categories: IPostJobCategory[];
  selectedCategory: string;
  selectedService: string;
  customServiceName: string;
  onCategoryChange: (categoryId: string) => void;
  onServiceChange: (serviceId: string, serviceName?: string) => void;
  onCustomServiceChange: (val: string) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  selectedService,
  customServiceName,
  onCategoryChange,
  onServiceChange,
  onCustomServiceChange,
}: ServiceFirstSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [showCategoryFallback, setShowCategoryFallback] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Live search for catalog services with debounce
  const fetchServices = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const res = await getCatalogServices({
        limit: 12,
        searchTerm: query.trim() || undefined,
      });
      if (res?.success && Array.isArray(res.data)) {
        setSearchResults(res.data);
      }
    } catch (err) {
      console.error("Error fetching catalog services:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial popular services on mount
  useEffect(() => {
    fetchServices("");
  }, [fetchServices]);

  // Debounced search on typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDropdownOpen || searchTerm) {
        fetchServices(searchTerm);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, isDropdownOpen, fetchServices]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectService = (srv: any) => {
    onServiceChange(srv._id, srv.name);
    setSelectedServiceName(srv.name);
    setIsDropdownOpen(false);
    setSearchTerm("");

    // If service has a category attached, auto-select it!
    const catId = typeof srv.category === "object" ? srv.category?._id : srv.category;
    if (catId) {
      onCategoryChange(catId);
    }
  };

  const handleClearSelectedService = () => {
    onServiceChange("", "");
    setSelectedServiceName("");
  };

  const selectedCategoryObj = categories.find((c) => c._id === selectedCategory);
  const availableCategoryServices = selectedCategoryObj?.services || [];

  return (
    <div className="space-y-4">
      {/* 1. PRIMARY SERVICE SELECTOR (HIGH PRIORITY) */}
      <div className="relative" ref={containerRef}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-title">
            Search & Select Service <span className="text-muted font-normal">(Recommended)</span>
          </label>
          <button
            type="button"
            onClick={() => setShowCategoryFallback(!showCategoryFallback)}
            className="text-[11px] font-semibold text-[#FE375D] hover:underline cursor-pointer"
          >
            {showCategoryFallback ? "Hide Categories" : "Or Browse by Category"}
          </button>
        </div>

        {selectedServiceName ? (
          /* SELECTED SERVICE CHIP */
          <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50/60 p-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white shrink-0">
                <Check className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs font-bold text-title">{selectedServiceName}</p>
                {selectedCategoryObj?.name && (
                  <p className="text-[11px] text-muted">Category: {selectedCategoryObj.name}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearSelectedService}
              className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-emerald-100 hover:text-title transition cursor-pointer"
              title="Change Service"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* SEARCH INPUT */
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder="e.g. Plumbing, Sink Repair, House Painting, AC Servicing..."
              className="w-full rounded-xl border border-line bg-white pl-10 pr-9 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
            />
            {isLoading && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#FE375D]" />
            )}
          </div>
        )}

        {/* SEARCH RESULTS DROPDOWN */}
        {isDropdownOpen && !selectedServiceName && (
          <div className="absolute left-0 right-0 top-full mt-1.5 max-h-60 overflow-y-auto rounded-2xl border border-line bg-white p-2 shadow-xl z-30 divide-y divide-line/40">
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted">
                {isLoading ? "Searching catalog services..." : "No specific service found. You can choose a category below or type a custom title."}
              </div>
            ) : (
              searchResults.map((srv) => {
                const catName =
                  typeof srv.category === "object" ? srv.category?.name : "";
                return (
                  <div
                    key={srv._id}
                    onClick={() => handleSelectService(srv)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-smoke cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-title">{srv.name}</p>
                      {catName && (
                        <p className="text-[10px] text-muted">{catName}</p>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-[#FE375D]">Select</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* 2. CATEGORY FALLBACK (OPTIONAL) */}
      {showCategoryFallback && (
        <div className="p-4 rounded-2xl border border-line bg-smoke/40 space-y-3.5 animate-in fade-in duration-150">
          <div>
            <label className="block text-xs font-semibold text-title mb-1.5">
              Service Category <span className="text-muted font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  onCategoryChange(e.target.value);
                  onServiceChange("");
                }}
                className="w-full appearance-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs sm:text-sm text-title focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs cursor-pointer"
              >
                <option value="">Select general category (optional)...</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            </div>
          </div>

          {/* If Category is selected and has sub-services */}
          {selectedCategory && availableCategoryServices.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Category Specialization
              </label>
              <div className="relative">
                <select
                  value={selectedService}
                  onChange={(e) => {
                    const found = availableCategoryServices.find(
                      (s) => s._id === e.target.value,
                    );
                    onServiceChange(e.target.value, found?.name);
                    setSelectedServiceName(found?.name || "");
                  }}
                  className="w-full appearance-none rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs sm:text-sm text-title focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs cursor-pointer"
                >
                  <option value="">Choose from category services...</option>
                  {availableCategoryServices.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. CUSTOM SERVICE TITLE (IF NOT IN CATALOG) */}
      {!selectedServiceName && (
        <div>
          <label className="block text-xs font-semibold text-title mb-1.5">
            Or Type Custom Service Title <span className="text-muted font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={customServiceName}
            onChange={(e) => onCustomServiceChange(e.target.value)}
            placeholder="e.g. Teak Wood Wardrobe Varnishing & Polishing"
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
          />
        </div>
      )}
    </div>
  );
}

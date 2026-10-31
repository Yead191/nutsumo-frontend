"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Search,
  Check,
  Tag,
  Wrench,
  Loader2,
  Filter,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  getServiceCategories,
  getCatalogServices,
} from "@/helpers/next-fetch/apiActions/artisanActions";

export interface FilterSelection {
  categoryId?: string;
  categoryName?: string;
  serviceId?: string;
  serviceName?: string;
}

interface ServiceCategoryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (selection: FilterSelection) => void;
  initialCategoryId?: string;
  initialServiceId?: string;
}

export function ServiceCategoryFilterModal({
  isOpen,
  onClose,
  onApply,
  initialCategoryId = "",
  initialServiceId = "",
}: ServiceCategoryFilterModalProps) {
  const [activeTab, setActiveTab] = useState<"services" | "categories">("services");

  // Selection state
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string } | null>(null);
  const [selectedService, setSelectedService] = useState<{ id: string; name: string } | null>(null);

  // Search queries
  const [serviceSearch, setServiceSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Categories list & pagination state
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Services list & pagination state
  const [services, setServices] = useState<any[]>([]);
  const [servicePage, setServicePage] = useState(1);
  const [serviceHasMore, setServiceHasMore] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const servicesScrollRef = useRef<HTMLDivElement>(null);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      if (initialCategoryId) {
        setSelectedCategory({ id: initialCategoryId, name: "" });
      } else {
        setSelectedCategory(null);
      }
      if (initialServiceId) {
        setSelectedService({ id: initialServiceId, name: "" });
      } else {
        setSelectedService(null);
      }
      // Load initial page of categories & services
      loadCategories(1, categorySearch, true);
      loadServices(1, serviceSearch, true);
    }
  }, [isOpen, initialCategoryId, initialServiceId]);

  // Fetch Categories with Pagination
  const loadCategories = async (page: number, search: string, reset = false) => {
    if (isLoadingCategories) return;
    setIsLoadingCategories(true);

    try {
      const res = await getServiceCategories({
        page,
        limit: 12,
        searchTerm: search.trim() || undefined,
      });

      if (res?.success && Array.isArray(res.data)) {
        setCategories((prev) => (reset ? res.data : [...prev, ...res.data]));
        const pagination = res.pagination;
        if (pagination) {
          setCategoryHasMore(page < pagination.totalPage);
        } else {
          setCategoryHasMore(res.data.length >= 12);
        }
        setCategoryPage(page);
      } else {
        if (reset) setCategories([]);
        setCategoryHasMore(false);
      }
    } catch {
      if (reset) setCategories([]);
      setCategoryHasMore(false);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Fetch Services with Pagination
  const loadServices = async (page: number, search: string, reset = false) => {
    if (isLoadingServices) return;
    setIsLoadingServices(true);

    try {
      const res = await getCatalogServices({
        page,
        limit: 15,
        searchTerm: search.trim() || undefined,
        category: selectedCategory?.id || undefined,
      });

      if (res?.success && Array.isArray(res.data)) {
        setServices((prev) => (reset ? res.data : [...prev, ...res.data]));
        const pagination = res.pagination;
        if (pagination) {
          setServiceHasMore(page < pagination.totalPage);
        } else {
          setServiceHasMore(res.data.length >= 15);
        }
        setServicePage(page);
      } else {
        if (reset) setServices([]);
        setServiceHasMore(false);
      }
    } catch {
      if (reset) setServices([]);
      setServiceHasMore(false);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Debounce Category Search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      loadCategories(1, categorySearch, true);
    }, 300);
    return () => clearTimeout(timer);
  }, [categorySearch, isOpen]);

  // Debounce Service Search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      loadServices(1, serviceSearch, true);
    }, 300);
    return () => clearTimeout(timer);
  }, [serviceSearch, selectedCategory?.id, isOpen]);

  // Scroll listener for Categories list (infinite scroll)
  const handleCategoriesScroll = () => {
    const el = categoriesScrollRef.current;
    if (!el || isLoadingCategories || !categoryHasMore) return;

    if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) {
      loadCategories(categoryPage + 1, categorySearch, false);
    }
  };

  // Scroll listener for Services list (infinite scroll)
  const handleServicesScroll = () => {
    const el = servicesScrollRef.current;
    if (!el || isLoadingServices || !serviceHasMore) return;

    if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) {
      loadServices(servicePage + 1, serviceSearch, false);
    }
  };

  const handleApply = () => {
    onApply({
      categoryId: selectedCategory?.id,
      categoryName: selectedCategory?.name,
      serviceId: selectedService?.id,
      serviceName: selectedService?.name,
    });
    onClose();
  };

  const handleClearAll = () => {
    setSelectedCategory(null);
    setSelectedService(null);
    onApply({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-line text-left flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-smoke text-muted hover:text-title transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER */}
        <div className="border-b border-line/70 pb-4 pr-10 shrink-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-[#FE375D]">
            <Filter className="h-3 w-3" />
            <span>Targeted Filter</span>
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-title tracking-tight mt-1">
            Filter by Service or Category
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Select a specific trade category or catalog service with live scroll search.
          </p>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-line/70 pt-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "services"
                ? "border-[#FE375D] text-[#FE375D]"
                : "border-transparent text-muted hover:text-title"
            }`}
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>Services</span>
            {selectedService ? (
              <span className="h-1.5 w-1.5 rounded-full bg-[#FE375D]" />
            ) : null}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`inline-flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "categories"
                ? "border-[#FE375D] text-[#FE375D]"
                : "border-transparent text-muted hover:text-title"
            }`}
          >
            <Tag className="h-3.5 w-3.5" />
            <span>Categories</span>
            {selectedCategory ? (
              <span className="h-1.5 w-1.5 rounded-full bg-[#FE375D]" />
            ) : null}
          </button>
        </div>

        {/* TAB 1: SERVICES (PRIORITY) */}
        {activeTab === "services" && (
          <div className="flex-1 min-h-0 flex flex-col pt-3 space-y-3">
            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Search catalog services (e.g. plumbing, wiring, garden bed)..."
                className="w-full rounded-xl border border-line bg-smoke/50 pl-9 pr-3.5 py-2 text-xs text-title placeholder:text-muted focus:border-[#FE375D] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Scrollable Services List */}
            <div
              ref={servicesScrollRef}
              onScroll={handleServicesScroll}
              className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 border border-line/60 rounded-2xl p-2.5 bg-smoke/20"
            >
              {services.length === 0 && !isLoadingServices ? (
                <div className="p-6 text-center text-xs text-muted">
                  No services found. Try another search keyword.
                </div>
              ) : (
                services.map((srv) => {
                  const isSelected = selectedService?.id === srv._id;
                  const catName =
                    typeof srv.category === "object" && srv.category
                      ? srv.category.name
                      : "";

                  return (
                    <button
                      key={srv._id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedService(null);
                        } else {
                          setSelectedService({ id: srv._id, name: srv.name });
                          // Also clear category selection if choosing a specific service
                          setSelectedCategory(null);
                        }
                      }}
                      className={`w-full text-left rounded-xl p-2.5 text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#FE375D] text-white shadow-xs font-bold"
                          : "bg-white hover:bg-slate-50 text-title border border-line/50"
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{srv.name}</div>
                        {catName ? (
                          <div
                            className={`text-[10px] mt-0.5 ${
                              isSelected ? "text-rose-100" : "text-muted"
                            }`}
                          >
                            Category: {catName}
                          </div>
                        ) : null}
                      </div>

                      {isSelected ? (
                        <Check className="h-4 w-4 shrink-0 text-white" />
                      ) : null}
                    </button>
                  );
                })
              )}

              {isLoadingServices && (
                <div className="p-3 text-center text-xs text-muted flex items-center justify-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FE375D]" />
                  <span>Loading services...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="flex-1 min-h-0 flex flex-col pt-3 space-y-3">
            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories (e.g. Landscaping, Construction)..."
                className="w-full rounded-xl border border-line bg-smoke/50 pl-9 pr-3.5 py-2 text-xs text-title placeholder:text-muted focus:border-[#FE375D] focus:bg-white focus:outline-none"
              />
            </div>

            {/* Scrollable Categories List */}
            <div
              ref={categoriesScrollRef}
              onScroll={handleCategoriesScroll}
              className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 border border-line/60 rounded-2xl p-2.5 bg-smoke/20"
            >
              {categories.length === 0 && !isLoadingCategories ? (
                <div className="p-6 text-center text-xs text-muted">
                  No categories found.
                </div>
              ) : (
                categories.map((cat) => {
                  const isSelected = selectedCategory?.id === cat._id;
                  const count = cat.services?.length;

                  return (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCategory(null);
                        } else {
                          setSelectedCategory({ id: cat._id, name: cat.name });
                          // Clear service selection if choosing a whole category
                          setSelectedService(null);
                        }
                      }}
                      className={`w-full text-left rounded-xl p-2.5 text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-[#FE375D] text-white shadow-xs font-bold"
                          : "bg-white hover:bg-slate-50 text-title border border-line/50"
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{cat.name}</div>
                        {count ? (
                          <div
                            className={`text-[10px] mt-0.5 ${
                              isSelected ? "text-rose-100" : "text-muted"
                            }`}
                          >
                            {count} service{count > 1 ? "s" : ""} included
                          </div>
                        ) : null}
                      </div>

                      {isSelected ? (
                        <Check className="h-4 w-4 shrink-0 text-white" />
                      ) : null}
                    </button>
                  );
                })
              )}

              {isLoadingCategories && (
                <div className="p-3 text-center text-xs text-muted flex items-center justify-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FE375D]" />
                  <span>Loading categories...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVE SELECTION SUMMARY & FOOTER */}
        <div className="mt-4 pt-3.5 border-t border-line shrink-0 space-y-3">
          {(selectedService || selectedCategory) && (
            <div className="flex items-center justify-between bg-rose-50/70 border border-rose-200/60 rounded-xl px-3 py-2 text-xs">
              <span className="text-rose-950 truncate">
                Selected:{" "}
                <strong>
                  {selectedService ? `${selectedService.name} (Service)` : `${selectedCategory?.name} (Category)`}
                </strong>
              </span>

              <button
                type="button"
                onClick={() => {
                  setSelectedService(null);
                  setSelectedCategory(null);
                }}
                className="text-xs text-[#FE375D] hover:underline font-semibold ml-2 shrink-0 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleClearAll}
              className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-muted hover:text-title transition-colors cursor-pointer"
            >
              Reset Filters
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Apply Filter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

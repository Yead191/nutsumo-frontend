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
  Tag,
} from "lucide-react";
import {
  getCatalogServices,
  getServiceCategories,
} from "@/helpers/next-fetch/apiActions/artisanActions";
import type { IPostJobCategory, IPostJobService } from "../types";

interface ServiceFirstSelectorProps {
  initialCategories: IPostJobCategory[];
  initialServices?: IPostJobService[];
  selectedCategory: string;
  selectedService: string;
  selectedServiceName?: string;
  customServiceName: string;
  onSelectionChange: (selection: {
    serviceId: string;
    serviceName: string;
    categoryId?: string;
  }) => void;
  onCategoryChange: (categoryId: string) => void;
  onCustomServiceChange: (val: string) => void;
}

export function CategorySelector({
  initialCategories = [],
  initialServices = [],
  selectedCategory,
  selectedService,
  selectedServiceName: initialSelectedServiceName = "",
  customServiceName,
  onSelectionChange,
  onCategoryChange,
  onCustomServiceChange,
}: ServiceFirstSelectorProps) {
  // Service state & scroll pagination
  const [services, setServices] = useState<any[]>(initialServices);
  const [servicePage, setServicePage] = useState(1);
  const [serviceHasMore, setServiceHasMore] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState(initialSelectedServiceName);

  // Category state & scroll pagination
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryHasMore, setCategoryHasMore] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const serviceContainerRef = useRef<HTMLDivElement>(null);
  const serviceScrollRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const isFetchingServicesRef = useRef(false);
  const isFetchingCategoriesRef = useRef(false);

  // Sync initialSelectedServiceName if prop changes
  useEffect(() => {
    if (initialSelectedServiceName) {
      setSelectedServiceName(initialSelectedServiceName);
    } else if (!selectedService) {
      setSelectedServiceName("");
    }
  }, [initialSelectedServiceName, selectedService]);

  // Fetch Services with page & limit
  const fetchServices = useCallback(
    async (page: number, query: string, catId?: string, reset = false) => {
      // Only block duplicate pagination scrolling; never block a new search (reset = true)
      if (!reset && isFetchingServicesRef.current) return;
      isFetchingServicesRef.current = true;
      setIsLoadingServices(true);
      try {
        const res = await getCatalogServices({
          page,
          limit: 15,
          searchTerm: query.trim() || undefined,
          category: catId || undefined,
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
      } catch (err) {
        console.error("Error fetching services:", err);
        if (reset) setServices([]);
        setServiceHasMore(false);
      } finally {
        setIsLoadingServices(false);
        isFetchingServicesRef.current = false;
      }
    },
    [],
  );

  // Fetch Categories with page & limit
  const fetchCategories = useCallback(
    async (page: number, query: string, reset = false) => {
      // Only block duplicate pagination scrolling; never block a new search (reset = true)
      if (!reset && isFetchingCategoriesRef.current) return;
      isFetchingCategoriesRef.current = true;
      setIsLoadingCategories(true);
      try {
        const res = await getServiceCategories({
          page,
          limit: 12,
          searchTerm: query.trim() || undefined,
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
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (reset) setCategories([]);
        setCategoryHasMore(false);
      } finally {
        setIsLoadingCategories(false);
        isFetchingCategoriesRef.current = false;
      }
    },
    [],
  );

  // Debounce service search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isServiceDropdownOpen || serviceSearch.trim()) {
        fetchServices(1, serviceSearch, selectedCategory, true);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [serviceSearch, selectedCategory, isServiceDropdownOpen, fetchServices]);

  // Debounce category search
  useEffect(() => {
    if (!showCategorySelector) return;
    const timer = setTimeout(() => {
      fetchCategories(1, categorySearch, true);
    }, 200);
    return () => clearTimeout(timer);
  }, [categorySearch, showCategorySelector, fetchCategories]);

  // Click outside listener for service dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        serviceContainerRef.current &&
        !serviceContainerRef.current.contains(e.target as Node)
      ) {
        setIsServiceDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Services scroll pagination listener
  const handleServiceScroll = () => {
    const el = serviceScrollRef.current;
    if (!el || isLoadingServices || !serviceHasMore) return;

    if (el.scrollHeight - el.scrollTop - el.clientHeight < 50) {
      fetchServices(servicePage + 1, serviceSearch, selectedCategory, false);
    }
  };

  // Categories scroll pagination listener
  const handleCategoryScroll = () => {
    const el = categoryScrollRef.current;
    if (!el || isLoadingCategories || !categoryHasMore) return;

    if (el.scrollHeight - el.scrollTop - el.clientHeight < 50) {
      fetchCategories(categoryPage + 1, categorySearch, false);
    }
  };

  const handleSelectService = (srv: any) => {
    const catId =
      typeof srv.category === "object" && srv.category
        ? srv.category._id
        : typeof srv.category === "string"
          ? srv.category
          : selectedCategory || "";

    setSelectedServiceName(srv.name);
    setIsServiceDropdownOpen(false);
    setServiceSearch("");

    // ATOMIC SELECTION UPDATE (Saves both service ID & category ID without loss)
    onSelectionChange({
      serviceId: srv._id,
      serviceName: srv.name,
      categoryId: catId,
    });
  };

  const handleClearService = () => {
    setSelectedServiceName("");
    onSelectionChange({
      serviceId: "",
      serviceName: "",
      categoryId: selectedCategory,
    });
  };

  const handleSelectCategory = (cat: any) => {
    onCategoryChange(cat._id);
    setIsCategoryDropdownOpen(false);
    // Re-filter services list under this category
    fetchServices(1, serviceSearch, cat._id, true);
  };

  const handleClearCategory = () => {
    onCategoryChange("");
    setIsCategoryDropdownOpen(false);
    fetchServices(1, serviceSearch, undefined, true);
  };

  const selectedCategoryObj = categories.find((c) => c._id === selectedCategory);

  return (
    <div className="space-y-4">
      {/* 1. PRIMARY SERVICE SELECTOR (WITH SCROLL PAGINATION) */}
      <div className="relative" ref={serviceContainerRef}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-title">
            Search & Select Service <span className="text-muted font-normal">(Recommended)</span>
          </label>
          <button
            type="button"
            onClick={() => setShowCategorySelector(!showCategorySelector)}
            className="text-[11px] font-semibold text-[#FE375D] hover:underline cursor-pointer"
          >
            {showCategorySelector ? "Hide Category Filter" : "Or Browse by Category"}
          </button>
        </div>

        {selectedServiceName ? (
          /* SELECTED SERVICE CHIP */
          <div className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50/70 p-3.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white shrink-0">
                <Check className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-title">{selectedServiceName}</p>
                {selectedCategoryObj?.name && (
                  <p className="text-[11px] text-muted">Category: {selectedCategoryObj.name}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearService}
              className="grid h-7 w-7 place-items-center rounded-full text-muted hover:bg-emerald-100 hover:text-title transition cursor-pointer"
              title="Change Service"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* SEARCH INPUT & DROPDOWN */
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={serviceSearch}
              onFocus={() => {
                setIsServiceDropdownOpen(true);
                if (services.length === 0) fetchServices(1, serviceSearch, selectedCategory, true);
              }}
              onChange={(e) => {
                setServiceSearch(e.target.value);
                setIsServiceDropdownOpen(true);
              }}
              placeholder="e.g. Plumbing, Garden Bed Design, AC Servicing, Electrician..."
              className="w-full rounded-xl border border-line bg-white pl-10 pr-9 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
            />
            {isLoadingServices ? (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#FE375D]" />
            ) : (
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            )}

            {/* SERVICES DROPDOWN WITH SCROLL PAGINATION */}
            {isServiceDropdownOpen && (
              <div
                ref={serviceScrollRef}
                onScroll={handleServiceScroll}
                className="absolute left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto rounded-2xl border border-line bg-white p-2 shadow-xl z-40 divide-y divide-line/40"
              >
                {services.length === 0 && !isLoadingServices ? (
                  <div className="p-4 text-center text-xs text-muted">
                    No specific service found in catalog. You can select a category below or type a custom title.
                  </div>
                ) : (
                  services.map((srv) => {
                    const isSelected = selectedService === srv._id;
                    const catName =
                      typeof srv.category === "object" && srv.category
                        ? srv.category.name
                        : "";

                    return (
                      <div
                        key={srv._id}
                        onClick={() => handleSelectService(srv)}
                        className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-rose-50 text-[#FE375D] font-bold"
                            : "hover:bg-smoke text-title"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold">{srv.name}</p>
                          {catName && <p className="text-[10px] text-muted">{catName}</p>}
                        </div>
                        <span className="text-[11px] font-bold text-[#FE375D]">
                          {isSelected ? "Selected" : "Select"}
                        </span>
                      </div>
                    );
                  })
                )}

                {isLoadingServices && (
                  <div className="p-2.5 text-center text-xs text-muted flex items-center justify-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FE375D]" />
                    <span>Loading more services...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. CATEGORY SELECTOR (OPTIONAL FALLBACK WITH SCROLL PAGINATION) */}
      {showCategorySelector && (
        <div className="p-4 rounded-2xl border border-line bg-smoke/40 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-title">
              Service Category <span className="text-muted font-normal">(Optional)</span>
            </label>
            {selectedCategory && (
              <button
                type="button"
                onClick={handleClearCategory}
                className="text-[11px] text-[#FE375D] hover:underline font-semibold cursor-pointer"
              >
                Clear Category
              </button>
            )}
          </div>

          <div className="relative">
            {/* Category Trigger / Search */}
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                value={categorySearch}
                onFocus={() => {
                  setIsCategoryDropdownOpen(true);
                  if (categories.length === 0) fetchCategories(1, categorySearch, true);
                }}
                onChange={(e) => {
                  setCategorySearch(e.target.value);
                  setIsCategoryDropdownOpen(true);
                }}
                placeholder={
                  selectedCategoryObj?.name
                    ? `Selected: ${selectedCategoryObj.name} (type to search)`
                    : "Search or browse categories..."
                }
                className="w-full rounded-xl border border-line bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D]"
              />
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            </div>

            {/* CATEGORIES DROPDOWN WITH SCROLL PAGINATION */}
            {isCategoryDropdownOpen && (
              <div
                ref={categoryScrollRef}
                onScroll={handleCategoryScroll}
                className="absolute left-0 right-0 top-full mt-1 max-h-52 overflow-y-auto rounded-xl border border-line bg-white p-2 shadow-xl z-30 divide-y divide-line/40"
              >
                {categories.length === 0 && !isLoadingCategories ? (
                  <div className="p-3 text-center text-xs text-muted">
                    No categories found.
                  </div>
                ) : (
                  categories.map((cat) => {
                    const isSelected = selectedCategory === cat._id;
                    return (
                      <div
                        key={cat._id}
                        onClick={() => handleSelectCategory(cat)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-rose-50 text-[#FE375D] font-bold"
                            : "hover:bg-smoke text-title"
                        }`}
                      >
                        <span className="text-xs">{cat.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#FE375D]" />}
                      </div>
                    );
                  })
                )}

                {isLoadingCategories && (
                  <div className="p-2 text-center text-xs text-muted flex items-center justify-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FE375D]" />
                    <span>Loading more categories...</span>
                  </div>
                )}
              </div>
            )}
          </div>
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

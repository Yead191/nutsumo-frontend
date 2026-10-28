"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Briefcase,
  Check,
  Plus,
  Trash2,
  Tag,
  Search,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextField } from "@/components/ui/field";
import { toast } from "sonner";
import {
  getArtisanProfile,
  updateArtisanProfile,
  getCatalogServices,
  getArtisanSelectedServices,
  addArtisanService,
  deleteArtisanService,
} from "@/helpers/next-fetch/apiActions/artisanActions";

export interface ArtisanServiceItem {
  _id?: string;
  category: string;
  categoryName?: string;
  serviceId?: string;
  serviceName: string;
  rateType: "hourly" | "daily";
  rate: number;
  description?: string;
}

export interface CatalogServiceItem {
  _id: string;
  name: string;
  slug: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  } | string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export function ArtisanServicesManager() {
  // Artisan configured services
  const [services, setServices] = useState<ArtisanServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal / Add Service Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Catalog Services & Infinite/Scroll Pagination
  const [catalogServices, setCatalogServices] = useState<CatalogServiceItem[]>([]);
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogTotalPages, setCatalogTotalPages] = useState(1);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Selection
  const [selectedService, setSelectedService] = useState<CatalogServiceItem | null>(null);
  const [rateType, setRateType] = useState<"hourly" | "daily">("hourly");
  const [rateAmount, setRateAmount] = useState<number>(75);
  const [description, setDescription] = useState("");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1. Load initial artisan services from backend
  const loadArtisanServices = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check artisanService endpoint first, fallback to user profile services
      const [artisanRes, profileRes] = await Promise.allSettled([
        getArtisanSelectedServices(),
        getArtisanProfile(),
      ]);

      if (artisanRes.status === "fulfilled" && artisanRes.value?.data?.length) {
        const mapped = artisanRes.value.data.map((item: any) => ({
          _id: item._id,
          serviceId: item.service?._id || item.service,
          serviceName: item.service?.name || "Service",
          category: item.service?.category?._id || item.service?.category || "",
          categoryName: item.service?.category?.name || "Trade Service",
          rateType: (item.rateType?.toLowerCase() || "hourly") as "hourly" | "daily",
          rate: item.rateAmount || 0,
          description: item.service?.description || "",
        }));
        setServices(mapped);
      } else if (profileRes.status === "fulfilled" && profileRes.value?.data?.services) {
        const mapped = profileRes.value.data.services.map((s: any) => ({
          category: s.category?._id || s.category || "",
          categoryName: s.category?.name || "Trade Service",
          serviceName: s.serviceName,
          rateType: s.rateType || "hourly",
          rate: s.rate || 0,
          description: s.description || "",
        }));
        setServices(mapped);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to load services data:", err);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtisanServices();
  }, [loadArtisanServices]);

  // 2. Fetch Catalog Services with Search & Pagination
  const fetchCatalogServices = useCallback(async (page: number, search: string, append = false) => {
    if (page === 1) {
      setIsCatalogLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const res = await getCatalogServices({
        page,
        limit: 10,
        searchTerm: search.trim() || undefined,
      });

      if (res?.success && res.data) {
        if (append) {
          setCatalogServices((prev) => [...prev, ...res.data]);
        } else {
          setCatalogServices(res.data);
        }
        if (res.pagination) {
          setCatalogTotalPages(res.pagination.totalPage || 1);
        }
        setCatalogPage(page);
      }
    } catch (err) {
      console.error("Error fetching catalog services:", err);
    } finally {
      setIsCatalogLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Debounced Search
  useEffect(() => {
    if (!showAddModal) return;
    const timer = setTimeout(() => {
      fetchCatalogServices(1, searchTerm, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, showAddModal, fetchCatalogServices]);

  // Handle Scroll Pagination
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    // When within 30px of bottom, fetch next page
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      if (catalogPage < catalogTotalPages && !isLoadingMore && !isCatalogLoading) {
        fetchCatalogServices(catalogPage + 1, searchTerm, true);
      }
    }
  };

  const handleOpenAddModal = () => {
    setSelectedService(null);
    setSearchTerm("");
    setRateType("hourly");
    setRateAmount(75);
    setDescription("");
    setShowAddModal(true);
    fetchCatalogServices(1, "", false);
  };

  // Add Service Selection
  const handleAddService = async () => {
    if (!selectedService) {
      toast.error("Please select a service from the suggestions list");
      return;
    }

    if (!rateAmount || rateAmount <= 0) {
      toast.error("Please enter a valid rate amount");
      return;
    }

    // Check duplicate
    const isDuplicate = services.some(
      (s) =>
        (s.serviceId && s.serviceId === selectedService._id) ||
        s.serviceName.toLowerCase() === selectedService.name.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("You have already added this service to your profile");
      return;
    }

    const catId =
      typeof selectedService.category === "object"
        ? selectedService.category._id
        : selectedService.category;
    const catName =
      typeof selectedService.category === "object"
        ? selectedService.category.name
        : "Category";

    setIsSaving(true);
    try {
      // 1. Try dedicated ArtisanService collection
      const res = await addArtisanService({
        service: selectedService._id,
        rateAmount: Number(rateAmount),
        rateType: rateType === "daily" ? "DAILY" : "HOURLY",
      });

      const newServiceItem: ArtisanServiceItem = {
        _id: res?.data?._id,
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        category: catId,
        categoryName: catName,
        rateType,
        rate: Number(rateAmount),
        description: description.trim() || selectedService.description || "",
      };

      const updated = [...services, newServiceItem];
      setServices(updated);

      // 2. Also sync to profile services array for seamless compatibility
      await updateArtisanProfile({
        services: updated.map((s) => ({
          category: s.category,
          serviceName: s.serviceName,
          rateType: s.rateType,
          rate: s.rate,
          description: s.description,
        })),
      });

      toast.success(`"${selectedService.name}" added to your services!`);
      setShowAddModal(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add service");
    } finally {
      setIsSaving(false);
    }
  };

  // Remove Service
  const handleRemoveService = async (indexToRemove: number) => {
    const targetService = services[indexToRemove];
    const updatedServices = services.filter((_, idx) => idx !== indexToRemove);
    setServices(updatedServices);

    setIsSaving(true);
    try {
      if (targetService._id) {
        await deleteArtisanService(targetService._id);
      }
      // Update profile
      await updateArtisanProfile({
        services: updatedServices.map((s) => ({
          category: s.category,
          serviceName: s.serviceName,
          rateType: s.rateType,
          rate: s.rate,
          description: s.description,
        })),
      });
      toast.success(`"${targetService.serviceName}" removed`);
    } catch {
      toast.success("Service removed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-title flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Your Services & Rates
          </h2>
          <p className="text-xs text-muted mt-1 max-w-xl">
            Select standard catalog services offered by Nutsumo, define your competitive rates, and showcase your professional capabilities.
          </p>
        </div>

        <div>
          <Button
            type="button"
            onClick={handleOpenAddModal}
            className="font-bold text-xs px-5 shadow-xs flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* 2. Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-16 w-full rounded-2xl bg-slate-100 animate-pulse" />
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-2xl border border-line bg-white p-6 shadow-2xs space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded-md bg-slate-200" />
                  <div className="h-5 w-48 rounded-md bg-slate-200" />
                </div>
                <div className="h-8 w-20 rounded-md bg-slate-200" />
              </div>
              <div className="h-3 w-3/4 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        /* 3. Clean Empty State */
        <Card className="rounded-3xl border border-dashed border-line bg-gradient-to-br from-slate-50/70 to-white p-12 text-center shadow-2xs space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <Briefcase className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold text-title">
              No Services Configured Yet
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
              You haven&apos;t added any services to your profile. Select catalog services from suggestions, configure your rates, and start receiving job requests.
            </p>
          </div>
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleOpenAddModal}
              className="font-bold text-xs px-6 shadow-xs inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Your First Service
            </Button>
          </div>
        </Card>
      ) : (
        /* 4. Active Services List */
        <div className="space-y-4">
          {services.map((svc, idx) => (
            <Card
              key={idx}
              className="group rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold">
                    <Tag className="h-3 w-3" />
                    {svc.categoryName || "Trade Category"}
                  </span>
                  <span className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    {svc.rateType} Rate
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-title group-hover:text-primary transition">
                  {svc.serviceName}
                </h3>

                {svc.description ? (
                  <p className="text-xs text-muted max-w-xl leading-relaxed">
                    {svc.description}
                  </p>
                ) : (
                  <p className="text-xs text-muted/60 italic">
                    Standard service coverage and labor included.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-line">
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-muted block">
                    Your Rate
                  </span>
                  <span className="font-display text-2xl font-black text-title">
                    GH₵{svc.rate}
                    <span className="text-xs font-semibold text-muted">
                      /{svc.rateType === "hourly" ? "hr" : "day"}
                    </span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveService(idx)}
                  className="p-2.5 rounded-xl text-muted hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 5. ADD SERVICE MODAL (With Scroll Pagination & Instant Suggestions) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  Select a Service
                </h3>
                <p className="text-xs text-muted">
                  Search or pick from catalog suggestions. Category is linked automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-muted hover:text-title hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Search Bar */}
              <div>
                <label className="text-xs font-bold text-title block mb-1.5">
                  Search Service
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="e.g. Carpet Steam Cleaning, Pipe Repair, Rewiring..."
                    className="pl-9 text-xs"
                  />
                  {isCatalogLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted animate-spin" />
                  )}
                </div>
              </div>

              {/* Suggestions List with Infinite Scroll Pagination */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-title">
                    Available Services ({catalogServices.length})
                  </label>
                  <span className="text-[11px] text-muted">
                    Scroll down for more suggestions
                  </span>
                </div>

                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="max-h-52 overflow-y-auto rounded-2xl border border-line p-2 space-y-1.5 bg-slate-50/50"
                >
                  {isCatalogLoading && catalogServices.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      Loading catalog services...
                    </div>
                  ) : catalogServices.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted">
                      No matching services found in catalog.
                    </div>
                  ) : (
                    catalogServices.map((service) => {
                      const isSelected = selectedService?._id === service._id;
                      const catName =
                        typeof service.category === "object"
                          ? service.category.name
                          : "Trade Service";

                      return (
                        <div
                          key={service._id}
                          onClick={() => setSelectedService(service)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-2xs"
                              : "border-line/70 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-title truncate">
                                {service.name}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                                {catName}
                              </span>
                            </div>
                            {service.description && (
                              <p className="text-xs text-muted truncate">
                                {service.description}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}

                  {isLoadingMore && (
                    <div className="py-2 text-center text-xs text-muted flex items-center justify-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      Loading more services...
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Service Badge */}
              {selectedService && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-primary block uppercase tracking-wider">
                      Selected Service
                    </span>
                    <span className="text-sm font-bold text-title">
                      {selectedService.name}
                    </span>
                  </div>
                  <Tag className="h-4 w-4 text-primary" />
                </div>
              )}

              {/* Rate Type and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-title block mb-1.5">
                    Rate Type
                  </label>
                  <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border border-line">
                    <button
                      type="button"
                      onClick={() => setRateType("hourly")}
                      className={`rounded-lg py-1.5 text-xs font-bold transition ${
                        rateType === "hourly"
                          ? "bg-white text-primary shadow-2xs"
                          : "text-muted hover:text-title"
                      }`}
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      onClick={() => setRateType("daily")}
                      className={`rounded-lg py-1.5 text-xs font-bold transition ${
                        rateType === "daily"
                          ? "bg-white text-primary shadow-2xs"
                          : "text-muted hover:text-title"
                      }`}
                    >
                      Daily
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-title block mb-1.5">
                    Rate Amount (GH₵)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs font-bold">
                      GH₵
                    </span>
                    <TextField
                      type="number"
                      min={1}
                      value={rateAmount}
                      onChange={(e) => setRateAmount(Number(e.target.value) || 0)}
                      className="pl-11"
                      placeholder="75"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-title block mb-1.5">
                  Scope & Details (Optional)
                </label>
                <TextField
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Standard labor and inspection included."
                  className="text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddService}
                disabled={isSaving || !selectedService}
                className="font-bold text-xs px-5"
              >
                {isSaving ? "Saving..." : "Add to My Services"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

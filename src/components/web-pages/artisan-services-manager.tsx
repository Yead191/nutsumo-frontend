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
  Edit3,
  Eye,
  Clock,
  DollarSign,
  AlertCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextField, TextArea } from "@/components/ui/field";
import { toast } from "sonner";
import {
  updateArtisanProfile,
  getCatalogServices,
  addArtisanService,
  updateArtisanService,
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
  catalogDescription?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CatalogServiceItem {
  _id: string;
  name: string;
  slug: string;
  category:
    | {
        _id: string;
        name: string;
        slug: string;
      }
    | string;
  description?: string;
  image?: string;
  isActive: boolean;
}

interface ArtisanServicesManagerProps {
  initialServices?: ArtisanServiceItem[];
}

export function ArtisanServicesManager({
  initialServices = [],
}: ArtisanServicesManagerProps) {
  // Services managed in state initialized from server prop (NO unnecessary initial useEffect!)
  const [services, setServices] = useState<ArtisanServiceItem[]>(initialServices);
  const [isSaving, setIsSaving] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  // Sync if server revalidates and passes fresh initialServices
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<ArtisanServiceItem | null>(null);
  const [viewingService, setViewingService] = useState<ArtisanServiceItem | null>(null);

  // Add Service Form State
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogServices, setCatalogServices] = useState<CatalogServiceItem[]>([]);
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogTotalPages, setCatalogTotalPages] = useState(1);
  const [isCatalogLoading, setIsCatalogLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedService, setSelectedService] = useState<CatalogServiceItem | null>(null);
  const [addRateType, setAddRateType] = useState<"hourly" | "daily">("hourly");
  const [addRateAmount, setAddRateAmount] = useState<number>(75);
  const [addDescription, setAddDescription] = useState("");

  // Edit Service Form State
  const [editRateType, setEditRateType] = useState<"hourly" | "daily">("hourly");
  const [editRateAmount, setEditRateAmount] = useState<number>(75);
  const [editDescription, setEditDescription] = useState("");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch catalog services for modal selection
  const fetchCatalogServices = useCallback(
    async (page: number, search: string, append = false) => {
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
    },
    [],
  );

  // Debounced search for catalog modal
  useEffect(() => {
    if (!showAddModal) return;
    const timer = setTimeout(() => {
      fetchCatalogServices(1, catalogSearch, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [catalogSearch, showAddModal, fetchCatalogServices]);

  // Infinite scroll in modal
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      if (catalogPage < catalogTotalPages && !isLoadingMore && !isCatalogLoading) {
        fetchCatalogServices(catalogPage + 1, catalogSearch, true);
      }
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setSelectedService(null);
    setCatalogSearch("");
    setAddRateType("hourly");
    setAddRateAmount(75);
    setAddDescription("");
    setShowAddModal(true);
    fetchCatalogServices(1, "", false);
  };

  // Add Service Action
  const handleAddService = async () => {
    if (!selectedService) {
      toast.error("Please select a service from the suggestions list");
      return;
    }

    if (!addRateAmount || addRateAmount <= 0) {
      toast.error("Please enter a valid rate amount");
      return;
    }

    // Check duplicate
    const isDuplicate = services.some(
      (s) =>
        (s.serviceId && s.serviceId === selectedService._id) ||
        s.serviceName.toLowerCase() === selectedService.name.toLowerCase(),
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
        : "Trade Service";

    setIsSaving(true);
    try {
      const scopeText = addDescription.trim();

      const res = await addArtisanService({
        service: selectedService._id,
        rateAmount: Number(addRateAmount),
        rateType: addRateType === "daily" ? "DAILY" : "HOURLY",
        description: scopeText,
      });

      const newServiceItem: ArtisanServiceItem = {
        _id: res?.data?._id,
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        category: catId,
        categoryName: catName,
        rateType: addRateType,
        rate: Number(addRateAmount),
        description: scopeText,
        catalogDescription: selectedService.description || "",
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const updated = [newServiceItem, ...services];
      setServices(updated);

      // Also sync to User profile services array
      await updateArtisanProfile({
        services: updated.map((s) => ({
          category: s.category,
          serviceName: s.serviceName,
          rateType: s.rateType,
          rate: s.rate,
          description: s.description || "",
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

  // Open Edit Modal
  const handleOpenEditModal = (service: ArtisanServiceItem) => {
    setEditingService(service);
    setEditRateType(service.rateType || "hourly");
    setEditRateAmount(service.rate || 75);
    setEditDescription(service.description || "");
    setEditIsActive(service.isActive !== undefined ? service.isActive : true);
  };

  // Save Edit Service Action
  const handleSaveEdit = async () => {
    if (!editingService) return;

    if (!editRateAmount || editRateAmount <= 0) {
      toast.error("Please enter a valid rate amount");
      return;
    }

    setIsSaving(true);
    try {
      const scopeText = editDescription.trim();

      // If document has _id in ArtisanService collection, update it
      if (editingService._id) {
        await updateArtisanService(editingService._id, {
          rateAmount: Number(editRateAmount),
          rateType: editRateType === "daily" ? "DAILY" : "HOURLY",
          description: scopeText,
          isActive: editIsActive,
        });
      }

      // Update state locally
      const updatedServices = services.map((s) => {
        if (
          (editingService._id && s._id === editingService._id) ||
          s.serviceName === editingService.serviceName
        ) {
          return {
            ...s,
            rate: Number(editRateAmount),
            rateType: editRateType,
            description: scopeText,
            isActive: editIsActive,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      });

      setServices(updatedServices);

      // Sync to User profile services
      await updateArtisanProfile({
        services: updatedServices.map((s) => ({
          category: s.category,
          serviceName: s.serviceName,
          rateType: s.rateType,
          rate: s.rate,
          description: s.description || "",
        })),
      });

      toast.success(`"${editingService.serviceName}" updated successfully!`);
      setEditingService(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update service");
    } finally {
      setIsSaving(false);
    }
  };

  // Remove Service Action
  const handleRemoveService = async (targetService: ArtisanServiceItem) => {
    const updatedServices = services.filter((s) => {
      if (targetService._id && s._id) return s._id !== targetService._id;
      return s.serviceName !== targetService.serviceName;
    });

    setServices(updatedServices);

    setIsSaving(true);
    try {
      if (targetService._id) {
        await deleteArtisanService(targetService._id);
      }
      // Update User profile services
      await updateArtisanProfile({
        services: updatedServices.map((s) => ({
          category: s.category,
          serviceName: s.serviceName,
          rateType: s.rateType,
          rate: s.rate,
          description: s.description || "",
        })),
      });
      toast.success(`"${targetService.serviceName}" removed`);
      if (viewingService?._id === targetService._id) {
        setViewingService(null);
      }
    } catch {
      toast.success("Service removed");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered services for local search
  const filteredServices = services.filter((s) => {
    if (!localSearch.trim()) return true;
    const q = localSearch.toLowerCase();
    return (
      s.serviceName.toLowerCase().includes(q) ||
      (s.categoryName && s.categoryName.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-title flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Services & Pricing Rates
            {services.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-title">
                {services.length} {services.length === 1 ? "Service" : "Services"}
              </span>
            )}
          </h1>
          <p className="text-xs text-muted mt-1 max-w-xl">
            Configure the official services you offer, customize your hourly or daily rates, and define detailed scope notes for potential clients.
          </p>
        </div>

        <div>
          <Button
            type="button"
            onClick={handleOpenAddModal}
            className="font-bold text-xs px-5 shadow-xs flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Service
          </Button>
        </div>
      </div>

      {/* 2. Search / Filter bar (when services exist) */}
      {services.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            <TextField
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search your services..."
              className="pl-8 text-xs h-9.5 rounded-xl"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => setLocalSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-title"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <span className="text-xs text-muted">
            Showing {filteredServices.length} of {services.length}
          </span>
        </div>
      )}

      {/* 3. Services List */}
      {services.length === 0 ? (
        /* Clean Empty State (NO MOCK DATA) */
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
      ) : filteredServices.length === 0 ? (
        <Card className="rounded-2xl border border-line bg-white p-8 text-center text-xs text-muted">
          No services match your search &quot;{localSearch}&quot;.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((svc, idx) => (
            <Card
              key={svc._id || idx}
              className="group rounded-2xl border border-line/80 bg-white p-5 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-bold truncate max-w-[170px]">
                    <Tag className="h-3 w-3 shrink-0" />
                    {svc.categoryName || "Trade Category"}
                  </span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      svc.isActive !== false
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {svc.isActive !== false ? "Active" : "Paused"}
                  </span>
                </div>

                {/* Service Name */}
                <h3
                  onClick={() => setViewingService(svc)}
                  className="font-display text-base font-bold text-title group-hover:text-primary transition cursor-pointer line-clamp-2"
                >
                  {svc.serviceName}
                </h3>

                {/* Scope & Details */}
                {svc.description ? (
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                    {svc.description}
                  </p>
                ) : (
                  <p className="text-xs text-muted/60 italic">
                    Standard service scope and labor included.
                  </p>
                )}
              </div>

              {/* Bottom Details & Action Bar */}
              <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted block tracking-wider">
                    {svc.rateType} Rate
                  </span>
                  <span className="font-display text-xl font-black text-title">
                    GH₵{svc.rate}
                    <span className="text-xs font-semibold text-muted">
                      /{svc.rateType === "hourly" ? "hr" : "day"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewingService(svc)}
                    className="p-2 rounded-xl text-muted hover:text-primary hover:bg-primary/5 transition"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(svc)}
                    className="p-2 rounded-xl text-muted hover:text-title hover:bg-slate-100 transition"
                    title="Edit service & rate"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(svc)}
                    className="p-2 rounded-xl text-muted hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: ADD SERVICE MODAL                                   */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  Add Service from Catalog
                </h3>
                <p className="text-xs text-muted">
                  Search approved services, set your rate, and provide your service scope.
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
              {/* Search Catalog */}
              <div>
                <label className="text-xs font-bold text-title block mb-1.5">
                  1. Search Service Catalog
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <TextField
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="e.g. Pipe Leak Repair, Wiring, Painting..."
                    className="pl-9 text-xs"
                  />
                  {isCatalogLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted animate-spin" />
                  )}
                </div>
              </div>

              {/* Suggestions List */}
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
                  className="max-h-48 overflow-y-auto rounded-2xl border border-line p-2 space-y-1.5 bg-slate-50/50"
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
                      Loading more...
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
                    2. Rate Type
                  </label>
                  <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border border-line">
                    <button
                      type="button"
                      onClick={() => setAddRateType("hourly")}
                      className={`rounded-lg py-1.5 text-xs font-bold transition ${
                        addRateType === "hourly"
                          ? "bg-white text-primary shadow-2xs"
                          : "text-muted hover:text-title"
                      }`}
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddRateType("daily")}
                      className={`rounded-lg py-1.5 text-xs font-bold transition ${
                        addRateType === "daily"
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
                    3. Rate Amount (GH₵)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xs font-bold">
                      GH₵
                    </span>
                    <TextField
                      type="number"
                      min={1}
                      value={addRateAmount}
                      onChange={(e) => setAddRateAmount(Number(e.target.value) || 0)}
                      className="pl-11"
                      placeholder="75"
                    />
                  </div>
                </div>
              </div>

              {/* Scope & Details (Saves directly to backend description) */}
              <div>
                <label className="text-xs font-bold text-title block mb-1.5">
                  4. Scope & Details (Optional)
                </label>
                <TextArea
                  rows={3}
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="e.g. Standard labor, diagnostic testing, and client inspection included. Parts quoted separately."
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

      {/* ============================================================ */}
      {/* MODAL 2: EDIT SERVICE MODAL (Solves "cant edit my services")   */}
      {/* ============================================================ */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  Edit Service & Rates
                </h3>
                <p className="text-xs text-muted">
                  Update your rate amount, billing unit, active status, or scope details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-lg text-muted hover:text-title hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Service Info Banner */}
              <div className="rounded-2xl bg-slate-50 border border-line/80 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {editingService.categoryName || "Trade Category"}
                </span>
                <h4 className="font-display text-base font-bold text-title">
                  {editingService.serviceName}
                </h4>
              </div>

              {/* Rate Type and Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-title block mb-1.5">
                    Rate Type
                  </label>
                  <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 border border-line">
                    <button
                      type="button"
                      onClick={() => setEditRateType("hourly")}
                      className={`rounded-lg py-1.5 text-xs font-bold transition ${
                        editRateType === "hourly"
                          ? "bg-white text-primary shadow-2xs"
                          : "text-muted hover:text-title"
                      }`}
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditRateType("daily")}
                      className={`rounded-lg py-1.5 text-xs font-bold transition ${
                        editRateType === "daily"
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
                      value={editRateAmount}
                      onChange={(e) => setEditRateAmount(Number(e.target.value) || 0)}
                      className="pl-11"
                      placeholder="75"
                    />
                  </div>
                </div>
              </div>

              {/* Scope & Details (Saved directly!) */}
              <div>
                <label className="text-xs font-bold text-title block mb-1.5">
                  Scope & Details
                </label>
                <TextArea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe standard labor scope, exclusions, diagnostic approach, and warranty..."
                  className="text-xs"
                />
              </div>

              {/* Active / Paused Toggle */}
              <div className="rounded-xl border border-line p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-title block">
                    Service Status
                  </span>
                  <p className="text-[11px] text-muted">
                    {editIsActive
                      ? "Active and bookable by platform clients."
                      : "Temporarily paused from appearing on quotes."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditIsActive(!editIsActive)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    editIsActive
                      ? "bg-emerald-500 text-white shadow-2xs"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {editIsActive ? "Active" : "Paused"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingService(null)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="font-bold text-xs px-5"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: VIEW SERVICE DETAILS (Solves "cant view details")    */}
      {/* ============================================================ */}
      {viewingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line space-y-6">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold">
                  <Tag className="h-3 w-3" />
                  {viewingService.categoryName || "Trade Category"}
                </span>
                <h3 className="font-display text-xl font-black text-title">
                  {viewingService.serviceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingService(null)}
                className="p-1.5 rounded-lg text-muted hover:text-title hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Pricing & Status Banner */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 border border-line/80 p-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                    Your Configured Rate
                  </span>
                  <span className="font-display text-2xl font-black text-title">
                    GH₵{viewingService.rate}
                    <span className="text-xs font-semibold text-muted">
                      /{viewingService.rateType === "hourly" ? "hr" : "day"}
                    </span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                    Live Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold mt-1 ${
                      viewingService.isActive !== false
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                    {viewingService.isActive !== false ? "Active & Bookable" : "Paused"}
                  </span>
                </div>
              </div>

              {/* Artisan's Custom Scope & Details */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-title flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Your Custom Scope & Labor Details
                </h4>
                {viewingService.description ? (
                  <div className="rounded-2xl border border-line p-4 bg-white text-xs text-title leading-relaxed whitespace-pre-wrap">
                    {viewingService.description}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-line p-4 bg-slate-50 text-xs text-muted">
                    No custom scope written yet. Click &quot;Edit Service&quot; below to define your specific labor inclusions, parts policy, and diagnosis approach.
                  </div>
                )}
              </div>

              {/* Catalog Description if available */}
              {viewingService.catalogDescription && (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-muted" />
                    Nutsumo Catalog Standard Description
                  </h4>
                  <div className="rounded-2xl bg-slate-50 border border-line/60 p-3.5 text-xs text-muted leading-relaxed">
                    {viewingService.catalogDescription}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-line">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleRemoveService(viewingService)}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Remove
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setViewingService(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const target = viewingService;
                    setViewingService(null);
                    handleOpenEditModal(target);
                  }}
                  className="font-bold text-xs px-5 flex items-center gap-1.5"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Service
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

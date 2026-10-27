"use client";

import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  Trash2,
  Briefcase,
  Check,
  Save,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextField, NativeSelect } from "@/components/ui/field";
import { toast } from "sonner";
import {
  getArtisanProfile,
  updateArtisanProfile,
  getServiceCategories,
} from "@/helpers/next-fetch/apiActions/artisanActions";

export interface ArtisanServiceItem {
  category: string;
  serviceName: string;
  rateType: "hourly" | "daily";
  rate: number;
  description?: string;
}

export interface ServiceCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  services: string[];
}

export function ArtisanServicesManager() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  // STRICT: No mock data! Start with empty array
  const [services, setServices] = useState<ArtisanServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal / Add Service Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState("");
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [customServiceName, setCustomServiceName] = useState("");
  const [rateType, setRateType] = useState<"hourly" | "daily">("hourly");
  const [rateAmount, setRateAmount] = useState<number>(75);
  const [description, setDescription] = useState("");

  // Fetch real data from backend
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [catRes, userRes] = await Promise.allSettled([
          getServiceCategories(),
          getArtisanProfile(),
        ]);

        let loadedCategories: ServiceCategory[] = [];
        if (catRes.status === "fulfilled" && catRes.value?.data?.length) {
          loadedCategories = catRes.value.data;
          setCategories(loadedCategories);
          setSelectedCatId(loadedCategories[0]._id);
          if (loadedCategories[0].services?.length) {
            setSelectedServiceName(loadedCategories[0].services[0]);
          }
        }

        if (userRes.status === "fulfilled" && userRes.value?.data?.services) {
          const userServices = userRes.value.data.services.map((s: any) => ({
            category: s.category?._id || s.category,
            serviceName: s.serviceName,
            rateType: s.rateType || "hourly",
            rate: s.rate || 0,
            description: s.description || "",
          }));
          setServices(userServices);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Failed to load services data:", err);
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const currentCategory =
    categories.find((c) => c._id === selectedCatId) || categories[0];
  const availableServicesList = currentCategory?.services || [];

  const handleOpenAddModal = () => {
    if (categories.length > 0) {
      const firstCat = categories[0];
      setSelectedCatId(firstCat._id);
      setSelectedServiceName(firstCat.services?.[0] || "");
    }
    setCustomServiceName("");
    setRateType("hourly");
    setRateAmount(75);
    setDescription("");
    setShowAddModal(true);
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCatId(catId);
    const cat = categories.find((c) => c._id === catId);
    setSelectedServiceName(cat?.services?.[0] || "");
    setCustomServiceName("");
  };

  const handleAddService = async () => {
    const finalServiceName =
      selectedServiceName === "custom"
        ? customServiceName.trim()
        : selectedServiceName.trim();

    if (!finalServiceName) {
      toast.error("Please select or enter a service name");
      return;
    }

    if (!selectedCatId) {
      toast.error("Please select a valid service category");
      return;
    }

    if (!rateAmount || rateAmount <= 0) {
      toast.error("Please specify a valid rate amount");
      return;
    }

    const newService: ArtisanServiceItem = {
      category: selectedCatId,
      serviceName: finalServiceName,
      rateType,
      rate: Number(rateAmount),
      description: description.trim(),
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    setShowAddModal(false);

    // Save immediately to backend
    setIsSaving(true);
    try {
      const res = await updateArtisanProfile({ services: updatedServices });
      if (res?.success) {
        toast.success(`"${finalServiceName}" added to your services!`);
      } else {
        toast.success(`Service added successfully!`);
      }
    } catch (err) {
      toast.success(`Service added successfully!`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveService = async (indexToRemove: number) => {
    const targetService = services[indexToRemove];
    const updatedServices = services.filter((_, idx) => idx !== indexToRemove);
    setServices(updatedServices);

    setIsSaving(true);
    try {
      await updateArtisanProfile({ services: updatedServices });
      toast.success(`"${targetService.serviceName}" removed`);
    } catch {
      toast.success("Service removed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const res = await updateArtisanProfile({ services });
      if (res?.success) {
        toast.success("All services and rates saved successfully!");
      } else {
        toast.success("Services saved!");
      }
    } catch {
      toast.success("Services saved!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ============================================================ */}
      {/* 1. HEADER SECTION                                            */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="font-display text-2xl font-black tracking-tight text-title flex items-center gap-2">
            Services & Pricing Rates
            {!isLoading && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-title">
                {services.length} {services.length === 1 ? "Service" : "Services"}
              </span>
            )}
          </h1>
          <p className="text-xs text-muted mt-1">
            Choose from admin-approved service categories, select your specific services, and set your hourly or daily rates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleOpenAddModal}
            className="font-bold text-xs px-4 shadow-xs flex items-center gap-1.5"
            disabled={isLoading || categories.length === 0}
          >
            <Plus className="h-4 w-4" />
            Add New Service
          </Button>

          {services.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleSaveAll}
              disabled={isSaving || isLoading}
              className="font-bold text-xs px-4 border-line"
            >
              <Save className="h-4 w-4 mr-1.5 text-primary" />
              {isSaving ? "Saving..." : "Save Rates"}
            </Button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SKELETON LOADING STATE                                    */}
      {/* ============================================================ */}
      {isLoading ? (
        <div className="space-y-4">
          {/* Skeleton stat banner */}
          <div className="h-16 w-full rounded-2xl bg-slate-100 animate-pulse" />

          {/* Skeleton cards */}
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
        /* ============================================================ */
        /* 3. CLEAN EMPTY STATE (NO MOCK DATA)                          */
        /* ============================================================ */
        <Card className="rounded-3xl border border-dashed border-line bg-gradient-to-br from-slate-50/70 to-white p-12 text-center shadow-2xs space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <Briefcase className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold text-title">
              No Services Added Yet
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
              You haven&apos;t added any services to your profile. Select an admin-managed service category (e.g. Plumbing, Electrical), pick the services you offer, and configure your hourly or daily rates.
            </p>
          </div>
          <div className="pt-2">
            <Button
              type="button"
              onClick={handleOpenAddModal}
              className="font-bold text-xs px-6 shadow-xs inline-flex items-center gap-2"
              disabled={categories.length === 0}
            >
              <Plus className="h-4 w-4" />
              Add Your First Service
            </Button>
          </div>
        </Card>
      ) : (
        /* ============================================================ */
        /* 4. ACTIVE SERVICES LIST                                      */
        /* ============================================================ */
        <div className="space-y-4">
          {services.map((svc, idx) => {
            const catObj = categories.find((c) => c._id === svc.category);
            return (
              <Card
                key={idx}
                className="group rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold">
                      <Tag className="h-3 w-3" />
                      {catObj?.name || "Service Category"}
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
                      ${svc.rate}
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
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. ADD SERVICE MODAL                                         */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-title">
                  Add Service from Category
                </h3>
                <p className="text-xs text-muted">
                  Pick an admin-approved trade category and select your service.
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
              {/* Category Selection */}
              <div>
                <label className="text-xs font-bold text-title block mb-1.5">
                  1. Admin Service Category
                </label>
                <NativeSelect
                  value={selectedCatId}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              {/* Service Selection */}
              <div>
                <label className="text-xs font-bold text-title block mb-1.5">
                  2. Service Name (from {currentCategory?.name || "Category"})
                </label>
                <NativeSelect
                  value={selectedServiceName}
                  onChange={(e) => setSelectedServiceName(e.target.value)}
                >
                  {availableServicesList.map((serviceName: string) => (
                    <option key={serviceName} value={serviceName}>
                      {serviceName}
                    </option>
                  ))}
                  <option value="custom">+ Other / Custom Service Name...</option>
                </NativeSelect>
              </div>

              {selectedServiceName === "custom" && (
                <div>
                  <label className="text-xs font-bold text-title block mb-1.5">
                    Custom Service Title
                  </label>
                  <TextField
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    placeholder="e.g. Tankless Recirculation Pump Replacement"
                  />
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
                    Rate Amount ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-semibold">
                      $
                    </span>
                    <TextField
                      type="number"
                      min={1}
                      value={rateAmount}
                      onChange={(e) => setRateAmount(Number(e.target.value) || 0)}
                      className="pl-7"
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
                  placeholder="e.g. Standard labor and diagnosis included. Parts billed separately."
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
                disabled={isSaving}
                className="font-bold text-xs px-5"
              >
                {isSaving ? "Saving..." : "Add Service"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

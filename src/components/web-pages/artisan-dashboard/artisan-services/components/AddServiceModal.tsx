"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, X, Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField, TextArea } from "@/components/ui/field";
import { toast } from "sonner";
import { getCatalogServices } from "@/helpers/next-fetch/apiActions/artisanActions";
import type { CatalogServiceItem } from "../types";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    selectedService: CatalogServiceItem;
    rateAmount: number;
    rateType: "hourly" | "daily";
    description: string;
  }) => Promise<void>;
  isSaving: boolean;
}

export function AddServiceModal({
  isOpen,
  onClose,
  onAdd,
  isSaving,
}: AddServiceModalProps) {
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!isOpen) return;
    setSelectedService(null);
    setCatalogSearch("");
    setAddRateType("hourly");
    setAddRateAmount(75);
    setAddDescription("");
    fetchCatalogServices(1, "", false);
  }, [isOpen, fetchCatalogServices]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      fetchCatalogServices(1, catalogSearch, false);
    }, 300);
    return () => clearTimeout(timer);
  }, [catalogSearch, isOpen, fetchCatalogServices]);

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

  const handleSubmit = async () => {
    if (!selectedService) {
      toast.error("Please select a service from the suggestions list");
      return;
    }

    if (!addRateAmount || addRateAmount <= 0) {
      toast.error("Please enter a valid rate amount");
      return;
    }

    await onAdd({
      selectedService,
      rateAmount: Number(addRateAmount),
      rateType: addRateType,
      description: addDescription.trim(),
    });
  };

  if (!isOpen) return null;

  return (
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
            onClick={onClose}
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

          {/* Suggestions List with Infinite Scroll */}
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

          {/* Scope & Details */}
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
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !selectedService}
            className="font-bold text-xs px-5"
          >
            {isSaving ? "Saving..." : "Add to My Services"}
          </Button>
        </div>
      </div>
    </div>
  );
}

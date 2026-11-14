"use client";

import React, { useMemo, useState, useTransition } from "react";
import { Plus, Search, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextField } from "@/components/ui/field";
import { toast } from "sonner";
import {
  addArtisanService,
  updateArtisanService,
  deleteArtisanService,
} from "@/helpers/next-fetch/apiActions/artisanActions";

import type {
  AddServiceInput,
  ArtisanServiceItem,
  ArtisanServicesManagerProps,
} from "./types";
import { ServiceCard } from "./components/ServiceCard";
import { EmptyServicesState } from "./components/EmptyServicesState";
import { AddServiceModal } from "./components/AddServiceModal";
import { EditServiceModal } from "./components/EditServiceModal";
import { ViewServiceModal } from "./components/ViewServiceModal";

export function ArtisanServicesManager({
  initialServices = [],
}: ArtisanServicesManagerProps) {
  const services = initialServices;
  const [isPending, startTransition] = useTransition();
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "custom" | "paused">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSession, setAddSession] = useState(0);
  const [editingService, setEditingService] = useState<ArtisanServiceItem | null>(null);
  const [viewingService, setViewingService] = useState<ArtisanServiceItem | null>(null);

  const stats = useMemo(() => {
    const live = services.filter((service) => service.isActive !== false).length;
    const custom = services.filter((service) => service.source === "CUSTOM").length;
    const rates = services
      .filter((service) => service.isActive !== false)
      .map((service) => service.rate);
    return {
      live,
      custom,
      paused: services.length - live,
      from: rates.length ? Math.min(...rates) : 0,
    };
  }, [services]);

  const filteredServices = useMemo(() => {
    const query = localSearch.trim().toLowerCase();
    return services.filter((service) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "live" && service.isActive !== false) ||
        (statusFilter === "paused" && service.isActive === false) ||
        (statusFilter === "custom" && service.source === "CUSTOM");
      if (!matchesStatus) return false;
      if (!query) return true;
      return (
        service.serviceName.toLowerCase().includes(query) ||
        service.categoryName?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    });
  }, [services, localSearch, statusFilter]);

  const openAddModal = () => {
    setAddSession((session) => session + 1);
    setShowAddModal(true);
  };

  const handleAddService = (data: AddServiceInput) => {
    const offeredName =
      data.mode === "catalog" ? data.selectedService.name : data.customName;
    const isDuplicate = services.some(
      (service) =>
        (data.mode === "catalog" &&
          service.serviceId &&
          service.serviceId === data.selectedService._id) ||
        service.serviceName.toLowerCase() === offeredName.toLowerCase(),
    );

    if (isDuplicate) {
      toast.error("You have already added this service to your profile");
      return;
    }

    startTransition(async () => {
      const res = await addArtisanService(
        data.mode === "catalog"
          ? {
              service: data.selectedService._id,
              rateAmount: data.rateAmount,
              rateType: data.rateType === "daily" ? "DAILY" : "HOURLY",
              description: data.description,
            }
          : {
              category: data.categoryId || undefined,
              proposedCategory: data.categoryId ? undefined : data.proposedCategory,
              customName: data.customName,
              rateAmount: data.rateAmount,
              rateType: data.rateType === "daily" ? "DAILY" : "HOURLY",
              description: data.description,
            },
      );

      if (!res.success) {
        toast.error(res.message || "Failed to add service");
        return;
      }

      const linkedToCatalog =
        data.mode === "custom" && res.data?.source === "CATALOG";
      toast.success(
        linkedToCatalog
          ? `"${offeredName}" already exists in the catalog, so it was added as an official service.`
          : `"${offeredName}" added to your services!`,
      );
      setShowAddModal(false);
    });
  };

  const handleSaveEdit = (data: {
    service: ArtisanServiceItem;
    rateAmount: number;
    rateType: "hourly" | "daily";
    description: string;
    isActive: boolean;
    customName?: string;
  }) => {
    const { service, rateAmount, rateType, description, isActive } = data;

    if (!service._id) {
      toast.error("This service cannot be updated until it is saved on your catalog");
      return;
    }

    startTransition(async () => {
      const res = await updateArtisanService(service._id as string, {
        customName:
          service.source === "CUSTOM" ? data.customName : undefined,
        rateAmount,
        rateType: rateType === "daily" ? "DAILY" : "HOURLY",
        description,
        isActive,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to update service");
        return;
      }

      toast.success(`"${service.serviceName}" updated successfully!`);
      setEditingService(null);
    });
  };

  const handleRemoveService = (targetService: ArtisanServiceItem) => {
    if (!targetService._id) {
      toast.error("This service cannot be removed until it is saved on your catalog");
      return;
    }

    startTransition(async () => {
      const res = await deleteArtisanService(targetService._id as string);

      if (!res.success) {
        toast.error(res.message || "Failed to remove service");
        return;
      }

      toast.success(`"${targetService.serviceName}" removed`);
      if (viewingService?._id === targetService._id) {
        setViewingService(null);
      }
    });
  };

  const filters = [
    { id: "all" as const, label: "All", count: services.length },
    { id: "live" as const, label: "Live", count: stats.live },
    { id: "custom" as const, label: "Custom", count: stats.custom },
    { id: "paused" as const, label: "Paused", count: stats.paused },
  ];

  return (
    <div className="space-y-5 pb-16">
      <section className="overflow-hidden rounded-[28px] border border-line/80 bg-white shadow-xs">
        <div className="flex flex-col gap-5 bg-[linear-gradient(135deg,#1c1917_0%,#3f1d28_55%,#FE375D_140%)] px-6 py-6 text-white sm:flex-row sm:items-end sm:justify-between sm:px-7">
          <div className="max-w-xl space-y-2">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Your public offering
            </p>
            <h1 className="font-display text-[28px] font-semibold tracking-tight sm:text-[32px] text-white">
              Services & rates
            </h1>
            <p className="text-sm leading-relaxed text-white/75">
              These are the jobs clients can hire you for. Official catalog services and your own specialties sit side by side.
            </p>
          </div>
          <Button
            type="button"
            variant="white"
            size="sm"
            onClick={openAddModal}
            className="shrink-0 rounded-2xl px-5 text-sm font-semibold shadow-sm"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add a service
          </Button>
        </div>

        {services.length > 0 && (
          <div className="grid grid-cols-2 divide-x divide-y divide-line/70 border-t border-white/10 sm:grid-cols-4 sm:divide-y-0">
            {[
              { label: "On your profile", value: String(services.length) },
              { label: "Live to clients", value: String(stats.live) },
              { label: "Your specialties", value: String(stats.custom) },
              {
                label: "Starting at",
                value: stats.from ? `GH₵ ${stats.from}` : "—",
              },
            ].map((item) => (
              <div key={item.label} className="bg-white px-5 py-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                  {item.label}
                </p>
                <p className="mt-1 font-display text-2xl font-semibold tracking-tight text-title">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {services.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-line/80 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 overflow-x-auto">
            {filters.map((filter) => {
              const active = statusFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    active
                      ? "bg-title text-white"
                      : "text-muted hover:bg-smoke hover:text-title"
                  }`}
                >
                  {filter.label}
                  <span className={active ? "text-white/70" : "text-muted/80"}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <TextField
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search services"
              className="h-10 rounded-xl pl-8 text-xs"
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
        </div>
      )}

      {services.length === 0 ? (
        <EmptyServicesState onAddClick={openAddModal} />
      ) : filteredServices.length === 0 ? (
        <Card className="rounded-[24px] border border-dashed border-line bg-white px-6 py-14 text-center">
          <p className="font-display text-lg font-semibold text-title">Nothing in this view</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
            {localSearch
              ? `No service matches “${localSearch}”.`
              : "No services match this filter."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service._id || service.serviceName}
              service={service}
              onView={setViewingService}
              onEdit={setEditingService}
              onRemove={handleRemoveService}
            />
          ))}
        </div>
      )}

      <AddServiceModal
        key={addSession}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddService}
        isSaving={isPending}
      />

      <EditServiceModal
        service={editingService}
        onClose={() => setEditingService(null)}
        onSave={handleSaveEdit}
        isSaving={isPending}
      />

      <ViewServiceModal
        service={viewingService}
        onClose={() => setViewingService(null)}
        onEdit={(service) => {
          setViewingService(null);
          setEditingService(service);
        }}
        onRemove={handleRemoveService}
      />
    </div>
  );
}

export * from "./types";

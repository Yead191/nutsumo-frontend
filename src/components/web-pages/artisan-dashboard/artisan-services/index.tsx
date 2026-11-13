"use client";

import React, { useMemo, useState, useTransition } from "react";
import { Briefcase, Plus, Search, X } from "lucide-react";
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
  ArtisanServiceItem,
  CatalogServiceItem,
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSession, setAddSession] = useState(0);
  const [editingService, setEditingService] = useState<ArtisanServiceItem | null>(null);
  const [viewingService, setViewingService] = useState<ArtisanServiceItem | null>(null);

  const filteredServices = useMemo(() => {
    const query = localSearch.trim().toLowerCase();
    if (!query) return services;
    return services.filter((service) => {
      return (
        service.serviceName.toLowerCase().includes(query) ||
        service.categoryName?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    });
  }, [services, localSearch]);

  const openAddModal = () => {
    setAddSession((session) => session + 1);
    setShowAddModal(true);
  };

  const handleAddService = (data: {
    selectedService: CatalogServiceItem;
    rateAmount: number;
    rateType: "hourly" | "daily";
    description: string;
  }) => {
    const { selectedService, rateAmount, rateType, description } = data;
    const isDuplicate = services.some(
      (service) =>
        (service.serviceId && service.serviceId === selectedService._id) ||
        service.serviceName.toLowerCase() === selectedService.name.toLowerCase(),
    );

    if (isDuplicate) {
      toast.error("You have already added this service to your profile");
      return;
    }

    startTransition(async () => {
      const res = await addArtisanService({
        service: selectedService._id,
        rateAmount,
        rateType: rateType === "daily" ? "DAILY" : "HOURLY",
        description,
      });

      if (!res.success) {
        toast.error(res.message || "Failed to add service");
        return;
      }

      toast.success(`"${selectedService.name}" added to your services!`);
      setShowAddModal(false);
    });
  };

  const handleSaveEdit = (data: {
    service: ArtisanServiceItem;
    rateAmount: number;
    rateType: "hourly" | "daily";
    description: string;
    isActive: boolean;
  }) => {
    const { service, rateAmount, rateType, description, isActive } = data;

    if (!service._id) {
      toast.error("This service cannot be updated until it is saved on your catalog");
      return;
    }

    startTransition(async () => {
      const res = await updateArtisanService(service._id as string, {
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

  return (
    <div className="space-y-6 pb-16">
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
            onClick={openAddModal}
            className="font-bold text-xs px-5 shadow-xs flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Service
          </Button>
        </div>
      </div>

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

      {services.length === 0 ? (
        <EmptyServicesState onAddClick={openAddModal} />
      ) : filteredServices.length === 0 ? (
        <Card className="rounded-2xl border border-line bg-white p-8 text-center text-xs text-muted">
          No services match your search &quot;{localSearch}&quot;.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

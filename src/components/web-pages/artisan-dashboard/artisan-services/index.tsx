"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextField } from "@/components/ui/field";
import { toast } from "sonner";
import {
  updateArtisanProfile,
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
  // State initialized from server component prop (NO unnecessary useEffect GET calls!)
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

  // 1. Add Service
  const handleAddService = async (data: {
    selectedService: CatalogServiceItem;
    rateAmount: number;
    rateType: "hourly" | "daily";
    description: string;
  }) => {
    const { selectedService, rateAmount, rateType, description } = data;

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
      const res = await addArtisanService({
        service: selectedService._id,
        rateAmount,
        rateType: rateType === "daily" ? "DAILY" : "HOURLY",
        description,
      });

      const newServiceItem: ArtisanServiceItem = {
        _id: res?.data?._id,
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        category: catId,
        categoryName: catName,
        rateType,
        rate: rateAmount,
        description,
        catalogDescription: selectedService.description || "",
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      const updated = [newServiceItem, ...services];
      setServices(updated);

      // Sync to User profile services array
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

  // 2. Edit Service
  const handleSaveEdit = async (data: {
    service: ArtisanServiceItem;
    rateAmount: number;
    rateType: "hourly" | "daily";
    description: string;
    isActive: boolean;
  }) => {
    const { service, rateAmount, rateType, description, isActive } = data;

    setIsSaving(true);
    try {
      // If document exists in ArtisanService collection, update it
      if (service._id) {
        await updateArtisanService(service._id, {
          rateAmount,
          rateType: rateType === "daily" ? "DAILY" : "HOURLY",
          description,
          isActive,
        });
      }

      // Update state locally
      const updatedServices = services.map((s) => {
        if (
          (service._id && s._id === service._id) ||
          s.serviceName === service.serviceName
        ) {
          return {
            ...s,
            rate: rateAmount,
            rateType,
            description,
            isActive,
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

      toast.success(`"${service.serviceName}" updated successfully!`);
      setEditingService(null);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update service");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Remove Service
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
      {/* Header Banner */}
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
            onClick={() => setShowAddModal(true)}
            className="font-bold text-xs px-5 shadow-xs flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Service
          </Button>
        </div>
      </div>

      {/* Search / Filter bar (when services exist) */}
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

      {/* Services List / Empty State */}
      {services.length === 0 ? (
        <EmptyServicesState onAddClick={() => setShowAddModal(true)} />
      ) : filteredServices.length === 0 ? (
        <Card className="rounded-2xl border border-line bg-white p-8 text-center text-xs text-muted">
          No services match your search &quot;{localSearch}&quot;.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((svc, idx) => (
            <ServiceCard
              key={svc._id || idx}
              service={svc}
              onView={(s) => setViewingService(s)}
              onEdit={(s) => setEditingService(s)}
              onRemove={(s) => handleRemoveService(s)}
            />
          ))}
        </div>
      )}

      {/* Modal 1: Add Service */}
      <AddServiceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddService}
        isSaving={isSaving}
      />

      {/* Modal 2: Edit Service */}
      <EditServiceModal
        service={editingService}
        onClose={() => setEditingService(null)}
        onSave={handleSaveEdit}
        isSaving={isSaving}
      />

      {/* Modal 3: View Service Details */}
      <ViewServiceModal
        service={viewingService}
        onClose={() => setViewingService(null)}
        onEdit={(s) => {
          setViewingService(null);
          setEditingService(s);
        }}
        onRemove={(s) => handleRemoveService(s)}
      />
    </div>
  );
}

export * from "./types";

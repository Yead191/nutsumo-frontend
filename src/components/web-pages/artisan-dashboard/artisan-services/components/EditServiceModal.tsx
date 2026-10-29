"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField, TextArea } from "@/components/ui/field";
import { toast } from "sonner";
import type { ArtisanServiceItem } from "../types";

interface EditServiceModalProps {
  service: ArtisanServiceItem | null;
  onClose: () => void;
  onSave: (data: {
    service: ArtisanServiceItem;
    rateAmount: number;
    rateType: "hourly" | "daily";
    description: string;
    isActive: boolean;
  }) => Promise<void>;
  isSaving: boolean;
}

export function EditServiceModal({
  service,
  onClose,
  onSave,
  isSaving,
}: EditServiceModalProps) {
  const [editRateType, setEditRateType] = useState<"hourly" | "daily">("hourly");
  const [editRateAmount, setEditRateAmount] = useState<number>(75);
  const [editDescription, setEditDescription] = useState("");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (service) {
      setEditRateType(service.rateType || "hourly");
      setEditRateAmount(service.rate || 75);
      setEditDescription(service.description || "");
      setEditIsActive(service.isActive !== undefined ? service.isActive : true);
    }
  }, [service]);

  if (!service) return null;

  const handleSubmit = async () => {
    if (!editRateAmount || editRateAmount <= 0) {
      toast.error("Please enter a valid rate amount");
      return;
    }

    await onSave({
      service,
      rateAmount: Number(editRateAmount),
      rateType: editRateType,
      description: editDescription.trim(),
      isActive: editIsActive,
    });
  };

  return (
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
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-title hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Service Info Banner */}
          <div className="rounded-2xl bg-slate-50 border border-line/80 p-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {service.categoryName || "Trade Category"}
            </span>
            <h4 className="font-display text-base font-bold text-title">
              {service.serviceName}
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

          {/* Scope & Details */}
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
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="font-bold text-xs px-5"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

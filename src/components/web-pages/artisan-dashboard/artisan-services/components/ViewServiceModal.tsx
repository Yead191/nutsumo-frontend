"use client";

import React from "react";
import { X, Tag, Check, Sparkles, Info, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArtisanServiceItem } from "../types";

interface ViewServiceModalProps {
  service: ArtisanServiceItem | null;
  onClose: () => void;
  onEdit: (service: ArtisanServiceItem) => void;
  onRemove: (service: ArtisanServiceItem) => void;
}

export function ViewServiceModal({
  service,
  onClose,
  onEdit,
  onRemove,
}: ViewServiceModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line space-y-6">
        <div className="flex items-start justify-between border-b border-line pb-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-bold">
              <Tag className="h-3 w-3" />
              {service.categoryName || "Trade Category"}
            </span>
            <h3 className="font-display text-xl font-black text-title">
              {service.serviceName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
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
                GH₵{service.rate}
                <span className="text-xs font-semibold text-muted">
                  /{service.rateType === "hourly" ? "hr" : "day"}
                </span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Live Status
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold mt-1 ${
                  service.isActive !== false
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                {service.isActive !== false ? "Active & Bookable" : "Paused"}
              </span>
            </div>
          </div>

          {/* Artisan's Custom Scope & Details */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-title flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Your Custom Scope & Labor Details
            </h4>
            {service.description ? (
              <div className="rounded-2xl border border-line p-4 bg-white text-xs text-title leading-relaxed whitespace-pre-wrap">
                {service.description}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line p-4 bg-slate-50 text-xs text-muted">
                No custom scope written yet. Click &quot;Edit Service&quot; below
                to define your specific labor inclusions, parts policy, and
                diagnosis approach.
              </div>
            )}
          </div>

          {/* Catalog Description if available */}
          {service.catalogDescription && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-muted" />
                Nutsumo Catalog Standard Description
              </h4>
              <div className="rounded-2xl bg-slate-50 border border-line/60 p-3.5 text-xs text-muted leading-relaxed">
                {service.catalogDescription}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-line">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onRemove(service)}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Remove
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={() => onEdit(service)}
              className="font-bold text-xs px-5 flex items-center gap-1.5"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Service
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

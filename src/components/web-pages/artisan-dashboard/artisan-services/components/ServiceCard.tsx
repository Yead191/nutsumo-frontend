"use client";

import React from "react";
import { Tag, Eye, Edit3, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ArtisanServiceItem } from "../types";

interface ServiceCardProps {
  service: ArtisanServiceItem;
  onView: (service: ArtisanServiceItem) => void;
  onEdit: (service: ArtisanServiceItem) => void;
  onRemove: (service: ArtisanServiceItem) => void;
}

export function ServiceCard({
  service,
  onView,
  onEdit,
  onRemove,
}: ServiceCardProps) {
  return (
    <Card className="group rounded-2xl border border-line/80 bg-white p-5 shadow-2xs hover:shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-bold truncate max-w-[170px]">
            <Tag className="h-3 w-3 shrink-0" />
            {service.categoryName || "Trade Category"}
          </span>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              service.isActive !== false
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-slate-100 text-slate-500 border border-slate-200"
            }`}
          >
            {service.isActive !== false ? "Active" : "Paused"}
          </span>
        </div>

        {/* Service Name */}
        <h3
          onClick={() => onView(service)}
          className="font-display text-base font-bold text-title group-hover:text-primary transition cursor-pointer line-clamp-2"
        >
          {service.serviceName}
        </h3>

        {/* Scope & Details */}
        {service.description ? (
          <p className="text-xs text-muted line-clamp-2 leading-relaxed">
            {service.description}
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
            {service.rateType} Rate
          </span>
          <span className="font-display text-xl font-black text-title">
            GH₵{service.rate}
            <span className="text-xs font-semibold text-muted">
              /{service.rateType === "hourly" ? "hr" : "day"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(service)}
            className="p-2 rounded-xl text-muted hover:text-primary hover:bg-primary/5 transition"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="p-2 rounded-xl text-muted hover:text-title hover:bg-slate-100 transition"
            title="Edit service & rate"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(service)}
            className="p-2 rounded-xl text-muted hover:text-rose-600 hover:bg-rose-50 transition"
            title="Remove service"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

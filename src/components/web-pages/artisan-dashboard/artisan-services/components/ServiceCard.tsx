"use client";

import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
  const live = service.isActive !== false;
  const custom = service.source === "CUSTOM";
  const unit = service.rateType === "hourly" ? "hour" : "day";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line/80 bg-white shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <button
        type="button"
        onClick={() => onView(service)}
        className="flex flex-1 flex-col px-5 pb-4 pt-5 text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            {service.categoryName || "Uncategorized"}
          </p>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${
              live
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                live ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            {live ? "Live" : "Paused"}
          </span>
        </div>

        <h3 className="mt-3 font-display text-[20px] font-semibold leading-snug tracking-tight text-title transition group-hover:text-primary">
          {service.serviceName}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted">
          {service.description || "Scope is the standard labor for this service. Add a note so clients know what is included."}
        </p>

        {custom && (
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
            {service.reviewStatus === "PENDING_REVIEW"
              ? "Specialty · awaiting catalog review"
              : "Your specialty"}
          </p>
        )}
      </button>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line/70 bg-slate-50/70 px-4 py-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Per {unit}
          </p>
          <p className="font-display text-[22px] font-semibold tracking-tight text-title">
            GH₵ {service.rate}
          </p>
        </div>

        <div className="flex items-center rounded-2xl border border-line bg-white p-1">
          <button
            type="button"
            onClick={() => onView(service)}
            className="rounded-xl p-2 text-muted transition hover:bg-smoke hover:text-title"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="rounded-xl p-2 text-muted transition hover:bg-smoke hover:text-title"
            title="Edit service"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(service)}
            className="rounded-xl p-2 text-muted transition hover:bg-rose-50 hover:text-rose-600"
            title="Remove service"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

"use client";

import { Briefcase, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import type { IQuotationItem, IBookingItem } from "../types";

interface ArtisanJobsMetricsProps {
  quotations: IQuotationItem[];
  bookings: IBookingItem[];
}

export function ArtisanJobsMetrics({
  quotations,
  bookings,
}: ArtisanJobsMetricsProps) {
  const activeBookingsCount = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "IN_PROGRESS",
  ).length;

  const pendingQuotationsCount = quotations.filter(
    (q) => q.status === "PENDING",
  ).length;

  const acceptedQuotationsCount = quotations.filter(
    (q) => q.status === "ACCEPTED",
  ).length;

  const totalBookedValue = bookings.reduce(
    (acc, b) => acc + (b.totalAmount || 0),
    0,
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* ACTIVE CONTRACTS */}
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted">Active Work</span>
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Briefcase className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-title">
          {activeBookingsCount}
        </div>
        <p className="mt-1 text-[11px] text-muted">Confirmed client bookings</p>
      </div>

      {/* PENDING QUOTES */}
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted">Pending Proposals</span>
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-title">
          {pendingQuotationsCount}
        </div>
        <p className="mt-1 text-[11px] text-muted">Awaiting client review</p>
      </div>

      {/* ACCEPTED QUOTES */}
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted">Won Quotes</span>
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <CheckCircle2 className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-title">
          {acceptedQuotationsCount}
        </div>
        <p className="mt-1 text-[11px] text-muted">Accepted proposals</p>
      </div>

      {/* TOTAL VALUE */}
      <div className="rounded-2xl border border-line bg-white p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted">Booked Value</span>
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-50 text-[#FE375D]">
            <TrendingUp className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-2 font-display text-2xl font-bold text-[#FE375D]">
          GH₵{totalBookedValue.toLocaleString()}
        </div>
        <p className="mt-1 text-[11px] text-muted">Total contracts volume</p>
      </div>
    </div>
  );
}

"use client";

import { Check, Lock, Play, PackageCheck, Award } from "lucide-react";
import { cn } from "@/lib/cn";
import type { IBookingItem, BookingStatus } from "@/helpers/next-fetch/apiActions/bookingActions";

interface BookingEscrowTrackerProps {
  booking: IBookingItem;
}

export function BookingEscrowTracker({ booking }: BookingEscrowTrackerProps) {
  const isPaid = booking.paymentStatus === "ESCROW_HELD" || booking.paymentStatus === "PAID";
  const status = booking.status;

  const steps = [
    {
      id: "deposit",
      title: "1. Escrow Deposit",
      description: isPaid ? "Funded & Secured" : "Awaiting Payment",
      icon: Lock,
      isCompleted: isPaid,
      isCurrent: !isPaid,
    },
    {
      id: "scheduled",
      title: "2. Artisan Scheduled",
      description: isPaid ? "Assigned & Ready" : "Pending Deposit",
      icon: Check,
      isCompleted: ["CONFIRMED", "IN_PROGRESS", "DELIVERED", "COMPLETED"].includes(status) && isPaid,
      isCurrent: status === "CONFIRMED" && isPaid,
    },
    {
      id: "in_progress",
      title: "3. In Progress",
      description: ["IN_PROGRESS", "DELIVERED", "COMPLETED"].includes(status) ? "Artisan Working" : "Pending Start",
      icon: Play,
      isCompleted: ["IN_PROGRESS", "DELIVERED", "COMPLETED"].includes(status),
      isCurrent: status === "IN_PROGRESS",
    },
    {
      id: "delivered",
      title: "4. Delivered",
      description: ["DELIVERED", "COMPLETED"].includes(status) ? "Work Submitted" : "Awaiting Work",
      icon: PackageCheck,
      isCompleted: ["DELIVERED", "COMPLETED"].includes(status),
      isCurrent: status === "DELIVERED",
    },
    {
      id: "completed",
      title: "5. Completed",
      description: status === "COMPLETED" ? "Funds Released" : "Final Review",
      icon: Award,
      isCompleted: status === "COMPLETED",
      isCurrent: false,
    },
  ];

  return (
    <div className="rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-2xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-sm font-bold text-title flex items-center gap-2">
          <span>Escrow Protection Lifecycle</span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
            Upwork / Fiverr Assured
          </span>
        </h3>
        <span className="text-xs text-muted">
          Current Stage: <strong className="text-title font-semibold">{status.replace(/_/g, " ")}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={cn(
                "relative rounded-2xl p-3 border transition-all text-left flex flex-col justify-between min-h-[96px]",
                step.isCompleted
                  ? "border-emerald-200 bg-emerald-50/50 text-emerald-950"
                  : step.isCurrent
                    ? "border-[#FE375D] bg-rose-50/40 text-title ring-1 ring-[#FE375D]/30"
                    : "border-line bg-smoke/40 text-muted opacity-80",
              )}
            >
              <div className="flex items-center justify-between">
                <div
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-xl text-xs font-bold",
                    step.isCompleted
                      ? "bg-emerald-600 text-white"
                      : step.isCurrent
                        ? "bg-[#FE375D] text-white animate-pulse"
                        : "bg-slate-200 text-slate-600",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <span className="text-[10px] font-mono font-bold text-muted">
                  0{idx + 1}
                </span>
              </div>

              <div className="mt-2">
                <span className="block font-display text-xs font-bold leading-tight line-clamp-1">
                  {step.title}
                </span>
                <span className="text-[11px] text-muted block mt-0.5 leading-tight">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import { Card } from "@/components/ui/card";

export function ProfessionalProfileSkeleton() {
  return (
    <div className="space-y-8 pb-16 animate-pulse">
      {/* Top Header Card Skeleton */}
      <div className="relative overflow-hidden rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Skeleton */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl bg-slate-200/80 shrink-0" />

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="h-7 w-48 sm:w-64 rounded-lg bg-slate-200/80" />
                <div className="h-6 w-28 rounded-full bg-slate-200/60" />
              </div>
              <div className="h-4 w-40 rounded-md bg-slate-200/60" />
              <div className="h-3.5 w-56 rounded-md bg-slate-100" />
            </div>
          </div>

          {/* Availability and Action Skeleton */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2 md:pt-0">
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-slate-200/60" />
              <div className="h-10 w-64 rounded-xl bg-slate-100" />
            </div>
            <div className="h-10 w-32 rounded-xl bg-slate-200/80 mt-5 sm:mt-5" />
          </div>
        </div>
      </div>

      {/* Main Form Card Skeleton */}
      <Card className="rounded-3xl border border-line/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="border-b border-line pb-4 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-56 rounded-lg bg-slate-200/80" />
            <div className="h-3.5 w-80 rounded-md bg-slate-100" />
          </div>
          <div className="h-4 w-24 rounded bg-slate-100" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Field 1: Name */}
          <div className="space-y-2">
            <div className="h-3.5 w-20 rounded bg-slate-200/70" />
            <div className="h-11 w-full rounded-xl bg-slate-100" />
          </div>

          {/* Field 2: Business Name */}
          <div className="space-y-2">
            <div className="h-3.5 w-36 rounded bg-slate-200/70" />
            <div className="h-11 w-full rounded-xl bg-slate-100" />
          </div>

          {/* Field 3: Trade */}
          <div className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-slate-200/70" />
            <div className="h-11 w-full rounded-xl bg-slate-100" />
          </div>

          {/* Field 4: Experience */}
          <div className="space-y-2">
            <div className="h-3.5 w-32 rounded bg-slate-200/70" />
            <div className="h-11 w-full rounded-xl bg-slate-100" />
          </div>

          {/* Field 5: Location */}
          <div className="space-y-2">
            <div className="h-3.5 w-36 rounded bg-slate-200/70" />
            <div className="h-11 w-full rounded-xl bg-slate-100" />
          </div>

          {/* Field 6: Post Code */}
          <div className="space-y-2">
            <div className="h-3.5 w-24 rounded bg-slate-200/70" />
            <div className="h-11 w-full rounded-xl bg-slate-100" />
          </div>

          {/* Field 7: Phone */}
          <div className="space-y-2">
            <div className="h-3.5 w-28 rounded bg-slate-200/70" />
            <div className="h-11 w-full rounded-xl bg-slate-100" />
          </div>

          {/* Field 8: Email */}
          <div className="space-y-2">
            <div className="h-3.5 w-28 rounded bg-slate-200/70" />
            <div className="h-11 w-full rounded-xl bg-slate-100" />
          </div>

          {/* Field 9: Bio (Span 2) */}
          <div className="sm:col-span-2 space-y-2">
            <div className="h-3.5 w-40 rounded bg-slate-200/70" />
            <div className="h-28 w-full rounded-2xl bg-slate-100" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="pt-4 border-t border-line flex items-center justify-between">
          <div className="h-3.5 w-64 rounded bg-slate-100" />
          <div className="h-10 w-36 rounded-xl bg-slate-200/80" />
        </div>
      </Card>
    </div>
  );
}

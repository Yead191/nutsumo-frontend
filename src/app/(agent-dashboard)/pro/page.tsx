"use client";

import { ProAnalytics } from "@/components/web-pages/pro-analytics";
import { ShieldCheck } from "lucide-react";

export default function ProOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/70 pb-4 pt-1">
        <div>
          <h1 className="font-display text-[22px] sm:text-[26px] font-bold text-title tracking-tight">
            Performance &amp; Analytics
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted">
            Real-time overview of your earnings, completed jobs, and client retention.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified Pro Account</span>
        </div>
      </div>

      {/* Senior Product Designer Executive Analytics Section with Standard Tabs */}
      <ProAnalytics />
    </div>
  );
}

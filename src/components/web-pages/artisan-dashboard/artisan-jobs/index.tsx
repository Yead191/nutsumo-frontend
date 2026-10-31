"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Briefcase,
  FileText,
  Sparkles,
  ExternalLink,
  PlusCircle,
} from "lucide-react";
import { ArtisanJobsMetrics } from "./components/ArtisanJobsMetrics";
import { ArtisanBookingsList } from "./components/ArtisanBookingsList";
import { ArtisanProposalsList } from "./components/ArtisanProposalsList";
import { ArtisanJobsFeed } from "./components/ArtisanJobsFeed";
import type { ArtisanJobsManagerProps, ArtisanJobsTab } from "./types";

export function ArtisanJobsManager({
  initialQuotations = [],
  initialBookings = [],
  availableJobs = [],
  pagination,
  initialParams,
}: ArtisanJobsManagerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get("tab") as ArtisanJobsTab) || initialParams?.tab || "proposals";
  const [activeTab, setActiveTab] = useState<ArtisanJobsTab>(tabParam);

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: ArtisanJobsTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/pro/jobs?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/70 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-title tracking-tight">
            Jobs & Proposals
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Manage your active client contracts, track submitted proposals, and win new work in Ghana.
          </p>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4" />
          <span>Browse All Jobs</span>
        </Link>
      </div>

      {/* METRICS */}
      <ArtisanJobsMetrics
        quotations={initialQuotations}
        bookings={initialBookings}
      />

      {/* TABS CONTAINER */}
      <div className="space-y-4">
        {/* TAB BUTTONS */}
        <div className="flex items-center gap-2 border-b border-line/70 overflow-x-auto pb-px scrollbar-none">
          <button
            type="button"
            onClick={() => handleTabChange("proposals")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "proposals"
                ? "border-[#FE375D] text-[#FE375D]"
                : "border-transparent text-muted hover:text-title hover:border-slate-300"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>My Submitted Proposals</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === "proposals"
                  ? "bg-rose-100 text-[#FE375D]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {initialQuotations.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("bookings")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "bookings"
                ? "border-[#FE375D] text-[#FE375D]"
                : "border-transparent text-muted hover:text-title hover:border-slate-300"
            }`}
          >
            <Briefcase className="h-4 w-4" />
            <span>Active Contracts</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === "bookings"
                  ? "bg-rose-100 text-[#FE375D]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {initialBookings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("leads")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "leads"
                ? "border-[#FE375D] text-[#FE375D]"
                : "border-transparent text-muted hover:text-title hover:border-slate-300"
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#FE375D]" />
            <span>Available Job Opportunities</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                activeTab === "leads"
                  ? "bg-rose-100 text-[#FE375D]"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {pagination?.total ?? availableJobs.length}
            </span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="pt-2">
          {activeTab === "proposals" && (
            <ArtisanProposalsList quotations={initialQuotations} />
          )}

          {activeTab === "bookings" && (
            <ArtisanBookingsList bookings={initialBookings} />
          )}

          {activeTab === "leads" && (
            <ArtisanJobsFeed
              availableJobs={availableJobs}
              pagination={pagination}
              initialParams={initialParams}
            />
          )}
        </div>
      </div>
    </div>
  );
}

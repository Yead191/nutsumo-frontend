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

  const tabParam =
    (searchParams.get("tab") as ArtisanJobsTab) ||
    initialParams?.tab ||
    "proposals";
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
            Manage your active client contracts, track submitted proposals, and
            win new work in Ghana.
          </p>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-[1.02] self-start sm:self-auto"
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
            onClick={() => handleTabChange("bookings")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "bookings"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-title hover:border-slate-300"
            }`}
          >
            <span>Active Contracts &amp; Work</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                activeTab === "bookings"
                  ? "bg-primary/10 text-primary"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {initialBookings.filter(
                (b) => b.status !== "COMPLETED" && b.status !== "CANCELLED",
              ).length > 0
                ? `${
                    initialBookings.filter(
                      (b) =>
                        b.status !== "COMPLETED" && b.status !== "CANCELLED",
                    ).length
                  } Active`
                : `${initialBookings.length} Total`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("proposals")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "proposals"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-title hover:border-slate-300"
            }`}
          >
            <span>My Submitted Proposals</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                activeTab === "proposals"
                  ? "bg-primary/10 text-primary"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {initialQuotations.filter((q) => q.status === "PENDING").length >
              0
                ? `${
                    initialQuotations.filter((q) => q.status === "PENDING")
                      .length
                  } Under Review`
                : `${initialQuotations.length} Total`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("leads")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "leads"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-title hover:border-slate-300"
            }`}
          >
            <span>Available Job Opportunities</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                activeTab === "leads"
                  ? "bg-primary/10 text-primary"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {pagination?.total ?? availableJobs.length} Open
            </span>
          </button>
        </div>

        {/* WORKFLOW PIPELINE HELPER STRIP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-smoke/60 border border-line/70 px-4 py-3 text-xs text-muted">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-title text-[11px] uppercase tracking-wider">
              Marketplace Pipeline:
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-slate-200 text-[10px] font-bold">
                1
              </span>
              <span>Find Jobs &amp; Submit Bids</span>
            </span>
            <span className="text-slate-400">➔</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                2
              </span>
              <span>Client Reviews Proposals</span>
            </span>
            <span className="text-slate-400">➔</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                3
              </span>
              <span>Hired · Deliver in Active Contracts</span>
            </span>
          </div>

          <div className="text-[11px] text-muted italic">
            {activeTab === "bookings" &&
              "Active Contracts: Confirmed client bookings to perform and deliver."}
            {activeTab === "proposals" &&
              "Submitted Proposals: Your quotes awaiting client decision."}
            {activeTab === "leads" &&
              "Opportunities: Live client requests open for bids."}
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="pt-2">
          {activeTab === "proposals" && (
            <ArtisanProposalsList
              quotations={initialQuotations}
              bookings={initialBookings}
              onViewContract={() => handleTabChange("bookings")}
            />
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

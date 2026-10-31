"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Plus,
  Search,
  X,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { JobCard } from "./components/JobCard";
import { EmptyJobsState } from "./components/EmptyJobsState";
import type { MyJobsManagerProps, JobFilterTab } from "./types";
import type { JobStatus } from "@/helpers/next-fetch/apiActions/jobActions";

const TABS: { key: JobFilterTab; label: string }[] = [
  { key: "ALL", label: "All Requests" },
  { key: "OPEN", label: "Open / Receiving Quotes" },
  { key: "BOOKED", label: "Booked" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

export function MyJobsManager({
  initialJobs: jobs,
  pagination,
}: MyJobsManagerProps) {
  const [activeTab, setActiveTab] = useState<JobFilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Tab counts
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: jobs.length,
      OPEN: 0,
      BOOKED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    for (const j of jobs) {
      if (counts[j.status] !== undefined) {
        counts[j.status]++;
      }
    }
    return counts;
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Status Filter
      if (activeTab !== "ALL" && job.status !== activeTab) {
        return false;
      }
      // 2. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const categoryName =
          typeof job.category === "object" ? job.category?.name || "" : "";
        const serviceName =
          typeof job.service === "object" ? job.service?.name || "" : "";
        const combined =
          `${job.title} ${job.description} ${job.location} ${categoryName} ${serviceName}`.toLowerCase();
        if (!combined.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [jobs, activeTab, searchQuery]);

  const isFiltered = activeTab !== "ALL" || Boolean(searchQuery.trim());

  return (
    <div className="space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/70 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-title tracking-tight flex items-center gap-2.5">
              <ClipboardList className="h-7 w-7 text-[#FE375D]" />
              <span>Service Requests</span>
            </h1>
            <span className="inline-flex items-center rounded-full bg-[#FE375D]/10 px-3 py-1 text-xs font-bold text-[#FE375D] border border-[#FE375D]/20">
              {jobs.length} Total
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-copy">
            Manage your repair and improvement requests, review artisan quotes,
            and confirm bookings.
          </p>
        </div>

        <Link
          href="/account/post-job"
          className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Post a Request</span>
        </Link>
      </div>

      {/* 2. SEARCH & TABS FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab) => {
            const count = tabCounts[tab.key] || 0;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer flex items-center gap-2",
                  isActive
                    ? "bg-[#FE375D] text-white shadow-xs"
                    : "bg-white text-muted border border-line/70 hover:text-title hover:border-line",
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-smoke text-title border border-line/80",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location..."
            className="w-full rounded-xl border border-line bg-white pl-9 pr-8 py-2 text-xs text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-title cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. JOBS LIST / GRID */}
      {filteredJobs.length === 0 ? (
        <EmptyJobsState
          isFiltered={isFiltered}
          onResetFilters={() => {
            setActiveTab("ALL");
            setSearchQuery("");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {filteredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* 4. PAGINATION */}
      {pagination && pagination.totalPage > 1 && (
        <div className="flex items-center justify-between border-t border-line/70 pt-4">
          <p className="text-xs text-muted">
            Page <strong className="text-title">{pagination.page}</strong> of{" "}
            <strong className="text-title">{pagination.totalPage}</strong> (
            {pagination.total} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-semibold text-title hover:border-[#FE375D] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPage}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-semibold text-title hover:border-[#FE375D] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Briefcase,
  ExternalLink,
  Search,
  Filter,
  X,
  RotateCcw,
} from "lucide-react";
import { SendProposalModal } from "@/components/web-pages/jobs-marketplace/components/SendProposalModal";
import {
  ServiceCategoryFilterModal,
  type FilterSelection,
} from "@/components/shared/ServiceCategoryFilterModal";
import { Pagination, type IPaginationData } from "@/components/shared/Pagination";
import type { IJobItem } from "../types";

interface ArtisanJobsFeedProps {
  availableJobs: IJobItem[];
  pagination?: IPaginationData | null;
  initialParams?: {
    searchTerm?: string;
    category?: string;
    service?: string;
  };
}

export function ArtisanJobsFeed({
  availableJobs,
  pagination,
  initialParams,
}: ArtisanJobsFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState(
    initialParams?.searchTerm || searchParams.get("searchTerm") || "",
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    initialParams?.category || searchParams.get("category") || "",
  );
  const [activeService, setActiveService] = useState<string>(
    initialParams?.service || searchParams.get("service") || "",
  );
  const [filterLabel, setFilterLabel] = useState<string>("");

  // Modals state
  const [selectedJobForProposal, setSelectedJobForProposal] = useState<IJobItem | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const applyUrlParams = (newParams: {
    searchTerm?: string;
    category?: string;
    service?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "leads"); // Ensure leads tab remains active

    if (newParams.searchTerm !== undefined) {
      if (newParams.searchTerm.trim()) {
        params.set("searchTerm", newParams.searchTerm.trim());
      } else {
        params.delete("searchTerm");
      }
    }

    if (newParams.category !== undefined) {
      if (newParams.category) {
        params.set("category", newParams.category);
      } else {
        params.delete("category");
      }
    }

    if (newParams.service !== undefined) {
      if (newParams.service) {
        params.set("service", newParams.service);
      } else {
        params.delete("service");
      }
    }

    if (newParams.page !== undefined) {
      if (newParams.page > 1) {
        params.set("page", String(newParams.page));
      } else {
        params.delete("page");
      }
    } else {
      params.delete("page"); // reset to page 1 on filter/search change
    }

    startTransition(() => {
      router.push(`/pro/jobs?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyUrlParams({ searchTerm, category: activeCategory, service: activeService });
  };

  const handleApplyFilter = (selection: FilterSelection) => {
    const catId = selection.categoryId || "";
    const srvId = selection.serviceId || "";
    setActiveCategory(catId);
    setActiveService(srvId);

    const label = selection.serviceName
      ? `${selection.serviceName} (Service)`
      : selection.categoryName
        ? `${selection.categoryName} (Category)`
        : "";
    setFilterLabel(label);

    applyUrlParams({
      searchTerm,
      category: catId,
      service: srvId,
    });
  };

  const handleClearFilter = () => {
    setActiveCategory("");
    setActiveService("");
    setFilterLabel("");
    applyUrlParams({ searchTerm, category: "", service: "" });
  };

  const handleResetAll = () => {
    setSearchTerm("");
    setActiveCategory("");
    setActiveService("");
    setFilterLabel("");
    startTransition(() => {
      router.push("/pro/jobs?tab=leads");
    });
  };

  const handlePageChange = (newPage: number) => {
    applyUrlParams({
      searchTerm,
      category: activeCategory,
      service: activeService,
      page: newPage,
    });
  };

  const hasActiveFilter = Boolean(activeCategory || activeService || searchTerm.trim());

  return (
    <div className="space-y-5">
      {/* SEARCH & FILTER BAR (SORT REMOVED) */}
      <div className="rounded-3xl border border-line bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* SEARCH INPUT */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search available jobs (e.g. plumbing, wiring, garden bed)..."
              className="w-full rounded-2xl border border-line bg-smoke/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FE375D] transition-colors"
            />
          </form>

          {/* FILTER MODAL TRIGGER BUTTON */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                activeCategory || activeService
                  ? "border-[#FE375D] bg-[#FE375D]/10 text-[#FE375D]"
                  : "border-line bg-smoke/50 text-title hover:bg-white hover:border-title"
              }`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>
                {activeCategory || activeService
                  ? "Filtered"
                  : "Filter Category / Service"}
              </span>
              {(activeCategory || activeService) && (
                <span className="h-2 w-2 rounded-full bg-[#FE375D]" />
              )}
            </button>

            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetAll}
                title="Reset filters"
                className="grid h-10 w-10 place-items-center rounded-2xl border border-line bg-white text-muted hover:text-[#FE375D] hover:border-[#FE375D] transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE FILTER CHIP */}
        {(activeCategory || activeService) && (
          <div className="flex items-center gap-2 pt-1 border-t border-line/60">
            <span className="text-xs text-muted">Active Filter:</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#FE375D] border border-rose-200/60">
              <span>{filterLabel || "Selected Category/Service"}</span>
              <button
                type="button"
                onClick={handleClearFilter}
                className="hover:text-rose-950 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* HEADER & FEED STATUS */}
      <div className="flex items-center justify-between pb-1">
        <p className="text-xs text-muted">
          Showing <strong>{availableJobs.length}</strong> active client request
          {availableJobs.length !== 1 ? "s" : ""} open for bids.
          {pagination && pagination.total > availableJobs.length
            ? ` (${pagination.total} total available)`
            : ""}
        </p>

        <div className="flex items-center gap-3">
          {isPending && (
            <span className="text-xs font-semibold text-[#FE375D] animate-pulse">
              Updating...
            </span>
          )}
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#FE375D] hover:underline"
          >
            <span>Marketplace</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* JOBS LIST OR EMPTY STATE */}
      {availableJobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-smoke/40 p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-[#FE375D] mb-4">
            <Briefcase className="h-7 w-7" />
          </div>
          <h3 className="font-display text-lg font-bold text-title">
            No matching jobs found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-muted max-w-md mx-auto">
            {hasActiveFilter
              ? "No active requests match your current search or filter. Try clearing filters to see more opportunities."
              : "We notify Job Seekers as soon as new client requests matching your trades are posted. Check back soon!"}
          </p>
          {hasActiveFilter ? (
            <button
              type="button"
              onClick={handleResetAll}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-5 py-2 text-xs font-semibold text-title hover:border-title transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              href="/jobs"
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
            >
              <span>Explore All Jobs &rarr;</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableJobs.map((job) => {
            const categoryName =
              typeof job.category === "object" && job.category
                ? job.category.name
                : "";
            const serviceName =
              typeof job.service === "object" && job.service
                ? job.service.name
                : job.customServiceName || "";

            const formattedDate = job.preferredDate
              ? new Date(job.preferredDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "Flexible";

            return (
              <div
                key={job._id}
                className="rounded-3xl border border-line bg-white p-5 shadow-xs hover:border-[#FE375D]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-[#FE375D]">
                      {serviceName || categoryName || "Service Request"}
                    </span>

                    <span className="font-display text-sm font-black text-[#FE375D]">
                      GH₵{job.budget?.toLocaleString() || "Open"}
                    </span>
                  </div>

                  <Link
                    href={`/pro/jobs/${job._id}`}
                    className="font-display text-base font-bold text-title hover:text-[#FE375D] transition-colors line-clamp-1"
                  >
                    {job.title}
                  </Link>

                  <p className="mt-1.5 text-xs text-copy line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-muted border-t border-line/60 pt-2.5">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between gap-2">
                  <Link
                    href={`/pro/jobs/${job._id}`}
                    className="text-xs font-semibold text-muted hover:text-title transition-colors"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedJobForProposal(job)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Send Proposal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {/* FILTER MODAL (SCROLL PAGINATION) */}
      <ServiceCategoryFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilter}
        initialCategoryId={activeCategory}
        initialServiceId={activeService}
      />

      {/* PROPOSAL MODAL */}
      {selectedJobForProposal && (
        <SendProposalModal
          isOpen={Boolean(selectedJobForProposal)}
          onClose={() => setSelectedJobForProposal(null)}
          job={selectedJobForProposal}
          currentUserRole="ARTISAN"
        />
      )}
    </div>
  );
}

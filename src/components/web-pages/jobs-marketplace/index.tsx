"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, AlertCircle, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";
import { JobsSearchHero } from "./components/JobsSearchHero";
import { JobMarketplaceFilters } from "./components/JobMarketplaceFilters";
import { JobMarketplaceCard } from "./components/JobMarketplaceCard";
import { SendProposalModal } from "./components/SendProposalModal";
import type { IJobsMarketplaceProps, IJobItem } from "./types";

export function JobsMarketplaceContainer({
  initialJobs,
  categories,
  totalJobs,
  initialParams,
  currentUserRole,
}: IJobsMarketplaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(
    initialParams?.searchTerm || searchParams.get("searchTerm") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    initialParams?.category || searchParams.get("category") || "",
  );
  const [sortBy, setSortBy] = useState(
    initialParams?.sortBy || searchParams.get("sortBy") || "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  );

  // Proposal modal state
  const [selectedJobForProposal, setSelectedJobForProposal] =
    useState<IJobItem | null>(null);

  const applyUrlParams = (newParams: {
    searchTerm?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

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

    if (newParams.sortBy !== undefined) {
      params.set("sortBy", newParams.sortBy);
    }

    if (newParams.sortOrder !== undefined) {
      params.set("sortOrder", newParams.sortOrder);
    }

    params.delete("page");

    startTransition(() => {
      router.push(`/jobs?${params.toString()}`);
    });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    applyUrlParams({
      searchTerm: term,
      category: selectedCategory,
      sortBy,
      sortOrder,
    });
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    applyUrlParams({ searchTerm, category: categoryId, sortBy, sortOrder });
  };

  const handleSortChange = (
    newSortBy: string,
    newSortOrder: "asc" | "desc",
  ) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    applyUrlParams({
      searchTerm,
      category: selectedCategory,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortBy("createdAt");
    setSortOrder("desc");
    startTransition(() => {
      router.push("/jobs");
    });
  };

  // Filter jobs locally if needed for smooth client interactions

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <JobsSearchHero />

      {/* FILTER BAR & CATEGORY PILLS */}
      <JobMarketplaceFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onReset={handleReset}
        totalResults={initialJobs.length}
      />

      {/* ACTIVE JOBS FEED */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-title tracking-tight">
              Open Job Requests
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
              {initialJobs.length}
            </span>
          </div>

          {isPending && (
            <span className="text-xs font-semibold text-[#FE375D] animate-pulse">
              Updating feed...
            </span>
          )}
        </div>

        {initialJobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-smoke/40 p-12 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-[#FE375D] mb-4">
              <Briefcase className="h-7 w-7" />
            </div>
            <h3 className="font-display text-lg font-bold text-title">
              No matching jobs found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted max-w-md mx-auto">
              There are currently no active requests matching your search or
              category filter. Try clearing filters or checking back soon!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-line bg-white px-5 py-2 text-xs font-semibold text-title hover:border-title transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
              <Link
                href="/account/post-job"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Post a Request</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {initialJobs.map((job) => (
              <JobMarketplaceCard
                key={job._id}
                job={job}
                currentUserRole={currentUserRole}
                onSendProposal={(j) => setSelectedJobForProposal(j)}
              />
            ))}
          </div>
        )}
      </div>

      {/* PROPOSAL MODAL */}
      {selectedJobForProposal && (
        <SendProposalModal
          isOpen={Boolean(selectedJobForProposal)}
          onClose={() => setSelectedJobForProposal(null)}
          job={selectedJobForProposal}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  );
}

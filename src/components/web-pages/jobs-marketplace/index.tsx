"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, AlertCircle, Sparkles, PlusCircle } from "lucide-react";
import Link from "next/link";
import { JobsSearchHero } from "./components/JobsSearchHero";
import { JobMarketplaceFilters } from "./components/JobMarketplaceFilters";
import { JobMarketplaceCard } from "./components/JobMarketplaceCard";
import { SendProposalModal } from "./components/SendProposalModal";
import { Pagination } from "@/components/shared/Pagination";
import type { IJobsMarketplaceProps, IJobItem } from "./types";

export function JobsMarketplaceContainer({
  initialJobs,
  categories,
  totalJobs,
  pagination,
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
  const [selectedService, setSelectedService] = useState(
    initialParams?.service || searchParams.get("service") || "",
  );

  // Proposal modal state
  const [selectedJobForProposal, setSelectedJobForProposal] =
    useState<IJobItem | null>(null);

  const applyUrlParams = (newParams: {
    searchTerm?: string;
    category?: string;
    service?: string;
    page?: number;
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
      params.delete("page");
    }

    startTransition(() => {
      router.push(`/jobs?${params.toString()}`);
    });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    applyUrlParams({
      searchTerm: term,
      category: selectedCategory,
      service: selectedService,
    });
  };

  const handleFilterChange = (selection: {
    category?: string;
    service?: string;
    label?: string;
  }) => {
    const cat = selection.category || "";
    const srv = selection.service || "";
    setSelectedCategory(cat);
    setSelectedService(srv);
    applyUrlParams({
      searchTerm,
      category: cat,
      service: srv,
    });
  };

  const handlePageChange = (newPage: number) => {
    applyUrlParams({
      searchTerm,
      category: selectedCategory,
      service: selectedService,
      page: newPage,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedService("");
    startTransition(() => {
      router.push("/jobs");
    });
  };

  return (
    <div className="space-y-10">
      {/* HERO SECTION */}
      <JobsSearchHero />

      {/* FILTER BAR & SERVICE/CATEGORY MODAL */}
      <JobMarketplaceFilters
        categories={categories}
        selectedCategory={selectedCategory}
        selectedService={selectedService}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
        totalResults={initialJobs.length}
      />

      {/* ACTIVE JOBS FEED */}
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-title">
              Open job requests
            </h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {pagination ? pagination.total : initialJobs.length}
            </span>
          </div>

          {isPending && (
            <span className="text-sm font-semibold text-primary animate-pulse">
              Updating feed...
            </span>
          )}
        </div>

        {initialJobs.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 px-6 py-16 text-center ring-1 ring-slate-200">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-slate-200">
              <Briefcase className="h-8 w-8" strokeWidth={1.6} />
            </div>
            <h3 className="font-display text-2xl font-semibold text-title">
              No matching jobs found
            </h3>
            <p className="mt-2 text-[15px] text-copy max-w-md mx-auto">
              There are currently no active requests matching your search or
              category filter. Try clearing filters or checking back soon!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-title ring-1 ring-slate-300 hover:ring-title transition cursor-pointer"
              >
                Clear Filters
              </button>
              <Link
                href="/account/post-job"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Post a Request</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* PAGINATION */}
        {pagination && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
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

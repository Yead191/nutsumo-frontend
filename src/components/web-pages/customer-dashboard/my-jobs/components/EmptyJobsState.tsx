import Link from "next/link";
import { Plus, ClipboardList, RefreshCw } from "lucide-react";

interface EmptyJobsStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function EmptyJobsState({ isFiltered, onResetFilters }: EmptyJobsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white/60 p-12 text-center backdrop-blur-sm">
      <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-smoke text-[#FE375D] shadow-2xs">
        <ClipboardList className="h-8 w-8 stroke-[1.6]" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FE375D]/40" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-[#FE375D]" />
        </span>
      </div>

      <h3 className="font-display text-lg font-bold text-title">
        {isFiltered ? "No matching service requests" : "No service requests yet"}
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm text-muted leading-relaxed">
        {isFiltered
          ? "No jobs match your current search or status filter. Try clearing the filters to view all your requests."
          : "Need a plumber, electrician, carpenter, or painter? Post your job in 2 minutes and receive proposals from top verified local artisans."}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {isFiltered ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-title shadow-2xs hover:border-[#FE375D] hover:text-[#FE375D] transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>
        ) : (
          <Link
            href="/account/post-job"
            className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Post a New Request</span>
          </Link>
        )}
      </div>
    </div>
  );
}

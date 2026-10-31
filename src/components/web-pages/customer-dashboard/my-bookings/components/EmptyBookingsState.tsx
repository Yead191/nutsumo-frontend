import Link from "next/link";
import { CalendarCheck, Plus, RefreshCw } from "lucide-react";

interface EmptyBookingsStateProps {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}

export function EmptyBookingsState({
  isFiltered,
  onResetFilters,
}: EmptyBookingsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white/60 p-12 text-center backdrop-blur-sm">
      <div className="relative mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-smoke text-[#FE375D] shadow-2xs">
        <CalendarCheck className="h-8 w-8 stroke-[1.6]" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FE375D]/40" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-[#FE375D]" />
        </span>
      </div>

      <h3 className="font-display text-lg font-bold text-title">
        {isFiltered ? "No matching bookings found" : "No confirmed bookings yet"}
      </h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm text-muted leading-relaxed">
        {isFiltered
          ? "No bookings match your current filter. Try clearing filters to view all your orders."
          : "When you accept a quote from a local artisan, your confirmed contract, work schedule, and direct contact details will appear here."}
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
            href="/account"
            className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Review Active Requests</span>
          </Link>
        )}
      </div>
    </div>
  );
}

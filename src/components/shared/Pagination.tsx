"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface IPaginationData {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

interface PaginationProps {
  pagination?: IPaginationData | null;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export function Pagination({
  pagination,
  onPageChange,
  className,
}: PaginationProps) {
  if (!pagination || pagination.totalPage <= 1) {
    if (pagination && pagination.total > 0) {
      return (
        <div className={cn("text-xs text-muted text-center pt-4", className)}>
          Showing all {pagination.total} results
        </div>
      );
    }
    return null;
  }

  const { page, totalPage, total, limit } = pagination;
  const startItem = Math.min((page - 1) * limit + 1, total);
  const endItem = Math.min(page * limit, total);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPage <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPage - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPage - 2) {
        pages.push("...");
      }

      pages.push(totalPage);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-line/70 text-xs text-muted",
        className,
      )}
    >
      <div>
        Showing <strong className="text-title font-semibold">{startItem}</strong>{" "}
        to <strong className="text-title font-semibold">{endItem}</strong> of{" "}
        <strong className="text-title font-semibold">{total}</strong> jobs
      </div>

      <div className="flex items-center gap-1.5">
        {/* PREVIOUS BUTTON */}
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-line bg-white text-title hover:border-title disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* PAGE NUMBER BUTTONS */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-1.5 py-1 text-muted select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isCurrent = pageNum === page;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "h-8 min-w-8 px-2.5 rounded-xl font-semibold transition-all cursor-pointer text-xs",
                  isCurrent
                    ? "bg-[#FE375D] text-white shadow-xs"
                    : "border border-line bg-white text-title hover:border-title",
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* NEXT BUTTON */}
        <button
          type="button"
          disabled={page >= totalPage}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-line bg-white text-title hover:border-title disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

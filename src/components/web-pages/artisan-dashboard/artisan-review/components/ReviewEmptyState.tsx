"use client";

import { MessageSquare, Star, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FilterType } from "../types";

interface ReviewEmptyStateProps {
  selectedFilter: FilterType;
  totalReviews: number;
  onResetFilter: () => void;
  onRequestReview: () => void;
}

export function ReviewEmptyState({
  selectedFilter,
  totalReviews,
  onResetFilter,
  onRequestReview,
}: ReviewEmptyStateProps) {
  if (totalReviews === 0) {
    return (
      <Card className="rounded-xl border border-line/80 bg-white p-10 text-center shadow-xs">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Star className="h-6 w-6 fill-primary/20 text-primary" />
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-title">
          No Reviews Yet
        </h3>
        <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
          Start building your reputation on Nutsumo by inviting your past
          clients to leave verified feedback.
        </p>
        <div className="mt-5">
          <Button
            type="button"
            size="sm"
            onClick={onRequestReview}
            className="text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            Request a Review
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border border-line/80 bg-white p-8 text-center shadow-xs">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
        <MessageSquare className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-title">
        No reviews match the selected filter.
      </p>
      <p className="mt-1 text-xs text-muted">
        Try changing or resetting your active review filter.
      </p>
      <button
        type="button"
        onClick={onResetFilter}
        className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer"
      >
        Reset to all reviews
      </button>
    </Card>
  );
}

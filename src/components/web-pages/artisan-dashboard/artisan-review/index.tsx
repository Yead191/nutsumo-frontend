"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { revalidateTags } from "@/helpers/next-fetch/core/revalidateTags";
import {
  replyToReviewAction,
  type IReviewItem,
} from "@/helpers/next-fetch/apiActions/reviewActions";
import { ReviewStatsHeader } from "./components/ReviewStatsHeader";
import { RatingBreakdownCard } from "./components/RatingBreakdownCard";
import { ReviewFilterTabs } from "./components/ReviewFilterTabs";
import { ReviewCard } from "./components/ReviewCard";
import { RequestReviewModal } from "./components/RequestReviewModal";
import { ReviewEmptyState } from "./components/ReviewEmptyState";
import type {
  ArtisanReviewViewProps,
  FilterType,
  ReviewStats,
  RatingBreakdownItem,
} from "./types";

export default function ArtisanReviewView({
  initialReviews: reviews = [],
  profile,
}: ArtisanReviewViewProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Derive effective artisan identity directly from reviews if profile is null
  const effectiveArtisan = useMemo(() => {
    if (profile) return profile;
    const firstArtisan = reviews.find(
      (r) => r.artisan && typeof r.artisan === "object",
    )?.artisan;
    if (firstArtisan && typeof firstArtisan === "object") {
      return {
        _id: firstArtisan._id,
        name: firstArtisan.name,
        image: firstArtisan.image,
        location: firstArtisan.location,
      };
    }
    return null;
  }, [profile, reviews]);

  // Derived statistics for metrics and filters
  const stats: ReviewStats = useMemo(() => {
    if (!reviews.length) {
      return { avg: 0, total: 0, repliedCount: 0, needsReplyCount: 0 };
    }
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avg = Number((sum / reviews.length).toFixed(1));
    const repliedCount = reviews.filter((r) =>
      Boolean(r.reply?.comment),
    ).length;
    const needsReplyCount = reviews.filter((r) => !r.reply?.comment).length;
    return { avg, total: reviews.length, repliedCount, needsReplyCount };
  }, [reviews]);

  // Star Rating Breakdown (5 to 1) for visual distribution
  const breakdown: RatingBreakdownItem[] = useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(Math.max(Math.round(r.rating || 5), 1), 5);
      counts[star] = (counts[star] || 0) + 1;
    });

    const starKeys: Record<number, FilterType> = {
      5: "5-star",
      4: "4-star",
      3: "3-star",
      2: "2-star",
      1: "1-star",
    };

    return ([5, 4, 3, 2, 1] as const).map((star) => {
      const count = counts[star] || 0;
      const percentage =
        reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
      return { star, count, percentage, filterKey: starKeys[star] };
    });
  }, [reviews]);

  // Filter reviews dynamically based on current tab/star
  const filteredReviews = useMemo(() => {
    switch (selectedFilter) {
      case "needs-reply":
        return reviews.filter((r) => !r.reply?.comment);
      case "replied":
        return reviews.filter((r) => Boolean(r.reply?.comment));
      case "5-star":
        return reviews.filter((r) => Math.round(r.rating) === 5);
      case "4-star":
        return reviews.filter((r) => Math.round(r.rating) === 4);
      case "3-star":
        return reviews.filter((r) => Math.round(r.rating) === 3);
      case "2-star":
        return reviews.filter((r) => Math.round(r.rating) === 2);
      case "1-star":
        return reviews.filter((r) => Math.round(r.rating) === 1);
      default:
        return reviews;
    }
  }, [reviews, selectedFilter]);

  // Handle posting or updating artisan reply
  const handlePostReply = async (
    reviewId: string,
    comment: string,
  ): Promise<boolean> => {
    try {
      const res = await replyToReviewAction(reviewId, { comment });
      if (res.success || !res.error) {
        await revalidateTags(["reviews", "my-reviews"]);
        toast.success("Response posted publicly to client review.");
        return true;
      } else {
        toast.error(res.message || "Failed to post response");
        return false;
      }
    } catch {
      toast.error("Failed to post response. Please try again.");
      return false;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* 1. Header with Title & Direct Actions */}
      <ReviewStatsHeader
        profile={effectiveArtisan}
        onRequestReview={() => setShowRequestModal(true)}
      />

      {/* 2. Rating Breakdown Scorecard Widget */}
      <RatingBreakdownCard
        stats={stats}
        breakdown={breakdown}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* 3. Filter Tabs Row */}
      <ReviewFilterTabs
        stats={stats}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* 4. Review Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <ReviewEmptyState
            selectedFilter={selectedFilter}
            totalReviews={reviews.length}
            onResetFilter={() => setSelectedFilter("all")}
            onRequestReview={() => setShowRequestModal(true)}
          />
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              profile={effectiveArtisan}
              onPostReply={handlePostReply}
            />
          ))
        )}
      </div>

      {/* 5. Request Review Modal */}
      <RequestReviewModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        profile={effectiveArtisan}
      />
    </div>
  );
}

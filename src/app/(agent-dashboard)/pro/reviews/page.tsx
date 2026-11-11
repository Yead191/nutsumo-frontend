import ArtisanReviewView from "@/components/web-pages/artisan-dashboard/artisan-review";
import { getMyReviewsAction } from "@/helpers/next-fetch/apiActions/reviewActions";
import { getArtisanProfile } from "@/helpers/next-fetch/apiActions/artisanActions";
import React from "react";

export const metadata = {
  title: "Client Reviews · Nutsumo Professional",
  description: "Monitor customer ratings and manage public replies for your verified services.",
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    rating?: string;
  }>;
}

export default async function ProReviewsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp?.page) || 1);
  const limit = Math.max(1, Number(sp?.limit) || 20);
  const rating = sp?.rating ? Number(sp.rating) : undefined;

  const [reviewsRes, profileRes] = await Promise.all([
    getMyReviewsAction({ page, limit, rating }),
    getArtisanProfile(),
  ]);

  const initialReviews = reviewsRes?.data || [];
  const profile = profileRes?.data || null;

  return (
    <ArtisanReviewView
      initialReviews={initialReviews}
      profile={profile}
      pagination={reviewsRes?.pagination}
    />
  );
}

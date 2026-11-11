"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import { revalidatePath } from "next/cache";

export interface IReviewReply {
  comment: string;
  repliedAt: string;
}

export interface IReviewArtisan {
  _id: string;
  name: string;
  image?: string;
  verified?: boolean;
  location?: string;
}

export interface IReviewBooking {
  _id: string;
  bookingNumber: string;
  totalAmount?: number;
  completionDate?: string;
}

export interface IReviewCustomer {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  verified?: boolean;
}

export interface IReviewJob {
  _id: string;
  title: string;
  category?: string;
  service?: string;
  budget?: number;
  location?: string;
}

export interface IReviewItem {
  _id: string;
  booking: string | IReviewBooking;
  job?: IReviewJob;
  customer?: IReviewCustomer;
  artisan: string | IReviewArtisan;
  rating: number;
  comment: string;
  qualityRating?: number | null;
  communicationRating?: number | null;
  timelinessRating?: number | null;
  reply?: IReviewReply | null;
  isPublic: boolean;
  status: "ACTIVE" | "FLAGGED" | "HIDDEN";
  createdAt: string;
  updatedAt?: string;
}

export interface IReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    "5": number;
    "4": number;
    "3": number;
    "2": number;
    "1": number;
  };
}

export interface IArtisanReviewsResponse {
  summary: IReviewSummary;
  reviews: IReviewItem[];
}

export interface ICreateReviewPayload {
  booking: string;
  rating: number;
  comment: string;
  qualityRating?: number;
  communicationRating?: number;
  timelinessRating?: number;
}

export interface IGetReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
}

/**
 * POST /review — Customer submits detailed review & ratings for a completed booking
 */
export async function createReviewAction(
  payload: ICreateReviewPayload,
): Promise<FetchResponse<IReviewItem>> {
  const res = await nextFetch<IReviewItem>("/review", {
    method: "POST",
    body: payload,
  });

  if (res.success) {
    await revalidateTags([
      "reviews",
      "my-reviews",
      `booking-review-${payload.booking}`,
      "user-profile",
    ]);
    revalidatePath("/account/bookings");
    revalidatePath(`/account/bookings/${payload.booking}`);
    revalidatePath("/pro/reviews");
  }

  return res;
}

/**
 * GET /review/my-reviews — Retrieve reviews for authenticated user (Artisan or Customer)
 */
export async function getMyReviewsAction(
  params?: IGetReviewsParams,
): Promise<FetchResponse<IReviewItem[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.rating) query.set("rating", String(params.rating));

  const qs = query.toString();
  return nextFetch<IReviewItem[]>(`/review/my-reviews${qs ? `?${qs}` : ""}`, {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: 60 * 10,
    },
    tags: ["reviews", "my-reviews"],
  });
}

/**
 * GET /review/artisan/:artisanId — Public reviews and star summary distribution for an artisan
 */
export async function getArtisanReviewsAction(
  artisanId: string,
  params?: IGetReviewsParams,
): Promise<FetchResponse<IArtisanReviewsResponse>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.rating) query.set("rating", String(params.rating));

  const qs = query.toString();
  return nextFetch<IArtisanReviewsResponse>(
    `/review/artisan/${artisanId}${qs ? `?${qs}` : ""}`,
    {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 300 }, // 5 minutes cache with on-demand purge
      tags: ["reviews", `artisan-reviews-${artisanId}`],
    },
  );
}

/**
 * GET /review/booking/:bookingId — Fetch single booking review
 */
export async function getBookingReviewAction(
  bookingId: string,
): Promise<FetchResponse<IReviewItem>> {
  return nextFetch<IReviewItem>(`/review/booking/${bookingId}`, {
    method: "GET",
    cache: "no-store",
    tags: ["reviews", `booking-review-${bookingId}`],
  });
}

/**
 * PATCH /review/:id/reply — Artisan replies to customer review
 */
export async function replyToReviewAction(
  reviewId: string,
  payload: { comment: string },
): Promise<FetchResponse<IReviewItem>> {
  const res = await nextFetch<IReviewItem>(`/review/${reviewId}/reply`, {
    method: "PATCH",
    body: payload,
  });

  if (res.success) {
    await revalidateTags(["reviews", "my-reviews", `review-${reviewId}`]);
    revalidatePath("/pro/reviews");
  }

  return res;
}

/**
 * PATCH /review/:id — Customer edits/updates their existing review
 */
export async function updateReviewAction(
  reviewId: string,
  payload: Partial<ICreateReviewPayload>,
): Promise<FetchResponse<IReviewItem>> {
  const res = await nextFetch<IReviewItem>(`/review/${reviewId}`, {
    method: "PATCH",
    body: payload,
  });

  if (res.success) {
    await revalidateTags(["reviews", "my-reviews", `review-${reviewId}`]);
    revalidatePath("/pro/reviews");
    revalidatePath("/account/bookings");
  }

  return res;
}

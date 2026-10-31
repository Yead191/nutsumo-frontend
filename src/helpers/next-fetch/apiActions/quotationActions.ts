"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import { revalidatePath } from "next/cache";

export type QuotationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
export type RateType = "FIXED" | "HOURLY" | "DAILY";

export interface IQuotationArtisanProfile {
  businessName?: string;
  trade?: string;
  rating?: number;
  reviewsCount?: number;
  experienceYears?: number;
  hourlyRate?: number;
}

export interface IQuotationArtisan {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  location?: string;
  verified?: boolean;
  identityStatus?: string;
  artisanProfileData?: IQuotationArtisanProfile;
}

export interface IQuotationItem {
  _id: string;
  job: string | { _id: string; title: string; budget?: number; location?: string; status?: string };
  customer?: string | { _id: string; name?: string; image?: string };
  artisan: IQuotationArtisan;
  proposedAmount: number;
  rateType: RateType;
  estimatedDuration?: string;
  message: string;
  status: QuotationStatus;
  rejectReason?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IAcceptQuotationResult {
  quotation: {
    _id: string;
    status: "ACCEPTED";
    acceptedAt: string;
    proposedAmount: number;
    rateType: RateType;
  };
  booking: {
    _id: string;
    bookingNumber: string;
    job: string;
    quotation: string;
    customer: string;
    artisan: string;
    totalAmount: number;
    rateType: RateType;
    status: "CONFIRMED";
    paymentStatus: string;
    createdAt: string;
  };
  job: {
    _id: string;
    title: string;
    status: "BOOKED";
    selectedQuotation: string;
    selectedArtisan: string;
  };
}

/**
 * GET /quotations/job/:jobId — Customer or Admin retrieves all quotations for a specific job
 */
export async function getJobQuotationsAction(
  jobId: string,
): Promise<FetchResponse<IQuotationItem[]>> {
  return nextFetch<IQuotationItem[]>(`/quotations/job/${jobId}`, {
    method: "GET",
    cache: "no-store",
    tags: ["quotations", `job-quotations-${jobId}`],
  });
}

/**
 * PATCH /quotations/:id/accept — Customer accepts a proposal (atomic booking creation)
 */
export async function acceptQuotationAction(
  quotationId: string,
  jobId?: string,
): Promise<FetchResponse<IAcceptQuotationResult>> {
  const result = await nextFetch<IAcceptQuotationResult>(`/quotations/${quotationId}/accept`, {
    method: "PATCH",
  });

  if (result.success) {
    const tagsToInvalidate = [
      "quotations",
      "jobs",
      "my-jobs",
      "bookings",
      "my-bookings",
    ];
    if (jobId) {
      tagsToInvalidate.push(`job-quotations-${jobId}`, `job-${jobId}`);
    }
    await revalidateTags(tagsToInvalidate);
    revalidatePath("/account");
    if (jobId) revalidatePath(`/account/jobs/${jobId}`);
    revalidatePath("/account/bookings");
    revalidatePath("/pro/jobs");
    revalidatePath("/pro/bookings");
  }

  return result;
}

/**
 * PATCH /quotations/:id/reject — Customer rejects a proposal with optional reason
 */
export async function rejectQuotationAction(
  quotationId: string,
  rejectReason?: string,
  jobId?: string,
): Promise<FetchResponse<IQuotationItem>> {
  const result = await nextFetch<IQuotationItem>(`/quotations/${quotationId}/reject`, {
    method: "PATCH",
    body: { rejectReason: rejectReason || "Declined by customer" },
  });

  if (result.success) {
    const tagsToInvalidate = ["quotations"];
    if (jobId) {
      tagsToInvalidate.push(`job-quotations-${jobId}`);
    }
    await revalidateTags(tagsToInvalidate);
    if (jobId) revalidatePath(`/account/jobs/${jobId}`);
  }

  return result;
}

/**
 * POST /quotations — Artisan submits a quotation for an open job
 */
export async function submitQuotationAction(payload: {
  job: string;
  proposedAmount: number;
  rateType: RateType;
  message: string;
  estimatedDuration?: string;
}): Promise<FetchResponse<IQuotationItem>> {
  const result = await nextFetch<IQuotationItem>("/quotations", {
    method: "POST",
    body: payload,
  });

  if (result.success) {
    await revalidateTags(["quotations", `job-quotations-${payload.job}`, "my-quotations"]);
    revalidatePath(`/pro/jobs/${payload.job}`);
    revalidatePath("/pro/jobs");
  }

  return result;
}

/**
 * GET /quotations/my-quotations — Artisan retrieves their submitted quotations
 */
export async function getMyQuotationsAction(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<FetchResponse<IQuotationItem[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status && params.status !== "ALL") query.set("status", params.status);

  const qs = query.toString();
  const path = qs ? `?${qs}` : "";

  return nextFetch<IQuotationItem[]>(`/quotations/my-quotations${path}`, {
    method: "GET",
    cache: "no-store",
    tags: ["my-quotations", "quotations"],
  });
}

/**
 * PATCH /quotations/:id/withdraw — Artisan withdraws their pending quotation
 */
export async function withdrawQuotationAction(
  quotationId: string,
  jobId?: string,
): Promise<FetchResponse<IQuotationItem>> {
  const result = await nextFetch<IQuotationItem>(`/quotations/${quotationId}/withdraw`, {
    method: "PATCH",
  });

  if (result.success) {
    const tagsToInvalidate = ["quotations", "my-quotations"];
    if (jobId) tagsToInvalidate.push(`job-quotations-${jobId}`);
    await revalidateTags(tagsToInvalidate);
    if (jobId) revalidatePath(`/pro/jobs/${jobId}`);
  }

  return result;
}

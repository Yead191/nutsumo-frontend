"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import { revalidatePath } from "next/cache";

export type BookingStatus =
  | "AWAITING_PAYMENT"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "REVISION_REQUESTED"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type BookingPaymentStatus =
  | "UNPAID"
  | "ESCROW_HELD"
  | "PAID"
  | "REFUNDED";

export type BookingPayoutStatus =
  | "PENDING"
  | "APPROVED"
  | "RELEASED"
  | "REJECTED";

export interface IBookingJob {
  _id: string;
  title: string;
  location: string;
  budget?: number;
  status: string;
  category?: any;
  service?: any;
  images?: string[];
  preferredDate?: string;
}

export interface IBookingUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  image?: string;
  location?: string;
  verified?: boolean;
}

export interface IBookingQuotation {
  _id: string;
  proposedAmount: number;
  rateType: "HOURLY" | "DAILY" | "FIXED";
  estimatedDuration?: string;
  message?: string;
}

export interface IBookingItem {
  _id: string;
  bookingNumber: string;
  job: IBookingJob;
  quotation?: IBookingQuotation;
  customer: IBookingUser;
  artisan: IBookingUser;
  totalAmount: number;
  rateType: "HOURLY" | "DAILY" | "FIXED";
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  vatRate?: number;
  vatAmount?: number;
  nhilRate?: number;
  nhilAmount?: number;
  getFundLevyRate?: number;
  getFundLevyAmount?: number;
  platformCommissionRate?: number;
  platformFee?: number;
  artisanPayoutAmount?: number;
  stripeSessionId?: string;
  startDate?: string | null;
  completionDate?: string | null;
  deliveredAt?: string | null;
  deliveryNotes?: string | null;
  deliveryProof?: string[];
  revisionNotes?: string | null;
  revisionCount?: number;
  disputeReason?: string | null;
  disputedBy?: any;
  disputedAt?: string | null;
  review?: any;
  customerConfirmedAt?: string | null;
  customerRating?: number | null;
  customerFeedback?: string | null;
  payoutStatus?: BookingPayoutStatus;
  payoutApprovedAt?: string | null;
  payoutReleasedAt?: string | null;
  paidAt?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IGetBookingsParams {
  page?: number;
  limit?: number;
  status?: string;
  searchTerm?: string;
}

/**
 * GET /booking/my-bookings — Fetch authenticated user's confirmed bookings (Customer or Artisan)
 */
export async function getMyBookingsAction(
  params?: IGetBookingsParams,
): Promise<FetchResponse<IBookingItem[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status && params.status !== "ALL") query.set("status", params.status);
  if (params?.searchTerm?.trim()) query.set("searchTerm", params.searchTerm.trim());

  const qs = query.toString();
  const path = qs ? `?${qs}` : "";

  return nextFetch<IBookingItem[]>(`/booking/my-bookings${path}`, {
    method: "GET",
    cache: "no-store",
    tags: ["bookings", "my-bookings"],
  });
}

/**
 * GET /booking/:id — Fetch single booking details
 */
export async function getBookingDetailsAction(
  id: string,
): Promise<FetchResponse<IBookingItem>> {
  return nextFetch<IBookingItem>(`/booking/${id}`, {
    method: "GET",
    cache: "no-store",
    tags: ["bookings", `booking-${id}`],
  });
}

/**
 * POST /booking/:id/checkout-session — Customer initiates Stripe Escrow Checkout
 */
export async function createBookingCheckoutSessionAction(
  bookingId: string,
): Promise<FetchResponse<{ checkoutUrl: string; sessionId: string }>> {
  return nextFetch<{ checkoutUrl: string; sessionId: string }>(
    `/booking/${bookingId}/checkout-session`,
    {
      method: "POST",
    },
  );
}

/**
 * GET /booking/verify-payment?session_id=... — Instant UI verification callback after Stripe redirect
 */
export async function verifyBookingPaymentAction(
  sessionId: string,
): Promise<FetchResponse<IBookingItem>> {
  return nextFetch<IBookingItem>(
    `/booking/verify-payment?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
}

/**
 * PATCH /booking/:id/start-work — Artisan starts work once escrow is held
 */
export async function startBookingWorkAction(
  bookingId: string,
): Promise<FetchResponse<IBookingItem>> {
  const res = await nextFetch<IBookingItem>(`/booking/${bookingId}/start-work`, {
    method: "PATCH",
  });

  if (res.success) {
    await revalidateTags(["bookings", "my-bookings", `booking-${bookingId}`, "jobs", "my-jobs"]);
    revalidatePath("/account/bookings");
    revalidatePath(`/account/bookings/${bookingId}`);
    revalidatePath("/pro/bookings");
    revalidatePath("/pro/jobs");
  }

  return res;
}

/**
 * PATCH /booking/:id/deliver — Artisan delivers completed work with proof notes & photos
 * Accepts either FormData (with files in 'deliveryProof' or 'images') or JSON payload
 */
export async function deliverBookingWorkAction(
  bookingId: string,
  payload: FormData | { deliveryNotes: string; deliveryProof?: string[]; workImages?: string[] },
): Promise<FetchResponse<IBookingItem>> {
  const res = await nextFetch<IBookingItem>(`/booking/${bookingId}/deliver`, {
    method: "PATCH",
    body: payload,
  });

  if (res.success) {
    await revalidateTags(["bookings", "my-bookings", `booking-${bookingId}`, "jobs", "my-jobs"]);
    revalidatePath("/account/bookings");
    revalidatePath(`/account/bookings/${bookingId}`);
    revalidatePath("/pro/bookings");
    revalidatePath("/pro/jobs");
  }

  return res;
}

/**
 * PATCH /booking/:id/request-revision — Customer requests adjustments from the artisan
 */
export async function requestBookingRevisionAction(
  bookingId: string,
  payload: { revisionNotes: string },
): Promise<FetchResponse<IBookingItem>> {
  const res = await nextFetch<IBookingItem>(
    `/booking/${bookingId}/request-revision`,
    {
      method: "PATCH",
      body: payload,
    },
  );

  if (res.success) {
    await revalidateTags(["bookings", "my-bookings", `booking-${bookingId}`, "jobs", "my-jobs"]);
    revalidatePath("/account/bookings");
    revalidatePath(`/account/bookings/${bookingId}`);
    revalidatePath("/pro/bookings");
    revalidatePath("/pro/jobs");
  }

  return res;
}

/**
 * PATCH /booking/:id/dispute — Customer or Artisan initiates formal mediation by Admin
 */
export async function disputeBookingAction(
  bookingId: string,
  payload: { reason: string },
): Promise<FetchResponse<IBookingItem>> {
  const res = await nextFetch<IBookingItem>(
    `/booking/${bookingId}/dispute`,
    {
      method: "PATCH",
      body: payload,
    },
  );

  if (res.success) {
    await revalidateTags(["bookings", "my-bookings", `booking-${bookingId}`, "jobs", "my-jobs"]);
    revalidatePath("/account/bookings");
    revalidatePath(`/account/bookings/${bookingId}`);
    revalidatePath("/pro/bookings");
    revalidatePath("/pro/jobs");
  }

  return res;
}

/**
 * PATCH /booking/:id/confirm-completion — Customer inspects and approves completed work
 */
export async function confirmBookingCompletionAction(
  bookingId: string,
  payload: { rating?: number; feedback?: string },
): Promise<FetchResponse<IBookingItem>> {
  const res = await nextFetch<IBookingItem>(
    `/booking/${bookingId}/confirm-completion`,
    {
      method: "PATCH",
      body: payload,
    },
  );

  if (res.success) {
    await revalidateTags(["bookings", "my-bookings", `booking-${bookingId}`, "jobs", "my-jobs"]);
    revalidatePath("/account/bookings");
    revalidatePath(`/account/bookings/${bookingId}`);
    revalidatePath("/pro/bookings");
    revalidatePath("/pro/jobs");
  }

  return res;
}

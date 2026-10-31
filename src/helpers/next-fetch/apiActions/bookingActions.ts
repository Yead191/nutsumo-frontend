"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import { revalidatePath } from "next/cache";

export type BookingStatus = "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type BookingPaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

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
  startDate?: string | null;
  completionDate?: string | null;
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
 * GET /bookings/my-bookings — Fetch authenticated user's confirmed bookings (Customer or Artisan)
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

  return nextFetch<IBookingItem[]>(`/bookings/my-bookings${path}`, {
    method: "GET",
    cache: "no-store",
    tags: ["bookings", "my-bookings"],
  });
}

/**
 * GET /bookings/:id — Fetch single booking details
 */
export async function getBookingDetailsAction(
  id: string,
): Promise<FetchResponse<IBookingItem>> {
  return nextFetch<IBookingItem>(`/bookings/${id}`, {
    method: "GET",
    cache: "no-store",
    tags: ["bookings", `booking-${id}`],
  });
}

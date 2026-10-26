"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";

export interface IBookingSpeaker {
  name: string;
  role: string;
  avatar?: string;
}

export interface IBookingEvent {
  _id: string;
  title: string;
  description?: string;
  category?: "fundraiser" | "pitch-night" | "workshop" | "gala" | string;
  type?: "physical" | "virtual" | "hybrid" | string;
  pricingType?: "free" | "paid" | string;
  price?: number;
  capacity?: number;
  startDate: string;
  endDate?: string;
  location?: string;
  venueAddress?: string;
  virtualLink?: string;
  dressCode?: string;
  image?: string;
  speakers?: IBookingSpeaker[];
}

export interface IUserBooking {
  _id: string;
  event: IBookingEvent;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ticketCode?: string;
  qrCode?: string; // Base64 data URL
  checkedIn: boolean;
  checkedInAt?: string | null;
  quantity: number;
  price: number;
  status: "pending" | "confirmed" | "cancelled" | "attended" | string;
  paymentStatus: "pending" | "paid" | "free" | "failed" | "refunded" | string;
  note?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetMyBookingsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  paymentStatus?: string;
}

/**
 * Fetch authenticated user's event bookings
 */
export async function getMyBookings(
  params?: GetMyBookingsParams,
): Promise<FetchResponse<IUserBooking[]>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.searchTerm?.trim())
    query.set("searchTerm", params.searchTerm.trim());
  if (params?.status && params.status !== "all")
    query.set("status", params.status);
  if (params?.paymentStatus && params.paymentStatus !== "all") {
    query.set("paymentStatus", params.paymentStatus);
  }

  const qs = query.toString();
  const path = qs ? `?${qs}` : "";

  // Try /booking/my-bookings first, fallback to /booking
  let res = await nextFetch<IUserBooking[]>(`/booking/my-bookings${path}`, {
    method: "GET",
    cache: "no-store",
    tags: ["bookings"],
  });

  if (!res.success) {
    res = await nextFetch<IUserBooking[]>(`/booking${path}`, {
      method: "GET",
      cache: "no-store",
      tags: ["bookings"],
    });
  }

  return res;
}

/**
 * Fetch a single booking record by ID with full populated event and attendee details
 */
export async function getBookingDetails(
  id: string,
): Promise<FetchResponse<IUserBooking>> {
  return nextFetch<IUserBooking>(`/booking/${id}`, {
    method: "GET",
    cache: "no-store",
    tags: ["bookings", `booking-${id}`],
  });
}

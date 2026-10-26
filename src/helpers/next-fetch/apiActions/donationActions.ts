"use server";

import { nextFetch } from "../core/NextFetch";

export interface CreateDonationPayload {
  name: string;
  email: string;
  amount: number;
}

export interface DonationCheckoutResponse {
  paymentUrl: string;
}

/** POST /donation — creates Stripe checkout session and returns paymentUrl */
export async function createDonation(body: CreateDonationPayload) {
  const result = await nextFetch<DonationCheckoutResponse>("/donation", {
    method: "POST",
    body,
  });

  return result;
}

export interface IDonationItem {
  _id: string;
  name: string;
  email: string;
  amount: number;
  payment_status?: string;
  transactionId?: string;
  type: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MyStats {
  myOrders: number;
  myTotalDonation: number;
}

/** GET /dashboard/my-stats — returns logged in user's orders count and total donation */
export async function getMyStats() {
  return nextFetch<MyStats>("/dashboard/my-stats", {
    method: "GET",
    cache: "no-store",
  });
}

/** GET /donation — returns logged in user's donations (or all donations if admin) */
export async function getDonations(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params?.sort) query.set("sort", params.sort);

  const qs = query.toString();
  const endpoint = `/donation${qs ? `?${qs}` : ""}`;
  return nextFetch<IDonationItem[]>(endpoint, {
    method: "GET",
    next: { tags: ["donations"] },
    cache: "no-store",
  });
}

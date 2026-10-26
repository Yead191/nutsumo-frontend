"use server";

import { nextFetch } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import type { IOrder } from "@/types";

export interface CreateOrderPayload {
  country: string;
  city: string;
  postal_code: string;
  street_address: string;
  contact_number: string;
}

/** POST /order — creates order and returns Stripe checkout URL on `data`. */
export async function createOrder(body: CreateOrderPayload) {
  const result = await nextFetch<string>("/order", {
    method: "POST",
    body,
  });

  if (result.success) {
    await revalidateTags(["cart", "orders"]);
  }

  return result;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  payment_status?: string;
  sort?: string;
}

/** GET /order — returns customer's orders (or all orders if admin) */
export async function getOrders(params?: GetOrdersParams) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params?.status && params.status !== "all")
    query.set("status", params.status);
  if (params?.payment_status && params.payment_status !== "all") {
    query.set("payment_status", params.payment_status);
  }
  if (params?.sort) query.set("sort", params.sort);

  const qs = query.toString();
  const endpoint = `/order${qs ? `?${qs}` : ""}`;

  return nextFetch<IOrder[]>(endpoint, {
    method: "GET",
    next: { tags: ["orders"] },
    cache: "no-store",
  });
}

/** GET /order/:id — returns full order details */
export async function getOrderById(id: string) {
  return nextFetch<IOrder>(`/order/${id}`, {
    method: "GET",
    next: { tags: ["orders", `order-${id}`] },
    cache: "no-store",
  });
}

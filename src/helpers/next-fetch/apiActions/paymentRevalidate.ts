"use server";

import { revalidatePath } from "next/cache";

import { revalidateTags } from "../core/revalidateTags";

/**
 * Payment-success only: invalidate tagged data, then purge router/full-route
 * cache for the pages that depend on that data (membership, cart, nav).
 * Shared `revalidateTags` stays untouched for other callers.
 */
export async function revalidateAfterPayment(tags: string[]) {
  if (tags.length === 0) return;

  await revalidateTags(tags);

  if (tags.includes("user-profile")) {
    revalidatePath("/", "layout");
    revalidatePath("/membership");
    revalidatePath("/membership/vendor");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/subscriptions");
    revalidatePath("/forum", "layout");
  }

  if (tags.includes("cart")) {
    revalidatePath("/", "layout");
    revalidatePath("/checkout");
    revalidatePath("/office-supplies");
    revalidatePath("/dashboard/orders");
  }
}

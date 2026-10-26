"use server";

import type { TrialEligibility } from "@/types";
import { nextFetch } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";

/** POST /subscription/subscribe/:planId — returns a Stripe payment link in `data`. */
export async function subscribeToPlan(
  planId: string,
  body?: { auto_renew?: boolean },
) {
  return nextFetch(`/subscription/subscribe/${planId}`, {
    method: "POST",
    body: body ?? {},
  });
}

/** GET /subscription/trial-eligibility — whether the signed-in user can start a trial. */
export async function getTrialEligibility() {
  return nextFetch<TrialEligibility>("/subscription/trial-eligibility", {
    method: "GET",
    cache: "no-store",
  });
}

export type CancelType = "immediate" | "end_of_period";

/** PATCH /subscription/cancel */
export async function cancelSubscription(
  subscriptionId: string,
  cancelType: CancelType,
) {
  const result = await nextFetch("/subscription/cancel", {
    method: "PATCH",
    body: { subscriptionId, cancelType },
  });

  if (result.success) {
    await revalidateTags(["user-profile"]);
  }

  return result;
}

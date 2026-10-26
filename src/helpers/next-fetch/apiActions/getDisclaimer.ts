"use server";

import { nextFetch } from "../core/NextFetch";

export type DisclaimerType = "refund" | "user-terms" | "privacy";

/** GET /disclaimer?type=… — returns HTML string for legal pages. */
export async function getDisclaimer(type: DisclaimerType): Promise<string> {
  const res = await nextFetch<string>(`/disclaimer?type=${type}`, {
    method: "GET",
    cache: "force-cache",
    next: { tags: ["disclaimer", `disclaimer-${type}`], revalidate: 60 * 60 },
  });

  if (res.success && typeof res.data === "string") return res.data;
  return "";
}

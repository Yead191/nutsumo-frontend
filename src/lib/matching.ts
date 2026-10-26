import { getProDistance } from "@/lib/geo-distance";
import type { ListingVisibility } from "@/lib/admin-data";
import type { Job, Professional } from "@/types";

/**
 * Eligible professionals for an open job:
 * cleared, same trade, listing not suspended, within their service radius.
 * Membership for seed directory pros is assumed active in this demo;
 * the signed-in pro is still gated at quote-submit time.
 */
export function matchEligiblePros(
  job: Pick<Job, "categorySlug" | "zip" | "city">,
  professionals: Professional[],
  listingStatus: Record<string, ListingVisibility> = {},
): Professional[] {
  return professionals.filter((pro) => isProEligibleForJob(pro, job, listingStatus));
}

export function isProEligibleForJob(
  pro: Professional,
  job: Pick<Job, "categorySlug" | "zip" | "city" | "visibility" | "requestedProId" | "matchedProIds">,
  listingStatus: Record<string, ListingVisibility> = {},
): boolean {
  if (job.visibility === "direct" || job.requestedProId) {
    return job.requestedProId === pro.id || Boolean(job.matchedProIds?.includes(pro.id));
  }
  if (pro.clearance !== "cleared") return false;
  if (pro.categorySlug !== job.categorySlug) return false;
  const listing = listingStatus[pro.id];
  if (listing === "suspended" || listing === "hidden") return false;
  if (job.matchedProIds?.length) return job.matchedProIds.includes(pro.id);
  const distance = getProDistance(pro, job.zip, { zip: job.zip, city: job.city });
  return distance <= pro.radiusMiles;
}

"use server";

import { nextFetch } from "../core/NextFetch";
import type { Partner, PartnerLogo, PartnerListParams } from "@/types";

/**
 * GET /partner — fetches public approved partners list with optional search and pagination.
 */
export async function getPartners(params: PartnerListParams = {}) {
  const queryParams = new URLSearchParams();

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params.limit) {
    queryParams.append("limit", params.limit.toString());
  }
  if (params.searchTerm) {
    queryParams.append("searchTerm", params.searchTerm.trim());
  }
  if (params.featured !== undefined) {
    queryParams.append("featured", params.featured.toString());
  }
  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const endpoint = `/partner${queryString ? `?${queryString}` : ""}`;

  const result = await nextFetch<Partner[]>(endpoint, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 60 * 60 * 12 },
    tags: ["partners"],
  });

  return result;
}

/**
 * GET /partner/logos — fetches lightweight list of approved partner logos for landing page carousels.
 */
export async function getPartnerLogos() {
  const result = await nextFetch<PartnerLogo[]>("/partner/logos", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 60 * 60 * 12 },
    tags: ["partner-logos"],
  });

  return result;
}

/**
 * GET /partner/:id — fetches a single partner's full profile.
 */
export async function getPartnerById(id: string) {
  const result = await nextFetch<Partner>(`/partner/${id}`, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 60 * 60 * 12 },
    tags: ["partners", `partner-${id}`],
  });

  return result;
}

/**
 * POST /partner/apply — submits a new partner application (requires authentication).
 */
export async function applyPartner(formData: FormData) {
  const result = await nextFetch<Partner>("/partner/apply", {
    method: "POST",
    body: formData,
  });

  return result;
}

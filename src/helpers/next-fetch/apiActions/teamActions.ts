"use server";

import { nextFetch } from "../core/NextFetch";

export interface TeamStats {
  totalDirectors: number;
  totalMembers: number;
  totalVolunteers: number;
  totalStaff?: number;
  totalVolunteersPending?: number;
}

/** GET /team/stats — fetches total active directors, core members and volunteers */
export async function getTeamStats() {
  const result = await nextFetch<TeamStats>("/team/stats", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 60 * 60 * 12 },
    tags: ["team-stats"],
  });
  return result;
}

/** GET /team — fetches paginated active team members with optional search and category filters */
export async function getTeamMembers(params: {
  category?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params.category && params.category !== "all") {
    // Map UI category labels to singular DB categories
    let dbCategory = params.category;
    if (params.category === "directors") dbCategory = "director";
    if (params.category === "members") dbCategory = "member";
    if (params.category === "volunteers") dbCategory = "volunteer";
    if (params.category === "staff") dbCategory = "staff";

    queryParams.append("category", dbCategory);
  }
  if (params.searchTerm) {
    queryParams.append("searchTerm", params.searchTerm);
  }
  if (params.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params.limit) {
    queryParams.append("limit", params.limit.toString());
  }
  queryParams.append("sort", "1");
  const result = await nextFetch(`/team?${queryParams.toString()}`, {
    method: "GET",
    next: { revalidate: 60 },
    tags: ["team"],
  });
  return result;
}

/** GET /team/:id — fetches a single active team member profile */
export async function getTeamMemberById(id: string) {
  const result = await nextFetch(`/team/${id}`, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 60 * 30 },
    tags: ["team", id],
  });

  if (result.success && result.data) {
    return result;
  }

  // Fallback check against list or mock items if direct ID query wasn't found
  try {
    const listRes = await getTeamMembers({ limit: 100 });
    if (listRes.success && Array.isArray(listRes.data)) {
      const match = listRes.data.find(
        (m: any) => m._id === id || m.id === id || String(m._id) === String(id),
      );
      if (match) {
        return { success: true, data: match };
      }
    }
  } catch {}

  return result;
}

/** POST /team/volunteer-apply — submits volunteer application */
export async function applyAsVolunteer(formData: FormData) {
  const result = await nextFetch("/team/volunteer-apply", {
    method: "POST",
    body: formData,
  });
  return result;
}

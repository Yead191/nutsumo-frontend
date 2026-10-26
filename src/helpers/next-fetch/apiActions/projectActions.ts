"use server";

import { nextFetch } from "../core/NextFetch";
import { FEATURED_PROJECTS } from "@/data/projects";

export interface ProjectApplicationPeriod {
  _id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  status: string;
}

export interface Project {
  _id: string;
  id?: string;
  slug?: string;
  name: string;
  description: string;
  location: string;
  grantAmount?: number;
  status: "Draft" | "Published" | "Archived" | string;
  category: string;
  founder?: string;
  year?: number | string;
  image?: string;
  imageUrl?: string;
  gallery?: string[];
  applicationPeriod?: ProjectApplicationPeriod | null;
  challenge?: string;
  approach?: string;
  outcome?: string;
  story?: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectsResponse {
  success: boolean;
  message?: string;
  data: Project[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

/** GET /project — fetches published projects with optional filters */
export async function getProjects(params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  featured?: boolean;
  sort?: string;
}): Promise<ProjectsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.set("page", params.page.toString());
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.searchTerm && params.searchTerm.trim()) {
    queryParams.set("searchTerm", params.searchTerm.trim());
  }
  if (params?.category && params.category !== "All") {
    queryParams.set("category", params.category);
  }
  if (params?.featured !== undefined) {
    queryParams.set("featured", params.featured.toString());
  }
  if (params?.sort) {
    queryParams.set("sort", params.sort);
  }

  const qs = queryParams.toString();
  const endpoint = `/project${qs ? `?${qs}` : ""}`;

  try {
    const result = await nextFetch<Project[]>(endpoint, {
      method: "GET",
      cache: "force-cache",
      next: { revalidate: 60 * 5 },
      tags: ["projects"],
    });

    if (result.success && Array.isArray(result.data)) {
      return {
        success: true,
        data: result.data,
        pagination: result.pagination || {
          page: params?.page || 1,
          limit: params?.limit || 12,
          total: result.data.length,
          totalPage: 1,
        },
      };
    }
  } catch (error) {
    console.error("Error fetching projects from API:", error);
  }

  // Fallback to demo projects if backend has no records yet
  let fallbackData: Project[] = FEATURED_PROJECTS.map((p) => ({
    _id: p.id,
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    location: p.location,
    grantAmount: p.grantAmount,
    status: "Published",
    category: p.category,
    founder: p.founder,
    year: Number(p.year) || 2026,
    image: p.imageUrl,
    imageUrl: p.imageUrl,
    gallery: p.gallery,
    challenge: p.challenge,
    approach: p.approach,
    outcome: p.outcome,
    story: p.story,
    featured: Boolean(p.featured),
  }));

  if (params?.category && params.category !== "All") {
    fallbackData = fallbackData.filter((p) => p.category === params.category);
  }
  if (params?.searchTerm) {
    const term = params.searchTerm.toLowerCase();
    fallbackData = fallbackData.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term),
    );
  }

  return {
    success: true,
    data: fallbackData,
    pagination: {
      page: 1,
      limit: params?.limit || 12,
      total: fallbackData.length,
      totalPage: 1,
    },
  };
}

/** GET /project/:id — fetches a single project by id or fallback slug */
export async function getProjectById(
  idOrSlug: string,
): Promise<{ success: boolean; data: Project | null }> {
  try {
    const result = await nextFetch<Project>(`/project/${idOrSlug}`, {
      method: "GET",
      next: { revalidate: 60 },
      tags: ["project", idOrSlug],
    });

    if (result.success && result.data) {
      return { success: true, data: result.data };
    }
  } catch {}

  // Fallback: check all projects list or mock data by _id, id, or slug
  try {
    const listRes = await getProjects({ limit: 100 });
    if (listRes.success && Array.isArray(listRes.data)) {
      const match = listRes.data.find(
        (p) =>
          p._id === idOrSlug ||
          p.id === idOrSlug ||
          p.slug === idOrSlug ||
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === idOrSlug,
      );
      if (match) {
        return { success: true, data: match };
      }
    }
  } catch {}

  // Check demo data directly
  const demoMatch = FEATURED_PROJECTS.find(
    (p) => p.slug === idOrSlug || p.id === idOrSlug,
  );
  if (demoMatch) {
    return {
      success: true,
      data: {
        _id: demoMatch.id,
        id: demoMatch.id,
        slug: demoMatch.slug,
        name: demoMatch.name,
        description: demoMatch.description,
        location: demoMatch.location,
        grantAmount: demoMatch.grantAmount,
        status: "Published",
        category: demoMatch.category,
        founder: demoMatch.founder,
        year: Number(demoMatch.year) || 2026,
        image: demoMatch.imageUrl,
        imageUrl: demoMatch.imageUrl,
        gallery: demoMatch.gallery,
        challenge: demoMatch.challenge,
        approach: demoMatch.approach,
        outcome: demoMatch.outcome,
        story: demoMatch.story,
        featured: Boolean(demoMatch.featured),
      },
    };
  }

  return { success: false, data: null };
}

/** Fetches featured spotlight projects */
export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  try {
    const res = await getProjects({ featured: true, limit });
    if (res.success && res.data.length > 0) {
      return res.data.slice(0, limit);
    }
  } catch {}

  const fallback = await getProjects({ limit });
  return fallback.data.slice(0, limit);
}

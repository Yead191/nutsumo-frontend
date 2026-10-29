"use server";

import { nextFetch } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";

// ============================================================================
// Cache TTL Constants (Senior Frontend Architecture)
// ============================================================================
// In-memory / Data-Cache TTLs with on-demand Tag Revalidation fallback
const ONE_HOUR = 60 * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_WEEK = ONE_DAY * 7;

/**
 * GET /user/profile — fetch authenticated artisan/user profile
 * Uses Data Cache ('force-cache') with 24h fallback + instant on-demand tag revalidation.
 */
export async function getArtisanProfile() {
  return nextFetch("/user/profile", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: ONE_DAY,
    },
    tags: ["user-profile"],
  });
}

/**
 * PATCH /user/profile — update authenticated artisan/user profile
 * Purges 'user-profile' tag from Next.js Data Cache upon successful update.
 */
export async function updateArtisanProfile(
  payload: FormData | Record<string, any>,
) {
  const result = await nextFetch("/user/profile", {
    method: "PATCH",
    body: payload,
  });

  if (result.success) {
    await revalidateTags(["user-profile"]);
  }

  return result;
}

/**
 * GET /service-category — fetch admin service categories with predefined services
 * Admin taxonomy changes very rarely; cached for up to 7 days with on-demand tagging.
 */
export async function getServiceCategories() {
  return nextFetch("/service-category", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: ONE_WEEK,
    },
    tags: ["service-categories"],
  });
}

/**
 * GET /portfolio/my-portfolio — fetch authenticated artisan's portfolio
 * Cached with 'force-cache' and invalidated on any portfolio mutation.
 */
export async function getMyPortfolio() {
  return nextFetch("/portfolio/my-portfolio", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: ONE_DAY,
    },
    tags: ["artisan-portfolio"],
  });
}

/**
 * GET /portfolio/artisan/:artisanId — fetch public portfolio for a specific artisan
 */
export async function getArtisanPortfolio(artisanId: string) {
  return nextFetch(`/portfolio/artisan/${artisanId}`, {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: ONE_DAY,
    },
    tags: ["artisan-portfolio", `artisan-portfolio-${artisanId}`],
  });
}

/**
 * GET /portfolio/:id — fetch single portfolio item details
 */
export async function getSinglePortfolioItem(id: string) {
  return nextFetch(`/portfolio/${id}`, {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: ONE_DAY,
    },
    tags: ["artisan-portfolio", `portfolio-${id}`],
  });
}

/**
 * POST /portfolio — create new portfolio project
 * Invalidates 'artisan-portfolio' cache so fresh projects are immediately visible.
 */
export async function createPortfolioItem(payload: {
  title: string;
  description: string;
  category: string;
  images: Array<{ url: string; type: "before" | "after" | "work" }>;
  completedAt?: string;
  isPublished?: boolean;
}) {
  const result = await nextFetch("/portfolio", {
    method: "POST",
    body: payload,
  });

  if (result.success) {
    await revalidateTags(["artisan-portfolio"]);
  }

  return result;
}

/**
 * PATCH /portfolio/:id — update existing portfolio item
 * Purges both global portfolio list and specific item caches.
 */
export async function updatePortfolioItem(
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    category: string;
    images: Array<{ url: string; type: "before" | "after" | "work" }>;
    completedAt?: string;
    isPublished?: boolean;
  }>,
) {
  const result = await nextFetch(`/portfolio/${id}`, {
    method: "PATCH",
    body: payload,
  });

  if (result.success) {
    await revalidateTags(["artisan-portfolio", `portfolio-${id}`]);
  }

  return result;
}

/**
 * DELETE /portfolio/:id — delete portfolio item
 * Invalidates portfolio cache tag on successful deletion.
 */
export async function deletePortfolioItem(id: string) {
  const result = await nextFetch(`/portfolio/${id}`, {
    method: "DELETE",
  });

  if (result.success) {
    await revalidateTags(["artisan-portfolio", `portfolio-${id}`]);
  }

  return result;
}

/**
 * GET /service — fetch catalog services with pagination & search
 */
export async function getCatalogServices(
  params: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    category?: string;
  } = {},
) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append("page", String(params.page));
  if (params.limit) searchParams.append("limit", String(params.limit));
  if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params.category) searchParams.append("category", params.category);

  const query = searchParams.toString();
  return nextFetch(`/service${query ? `?${query}` : ""}`, {
    method: "GET",
    cache: "no-store",
  });
}

/**
 * GET /artisan-service/my-services — fetch authenticated artisan's services
 */
export async function getArtisanSelectedServices() {
  return nextFetch("/artisan-service/my-services", {
    method: "GET",
    cache: "force-cache",
    next: {
      revalidate: ONE_HOUR,
    },
    tags: ["artisan-services"],
  });
}

/**
 * POST /artisan-service — add a service selection for the artisan
 */
export async function addArtisanService(payload: {
  service: string;
  rateAmount: number;
  rateType: "HOURLY" | "DAILY";
  description?: string;
  isActive?: boolean;
}) {
  const result = await nextFetch("/artisan-service", {
    method: "POST",
    body: payload,
  });

  if (result.success) {
    await revalidateTags(["artisan-services", "user-profile"]);
  }

  return result;
}

/**
 * PATCH /artisan-service/:id — update artisan service rate or status
 */
export async function updateArtisanService(
  id: string,
  payload: {
    rateAmount?: number;
    rateType?: "HOURLY" | "DAILY";
    description?: string;
    isActive?: boolean;
  },
) {
  const result = await nextFetch(`/artisan-service/${id}`, {
    method: "PATCH",
    body: payload,
  });

  if (result.success) {
    await revalidateTags(["artisan-services", "user-profile"]);
  }

  return result;
}

/**
 * DELETE /artisan-service/:id — remove artisan service selection
 */
export async function deleteArtisanService(id: string) {
  const result = await nextFetch(`/artisan-service/${id}`, {
    method: "DELETE",
  });

  if (result.success) {
    await revalidateTags(["artisan-services", "user-profile"]);
  }

  return result;
}

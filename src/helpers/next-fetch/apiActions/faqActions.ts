"use server";

import { nextFetch } from "../core/NextFetch";
import type { IFAQ, FAQListParams } from "@/types";

/**
 * GET /faq — fetches public FAQ categories with their nested Q&A items.
 * Public visitors receive only `isActive: true` records sorted by `order asc, createdAt asc`.
 */
export async function getFaqs(params: FAQListParams = {}) {
  const queryParams = new URLSearchParams();

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }
  if (params.limit) {
    queryParams.append("limit", params.limit.toString());
  } else {
    // Fetch all active categories (up to 100) for full category tabs and accordion rendering
    queryParams.append("limit", "100");
  }
  if (params.searchTerm && params.searchTerm.trim()) {
    queryParams.append("searchTerm", params.searchTerm.trim());
  }
  if (params.isActive !== undefined) {
    queryParams.append("isActive", params.isActive.toString());
  }
  if (params.sort) {
    queryParams.append("sort", params.sort);
  }

  const queryString = queryParams.toString();
  const endpoint = `/faq${queryString ? `?${queryString}` : ""}`;

  try {
    const result = await nextFetch<IFAQ[]>(endpoint, {
      method: "GET",
      next: {
        revalidate: 60,
        tags: ["faqs"],
      },
    });

    if (result.success && Array.isArray(result.data)) {
      return {
        success: true,
        data: result.data,
        pagination: result.pagination,
      };
    }

    return {
      success: false,
      message: result.message || "Failed to fetch FAQs",
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      data: [],
    };
  }
}

/**
 * GET /faq/:id — fetches a single FAQ category with its items.
 */
export async function getFaqById(id: string) {
  try {
    const result = await nextFetch<IFAQ>(`/faq/${id}`, {
      method: "GET",
      next: {
        revalidate: 60,
        tags: ["faqs", `faq-${id}`],
      },
    });

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
      data: null,
    };
  }
}

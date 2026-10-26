"use server";

import { nextFetch } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";

export type BLOG_STATUS = "draft" | "published" | "archived";

export interface IBlogCategory {
  _id: string;
  name: string;
  slug: string;
  blogCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBlogAuthor {
  _id: string;
  name: string;
  email?: string;
  image?: string;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  contain?: string;
  image?: string;
  category: IBlogCategory | string;
  author?: IBlogAuthor | string;
  tags?: string[];
  status: BLOG_STATUS | string;
  isFeatured: boolean;
  totalLikes?: number;
  totalComments?: number;
  isLikedByMe?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogComment {
  _id: string;
  blog: string;
  text: string;
  author: {
    _id: string;
    name: string;
    email?: string;
    image?: string;
    role?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  success: boolean;
  message?: string;
  data: IBlogComment[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface ToggleLikeResponse {
  success: boolean;
  message?: string;
  data?: {
    liked: boolean;
    totalLikes: number;
  };
}

export interface BlogsResponse {
  success: boolean;
  message?: string;
  data: IBlog[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface BlogCategoriesResponse {
  success: boolean;
  message?: string;
  data: IBlogCategory[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

/**
 * Fetch all published blogs from backend API
 */
export async function getBlogs({
  page = 1,
  limit = 12,
  searchTerm = "",
  category = "",
  isFeatured,
  sort = "-publishedAt -createdAt",
}: {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
  isFeatured?: boolean;
  sort?: string;
} = {}): Promise<BlogsResponse> {
  const params = new URLSearchParams();
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (searchTerm && searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }
  if (category && category !== "all" && category !== "All") {
    params.set("category", category);
  }
  if (typeof isFeatured === "boolean") {
    params.set("isFeatured", String(isFeatured));
  }
  if (sort) params.set("sort", sort);

  try {
    const tags = ["blogs"];
    if (category) tags.push(`blogs-category-${category}`);

    const res = await nextFetch<IBlog[]>(`/blog?${params.toString()}`, {
      cache: "force-cache",
      next: {
        revalidate: 60,
        tags,
      },
    });

    if (res.success && Array.isArray(res.data)) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch blogs",
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
 * Fetch a single blog post by slug or MongoDB ID
 */
export async function getSingleBlog(slugOrId: string): Promise<{
  success: boolean;
  data: IBlog | null;
  message?: string;
}> {
  try {
    const res = await nextFetch<IBlog>(`/blog/${slugOrId}`, {
      cache: "no-store",
      next: {
        tags: ["blogs", `blog-${slugOrId}`],
      },
    });

    if (res.success && res.data) {
      return { success: true, data: res.data };
    }

    return { success: false, data: null, message: res.message };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Fetch all public blog categories with article counts
 */
export async function getBlogCategories({
  searchTerm = "",
  sort = "name",
}: {
  searchTerm?: string;
  sort?: string;
} = {}): Promise<BlogCategoriesResponse> {
  const params = new URLSearchParams();
  if (searchTerm && searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }
  if (sort) params.set("sort", sort);

  try {
    const res = await nextFetch<IBlogCategory[]>(
      `/blog-category?${params.toString()}`,
      {
        cache: "force-cache",
        next: {
          revalidate: 60,
          tags: ["blog-categories"],
        },
      },
    );

    if (res.success && Array.isArray(res.data)) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch categories",
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
 * Toggle like on a blog article
 */
export async function toggleBlogLike(
  blogIdOrSlug: string,
): Promise<ToggleLikeResponse> {
  try {
    const res = await nextFetch<{ liked: boolean; totalLikes: number }>(
      `/like/${blogIdOrSlug}`,
      {
        method: "POST",
      },
    );

    if (res.success) {
      await revalidateTags(["blogs", `blog-${blogIdOrSlug}`]);
    }

    return res;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to toggle like",
    };
  }
}

/**
 * Fetch all comments for a blog article
 */
export async function getBlogComments(
  blogIdOrSlug: string,
  page = 1,
  limit = 20,
): Promise<CommentsResponse> {
  try {
    const res = await nextFetch<IBlogComment[]>(
      `/comment/${blogIdOrSlug}?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      },
    );

    if (res.success && Array.isArray(res.data)) {
      return {
        success: true,
        data: res.data,
        pagination: res.pagination,
      };
    }

    return {
      success: false,
      message: res.message || "Failed to fetch comments",
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
 * Create a new comment on a blog article
 */
export async function createBlogComment(
  blogIdOrSlug: string,
  text: string,
): Promise<{ success: boolean; data?: IBlogComment; message?: string }> {
  try {
    const res = await nextFetch<IBlogComment>(`/comment/${blogIdOrSlug}`, {
      method: "POST",
      body: { text },
    });

    if (res.success) {
      await revalidateTags(["blogs", `blog-${blogIdOrSlug}`]);
    }

    return res;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to post comment",
    };
  }
}

/**
 * Update an existing comment
 */
export async function updateBlogComment(
  commentId: string,
  text: string,
  blogIdOrSlug?: string,
): Promise<{ success: boolean; data?: IBlogComment; message?: string }> {
  try {
    const res = await nextFetch<IBlogComment>(`/comment/${commentId}`, {
      method: "PATCH",
      body: { text },
    });

    if (res.success && blogIdOrSlug) {
      await revalidateTags(["blogs", `blog-${blogIdOrSlug}`]);
    }

    return res;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update comment",
    };
  }
}

/**
 * Delete a comment
 */
export async function deleteBlogComment(
  commentId: string,
  blogIdOrSlug?: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await nextFetch<void>(`/comment/${commentId}`, {
      method: "DELETE",
    });

    if (res.success && blogIdOrSlug) {
      await revalidateTags(["blogs", `blog-${blogIdOrSlug}`]);
    }

    return res;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete comment",
    };
  }
}

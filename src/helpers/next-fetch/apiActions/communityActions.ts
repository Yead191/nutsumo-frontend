"use server";

import { nextFetch } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";

export interface IForumPostAuthor {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "USER" | string;
}

export interface ICommunityPost {
  _id: string;
  title?: string;
  content: string;
  images?: string[];
  author: IForumPostAuthor;
  isPinned: boolean;
  isLocked: boolean;
  status: "published" | "draft" | "archived";
  totalLikes: number;
  totalComments: number;
  isLikedByMe?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICommunityCommentAuthor {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  role?: string;
}

export interface ICommunityComment {
  _id: string;
  post: string;
  author: ICommunityCommentAuthor;
  text: string;
  parentComment?: string | null;
  totalLikes: number;
  totalReplies: number;
  isLikedByMe?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IToggleLikeResponse {
  liked: boolean;
  totalLikes: number;
}

export interface CommunityPostsResponse {
  success: boolean;
  data: ICommunityPost[];
  pagination?: {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  };
  message?: string;
}

export interface CommunityCommentsResponse {
  success: boolean;
  data: ICommunityComment[];
  pagination?: {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  };
  message?: string;
}

const COMMUNITY_TAGS: string[] = ["community-posts"];

/**
 * Fetch all published community forum announcements/discussions
 */
export async function getCommunityPosts({
  searchTerm = "",
  page = 1,
  limit = 20,
  status = "published",
  isPinned,
  sortBy,
}: {
  searchTerm?: string;
  page?: number;
  limit?: number;
  status?: "published" | "draft" | "archived";
  isPinned?: boolean;
  sortBy?: string;
} = {}): Promise<CommunityPostsResponse> {
  const params = new URLSearchParams();
  if (searchTerm && searchTerm.trim()) {
    params.set("searchTerm", searchTerm.trim());
  }
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  if (status) params.set("status", status);
  if (typeof isPinned === "boolean") params.set("isPinned", String(isPinned));
  if (sortBy) params.set("sortBy", sortBy);

  try {
    const res = await nextFetch<ICommunityPost[]>(
      `/community?${params.toString()}`,
      {
        cache: "no-store",
        next: {
          tags: [...COMMUNITY_TAGS],
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
      message: res.message || "Failed to fetch community posts",
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
 * Fetch a single community forum post by ID
 */
export async function getCommunityPostById(id: string): Promise<{
  success: boolean;
  data: ICommunityPost | null;
  message?: string;
}> {
  try {
    const res = await nextFetch<ICommunityPost>(`/community/${id}`, {
      cache: "no-store",
      next: {
        tags: [...COMMUNITY_TAGS, `community-post-${id}`],
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
 * Toggle like on a community forum post
 */
export async function toggleCommunityPostLike(
  postId: string,
): Promise<{ success: boolean; data?: IToggleLikeResponse; message?: string }> {
  try {
    const res = await nextFetch<IToggleLikeResponse>(
      `/community-like/${postId}`,
      {
        method: "POST",
      },
    );

    if (res.success) {
      await revalidateTags([...COMMUNITY_TAGS, `community-post-${postId}`]);
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
 * Fetch top-level comments for a community post
 */
export async function getCommunityComments(
  postId: string,
  page = 1,
  limit = 20,
): Promise<CommunityCommentsResponse> {
  try {
    const res = await nextFetch<ICommunityComment[]>(
      `/community-comment/${postId}?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
        next: {
          tags: [`community-comments-${postId}`],
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
 * Post a top-level comment on a community post
 */
export async function createCommunityComment(
  postId: string,
  text: string,
): Promise<{ success: boolean; data?: ICommunityComment; message?: string }> {
  try {
    const res = await nextFetch<ICommunityComment>(
      `/community-comment/${postId}`,
      {
        method: "POST",
        body: { text },
      },
    );

    if (res.success) {
      await revalidateTags([
        ...COMMUNITY_TAGS,
        `community-post-${postId}`,
        `community-comments-${postId}`,
      ]);
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
 * Fetch nested replies for a specific comment
 */
export async function getCommentReplies(
  commentId: string,
  page = 1,
  limit = 20,
): Promise<CommunityCommentsResponse> {
  try {
    const res = await nextFetch<ICommunityComment[]>(
      `/community-comment/${commentId}/replies?page=${page}&limit=${limit}`,
      {
        cache: "no-store",
        next: {
          tags: [`community-replies-${commentId}`],
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
      message: res.message || "Failed to fetch replies",
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
 * Post a reply to an existing comment
 */
export async function replyToCommunityComment(
  commentId: string,
  text: string,
  postId?: string,
): Promise<{ success: boolean; data?: ICommunityComment; message?: string }> {
  try {
    const res = await nextFetch<ICommunityComment>(
      `/community-comment/${commentId}/reply`,
      {
        method: "POST",
        body: { text },
      },
    );

    if (res.success) {
      const tags = [`community-replies-${commentId}`];
      if (postId) {
        tags.push(`community-post-${postId}`, `community-comments-${postId}`);
      }
      await revalidateTags(tags);
    }

    return res;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to post reply",
    };
  }
}

/**
 * Toggle like on a comment or nested reply
 */
export async function toggleCommentLike(
  commentId: string,
): Promise<{ success: boolean; data?: IToggleLikeResponse; message?: string }> {
  try {
    const res = await nextFetch<IToggleLikeResponse>(
      `/community-comment/${commentId}/like`,
      {
        method: "POST",
      },
    );

    return res;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to like comment",
    };
  }
}

/**
 * Edit an existing comment (author only)
 */
export async function updateCommunityComment(
  commentId: string,
  text: string,
  postId?: string,
): Promise<{ success: boolean; data?: ICommunityComment; message?: string }> {
  try {
    const res = await nextFetch<ICommunityComment>(
      `/community-comment/${commentId}`,
      {
        method: "PATCH",
        body: { text },
      },
    );

    if (res.success && postId) {
      await revalidateTags([`community-comments-${postId}`]);
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
 * Delete a comment or nested reply (author or admin)
 */
export async function deleteCommunityComment(
  commentId: string,
  postId?: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await nextFetch<{ success: boolean; message?: string }>(
      `/community-comment/${commentId}`,
      {
        method: "DELETE",
      },
    );

    if (res.success) {
      const tags = [...COMMUNITY_TAGS];
      if (postId) {
        tags.push(`community-post-${postId}`, `community-comments-${postId}`);
      }
      await revalidateTags(tags);
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

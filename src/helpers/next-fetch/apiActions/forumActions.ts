"use server";

import { nextFetch } from "../core/NextFetch";
import { revalidateTags } from "../core/revalidateTags";
import type { ForumCategory } from "@/types";

const FORUM_TAGS = ["forum-posts"] as const;

function postTags(postId?: string) {
  return postId
    ? [...FORUM_TAGS, `forum-post-${postId}`, `forum-comments-${postId}`]
    : [...FORUM_TAGS];
}

export async function createForumPost(body: {
  category: ForumCategory;
  content: string;
}) {
  const result = await nextFetch("/posts", { method: "POST", body });
  if (result.success) await revalidateTags([...FORUM_TAGS]);
  return result;
}

export async function updateForumPost(
  postId: string,
  body: { category: ForumCategory; content: string },
) {
  const result = await nextFetch(`/posts/${postId}`, {
    method: "PATCH",
    body,
  });
  if (result.success) await revalidateTags(postTags(postId));
  return result;
}

export async function deleteForumPost(postId: string) {
  const result = await nextFetch(`/posts/${postId}`, { method: "DELETE" });
  if (result.success) await revalidateTags(postTags(postId));
  return result;
}

export async function toggleForumLike(postId: string) {
  const result = await nextFetch(`/like/${postId}`, { method: "POST" });
  if (result.success) await revalidateTags(postTags(postId));
  return result;
}

export async function createForumComment(postId: string, text: string) {
  const result = await nextFetch(`/comment/${postId}`, {
    method: "POST",
    body: { text },
  });
  if (result.success) await revalidateTags(postTags(postId));
  return result;
}

export async function updateForumComment(commentId: string, text: string) {
  const result = await nextFetch(`/comment/${commentId}`, {
    method: "PATCH",
    body: { text },
  });
  if (result.success) await revalidateTags([...FORUM_TAGS]);
  return result;
}

export async function deleteForumComment(commentId: string, postId?: string) {
  const result = await nextFetch(`/comment/${commentId}`, {
    method: "DELETE",
  });
  if (result.success) await revalidateTags(postTags(postId));
  return result;
}

export async function reportForumPost(body: {
  post: string;
  reason: string;
  description: string;
}) {
  return nextFetch("/report", { method: "POST", body });
}

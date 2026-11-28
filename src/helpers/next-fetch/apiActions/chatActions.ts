"use server";

import { nextFetch, type FetchResponse } from "../core/NextFetch";

export interface IChatParticipant {
  _id: string;
  name: string;
  image?: string;
  role: "USER" | "ARTISAN" | string;
}

export interface IChatConversation {
  _id: string;
  participants: IChatParticipant[];
  job?: { _id: string; title: string; status?: string; budget?: number } | null;
  lastMessage?: string;
  lastMessageAt?: string | null;
  lastSender?: string | null;
  unreadCount?: number;
  updatedAt?: string;
}

export interface IChatMessage {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  images: string[];
  readBy: string[];
  createdAt: string;
}

/** GET /chat/conversations: the signed-in user's conversations, newest first. */
export async function getConversationsAction(): Promise<FetchResponse<IChatConversation[]>> {
  return nextFetch<IChatConversation[]>("/chat/conversations", { cache: "no-store" });
}

/** POST /chat/conversations: open (or reuse) a chat with another user. */
export async function startConversationAction(
  participantId: string,
  jobId?: string,
): Promise<FetchResponse<IChatConversation>> {
  return nextFetch<IChatConversation>("/chat/conversations", {
    method: "POST",
    body: { participantId, ...(jobId ? { jobId } : {}) },
  });
}

/** GET /chat/conversations/:id/messages: a page of messages (older than `before`). */
export async function getMessagesAction(
  conversationId: string,
  before?: string,
): Promise<FetchResponse<{ messages: IChatMessage[]; hasMore: boolean }>> {
  const qs = new URLSearchParams({ limit: "30" });
  if (before) qs.set("before", before);
  return nextFetch(`/chat/conversations/${conversationId}/messages?${qs}`, {
    cache: "no-store",
  });
}

/** POST /chat/conversations/:id/messages: text and/or up to 5 images (field "images"). */
export async function sendMessageAction(
  conversationId: string,
  formData: FormData,
): Promise<FetchResponse<IChatMessage>> {
  return nextFetch<IChatMessage>(`/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: formData,
  });
}

/** PATCH /chat/conversations/:id/read */
export async function markConversationReadAction(conversationId: string) {
  return nextFetch(`/chat/conversations/${conversationId}/read`, { method: "PATCH" });
}

/** GET /chat/unread-count: total unread messages across conversations. */
export async function getUnreadChatCountAction(): Promise<FetchResponse<{ total: number }>> {
  return nextFetch<{ total: number }>("/chat/unread-count", { cache: "no-store" });
}

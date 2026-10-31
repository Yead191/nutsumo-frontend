"use server";

import { nextFetch } from "@/helpers/next-fetch/core/NextFetch";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  path?: string;
  refId?: string;
  seen: boolean;
  sender?: { _id: string; name?: string; email?: string; image?: string } | null;
  receiver?: { _id: string } | string | null;
  createdAt: string;
  updatedAt?: string;
}

/** Nested shape returned by GET /notification. */
export interface NotificationsPayload {
  unreadCount: number;
  data: NotificationItem[];
}

export async function getNotificationsAction(
  page = 1,
  limit = 10,
  search?: string,
  seen?: boolean,
) {
  let url = `/notification?page=${page}&limit=${limit}&sort=-createdAt`;
  if (search && search.trim()) {
    url += `&searchTerm=${encodeURIComponent(search.trim())}`;
  }
  if (typeof seen === "boolean") {
    url += `&seen=${seen}`;
  }
  return nextFetch<NotificationsPayload>(url, {
    method: "GET",
    cache: "no-store",
    tags: ["notification"],
  });
}

export async function readNotificationAction(id: string) {
  return nextFetch(`/notification/${id}`, {
    method: "PATCH",
  });
}

export async function readAllNotificationsAction() {
  return nextFetch("/notification", {
    method: "PATCH",
  });
}

export async function deleteNotificationAction(id: string) {
  return nextFetch(`/notification/${id}`, {
    method: "DELETE",
  });
}

export async function clearAllNotificationsAction() {
  return nextFetch("/notification/clear-all", {
    method: "DELETE",
  });
}

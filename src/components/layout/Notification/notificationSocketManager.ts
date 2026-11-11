"use client";

import Cookies from "js-cookie";
import { io, type Socket } from "socket.io-client";
import { toast } from "sonner";

export interface PushNotificationData {
  _id?: string;
  id?: string;
  title?: string;
  message?: string;
  path?: string;
  seen?: boolean;
  createdAt?: string;
  [key: string]: any;
}

export type NotificationSubscriber = (notif?: PushNotificationData) => void;

interface SubscriberEntry {
  id: string;
  callback: NotificationSubscriber;
  role?: string;
  router?: { push: (url: string) => void };
}

// Module-level singletons to ensure only 1 socket connection exists per active user
let activeSocket: Socket | null = null;
let activeUserId: string | null = null;
const subscribers = new Map<string, SubscriberEntry>();

// Deduplication cache: stores notification keys with timestamp to prevent duplicate toasts
const recentNotificationCache = new Map<string, number>();
const TOAST_DEDUP_WINDOW_MS = 4000; // 4 seconds

/**
 * Deduplicate notification key from object
 */
export function getNotificationKey(notif?: PushNotificationData): string {
  if (!notif) return "";
  return (
    notif._id ||
    notif.id ||
    `${notif.title || ""}::${notif.message || ""}`
  ).trim();
}

/**
 * Nutsumo Domain-aware path resolution.
 */
export function resolveNotificationPath(
  path?: string,
  userRole?: string,
): string {
  if (!path) {
    return userRole === "ARTISAN"
      ? "/pro/notifications"
      : "/account/notifications";
  }

  let clean = path.trim();

  // Strip leading locale or duplicate slashes
  clean = clean.replace(/^\/(en|ht)/, "");
  if (!clean.startsWith("/")) {
    clean = `/${clean}`;
  }

  // Handle route mappings for Nutsumo
  if (clean === "/notifications" || clean === "/my-notifications") {
    return userRole === "ARTISAN"
      ? "/pro/notifications"
      : "/account/notifications";
  }
  if (clean === "/bookings" || clean === "/my-bookings") {
    return userRole === "ARTISAN" ? "/pro/jobs" : "/account/bookings";
  }
  if (clean === "/messages" || clean === "/chat") {
    return userRole === "ARTISAN" ? "/pro/messages" : "/account/messages";
  }
  if (clean === "/services" || clean === "/my-services") {
    return "/pro/services";
  }
  if (clean === "/portfolio") {
    return "/pro/portfolio";
  }
  if (clean === "/quotes" || clean === "/quotations") {
    return userRole === "ARTISAN" ? "/pro/jobs" : "/account/bookings";
  }
  if (clean === "/pricing" || clean === "/subscription") {
    return "/pro/pricing";
  }
  if (clean === "/verification" || clean === "/identity") {
    return "/pro/profile";
  }

  return clean;
}

/**
 * Interactive floating toast trigger with deterministic ID & timestamp deduplication.
 * Prevents Sonner from ever rendering duplicate stacked cards.
 */
export function showNotificationToast(
  notif?: PushNotificationData,
  role?: string,
  router?: { push: (url: string) => void },
): void {
  if (!notif?.title) return;

  const key = getNotificationKey(notif);
  if (!key) return;

  const now = Date.now();
  const lastShown = recentNotificationCache.get(key);

  // If this exact notification was displayed within the last 4 seconds, ignore!
  if (lastShown && now - lastShown < TOAST_DEDUP_WINDOW_MS) {
    return;
  }
  recentNotificationCache.set(key, now);

  // Clean up old entries from cache
  if (recentNotificationCache.size > 80) {
    for (const [k, time] of recentNotificationCache.entries()) {
      if (now - time > 12000) recentNotificationCache.delete(k);
    }
  }

  const destHref = resolveNotificationPath(notif.path, role);

  // Deterministic toast ID prevents Sonner from stacking duplicate toast cards
  toast(notif.title, {
    id: `notif-toast-${key}`,
    description: notif.message,
    action: destHref
      ? {
          label: "View",
          onClick: () => {
            if (router) {
              router.push(destHref);
            } else if (typeof window !== "undefined") {
              window.location.href = destHref;
            }
          },
        }
      : undefined,
  });
}

let subCounter = 0;

/**
 * Singleton socket subscription:
 * Multiple components (Desktop Nav, Mobile Nav, Notification page) share 1 single socket connection.
 * When a notification arrives:
 * 1. Toast is triggered ONCE.
 * 2. All active subscribers' callbacks are called silently to update unread counts & feeds.
 */
export function subscribeToNotificationSocket({
  userId,
  role,
  router,
  onNotify,
}: {
  userId: string;
  role?: string;
  router?: { push: (url: string) => void };
  onNotify?: NotificationSubscriber;
}): () => void {
  if (!userId || typeof window === "undefined") {
    return () => {};
  }

  const subId = `sub_${++subCounter}_${Date.now()}`;
  subscribers.set(subId, {
    id: subId,
    callback: onNotify || (() => {}),
    role,
    router,
  });

  // If socket is not yet created or userId changed, recreate connection
  if (!activeSocket || activeUserId !== userId) {
    if (activeSocket) {
      try {
        activeSocket.disconnect();
      } catch {}
      activeSocket = null;
    }

    activeUserId = userId;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://10.10.26.173:5005";

    const token = Cookies.get("accessToken");
    activeSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: token ? { token } : undefined,
    });

    const handleIncomingNotification = (notif?: PushNotificationData) => {
      if (!notif) return;

      // 1. Trigger toast once centrally (deduplicated by deterministic id & timestamp)
      const firstSubscriber = subscribers.values().next().value;
      const targetRole = firstSubscriber?.role || role;
      const targetRouter = firstSubscriber?.router || router;

      showNotificationToast(notif, targetRole, targetRouter);

      // 2. Broadcast to all active subscribers (e.g. desktop + mobile nav)
      // so their state / badges sync quietly
      subscribers.forEach((entry) => {
        try {
          entry.callback(notif);
        } catch (err) {
          console.error("Error in notification subscriber callback:", err);
        }
      });
    };

    activeSocket.on(`getNotification::${userId}`, handleIncomingNotification);
    activeSocket.on(`get-notification::${userId}`, handleIncomingNotification);
    activeSocket.on("connect_error", (err) => {
      console.warn("Notification socket notice:", err.message);
    });
  }

  // Cleanup function when a component unmounts
  return () => {
    subscribers.delete(subId);

    // If no more subscribers remain across the app, disconnect after a grace period
    if (subscribers.size === 0 && activeSocket) {
      setTimeout(() => {
        if (subscribers.size === 0 && activeSocket) {
          try {
            activeSocket.disconnect();
          } catch {}
          activeSocket = null;
          activeUserId = null;
        }
      }, 1000);
    }
  };
}

"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  Inbox,
  Loader2,
  MessageSquare,
  FileText,
  Calendar,
  Sparkles,
  Trash2,
  X,
  Briefcase,
  Star,
  ShieldCheck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { io, type Socket } from "socket.io-client";

import { cn } from "@/lib/cn";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  getNotificationsAction,
  readAllNotificationsAction,
  readNotificationAction,
  deleteNotificationAction,
  clearAllNotificationsAction,
  type NotificationItem,
  type NotificationsPayload,
} from "./actions";

interface TopbarNotificationsProps {
  userId?: string;
  role?: "ARTISAN" | "CUSTOMER" | "ADMIN" | string;
  className?: string;
}

const PAGE_LIMIT = 10;

/**
 * Format relative time (e.g., Just now, 5m ago, 2h ago, Yesterday, Oct 24)
 */
function formatRelativeTime(iso?: string) {
  if (!iso) return "";
  const dt = new Date(iso);
  const diff = Date.now() - dt.getTime();
  if (Number.isNaN(diff) || diff < 0) return "";
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Safely parse notification payload from API.
 */
function parsePayload(data: NotificationsPayload | undefined | null) {
  if (!data || typeof data !== "object") {
    return { list: [] as NotificationItem[], unreadCount: 0 };
  }
  const list = Array.isArray(data.data) ? data.data : [];
  const unreadCount =
    typeof data.unreadCount === "number"
      ? data.unreadCount
      : list.filter((n) => !n.seen).length;
  return { list, unreadCount };
}

/**
 * Nutsumo Domain-aware path resolution.
 */
export function resolveNotificationPath(
  path?: string,
  userRole?: string,
): string {
  if (!path) {
    return userRole === "ARTISAN" ? "/pro/notifications" : "/account/notifications";
  }

  let clean = path.trim();

  // Strip leading locale or duplicate slashes
  clean = clean.replace(/^\/(en|ht)/, "");
  if (!clean.startsWith("/")) {
    clean = `/${clean}`;
  }

  // Handle route mappings for Nutsumo
  if (clean === "/notifications" || clean === "/my-notifications") {
    return userRole === "ARTISAN" ? "/pro/notifications" : "/account/notifications";
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
 * Contextual icon & badge colors matching Nutsumo's brand palette.
 */
function getNotificationIcon(title: string = "", path: string = "") {
  const lower = `${title} ${path}`.toLowerCase();

  if (
    lower.includes("job") ||
    lower.includes("match") ||
    lower.includes("work") ||
    lower.includes("service")
  ) {
    return {
      Icon: Briefcase,
      badgeColor: "bg-rose-50 text-[#FE375D] border border-rose-100",
    };
  }
  if (
    lower.includes("quote") ||
    lower.includes("proposal") ||
    lower.includes("estimate") ||
    lower.includes("rate")
  ) {
    return {
      Icon: FileText,
      badgeColor: "bg-amber-50 text-amber-600 border border-amber-100",
    };
  }
  if (
    lower.includes("booking") ||
    lower.includes("schedule") ||
    lower.includes("appointment") ||
    lower.includes("calendar")
  ) {
    return {
      Icon: Calendar,
      badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    };
  }
  if (
    lower.includes("message") ||
    lower.includes("chat") ||
    lower.includes("inquiry") ||
    lower.includes("contact")
  ) {
    return {
      Icon: MessageSquare,
      badgeColor: "bg-blue-50 text-blue-600 border border-blue-100",
    };
  }
  if (
    lower.includes("review") ||
    lower.includes("rating") ||
    lower.includes("star") ||
    lower.includes("feedback")
  ) {
    return {
      Icon: Star,
      badgeColor: "bg-amber-50 text-amber-500 border border-amber-100",
    };
  }
  if (
    lower.includes("verify") ||
    lower.includes("security") ||
    lower.includes("badge") ||
    lower.includes("identity")
  ) {
    return {
      Icon: ShieldCheck,
      badgeColor: "bg-teal-50 text-teal-600 border border-teal-100",
    };
  }

  return {
    Icon: Sparkles,
    badgeColor: "bg-slate-50 text-slate-700 border border-slate-200",
  };
}

export function TopbarNotifications({
  userId,
  role,
  className,
}: TopbarNotificationsProps) {
  const router = useRouter();

  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [filter, setFilter] = React.useState<"all" | "unread">("all");
  const [isFetching, setIsFetching] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(1);

  const pageRef = React.useRef(1);
  const totalPageRef = React.useRef(1);
  const loadingMoreRef = React.useRef(false);
  const fetchingRef = React.useRef(false);
  const fetchGenRef = React.useRef(0);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const hasMore = page < totalPage;

  // Filtered list
  const displayedNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.seen);
    }
    return notifications;
  }, [notifications, filter]);

  // Sync latest from server
  const syncFromServer = React.useCallback(
    async (opts?: { quiet?: boolean }) => {
      if (!userId) return;

      const gen = ++fetchGenRef.current;
      fetchingRef.current = true;
      if (!opts?.quiet) setIsFetching(true);

      try {
        const res = await getNotificationsAction(1, PAGE_LIMIT);
        if (gen !== fetchGenRef.current) return;

        if (res.success) {
          const { list, unreadCount: count } = parsePayload(res.data);
          setNotifications(list);
          setUnreadCount(count);

          const nextPage = Number(res.pagination?.page) || 1;
          const nextTotal = Number(res.pagination?.totalPage) || 1;
          pageRef.current = nextPage;
          totalPageRef.current = nextTotal;
          setPage(nextPage);
          setTotalPage(nextTotal);
          loadingMoreRef.current = false;
        } else if (!opts?.quiet) {
          toast.error(res.message || "Failed to load notifications.");
        }
      } catch {
        if (!opts?.quiet && gen === fetchGenRef.current) {
          toast.error("Network error loading notifications.");
        }
      } finally {
        if (gen === fetchGenRef.current) {
          fetchingRef.current = false;
          setIsFetching(false);
        }
      }
    },
    [userId],
  );

  // Load more on scroll
  const loadMore = React.useCallback(async () => {
    if (
      !userId ||
      fetchingRef.current ||
      loadingMoreRef.current ||
      pageRef.current >= totalPageRef.current
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    const nextPage = pageRef.current + 1;
    const gen = fetchGenRef.current;

    try {
      const res = await getNotificationsAction(nextPage, PAGE_LIMIT);
      if (gen !== fetchGenRef.current) return;

      if (res.success) {
        const { list: incoming, unreadCount: count } = parsePayload(res.data);

        setNotifications((prev) => {
          const seenIds = new Set(prev.map((n) => n._id));
          const fresh = incoming.filter((n) => !seenIds.has(n._id));
          return fresh.length ? [...prev, ...fresh] : prev;
        });
        setUnreadCount(count);

        const resolvedPage = Number(res.pagination?.page) || nextPage;
        const resolvedTotal =
          Number(res.pagination?.totalPage) || totalPageRef.current;
        pageRef.current = resolvedPage;
        totalPageRef.current = resolvedTotal;
        setPage(resolvedPage);
        setTotalPage(resolvedTotal);
      }
    } finally {
      if (gen === fetchGenRef.current) {
        loadingMoreRef.current = false;
        setIsLoadingMore(false);
      }
    }
  }, [userId]);

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      void loadMore();
    }
  }

  // Initial fetch on mount
  React.useEffect(() => {
    void syncFromServer({ quiet: true });
  }, [syncFromServer]);

  // Click-outside listener & Escape key handler
  React.useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Socket.io real-time push notification listener
  React.useEffect(() => {
    if (!userId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://10.10.26.173:5005";

    if (!socketUrl) return;

    const token = Cookies.get("accessToken");
    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: token ? { token } : undefined,
    });

    const onNotify = (notif?: any) => {
      // 1. Silent sync to update counts & feed list
      void syncFromServer({ quiet: true });

      // 2. Interactive floating toast
      if (notif?.title) {
        const destHref = resolveNotificationPath(notif.path, role);

        toast(notif.title, {
          description: notif.message,
          action: destHref
            ? {
                label: "View",
                onClick: () => router.push(destHref),
              }
            : undefined,
        });
      }
    };

    socket.on(`getNotification::${userId}`, onNotify);
    socket.on(`get-notification::${userId}`, onNotify);
    socket.on("connect_error", (err) => {
      console.warn("Notification socket notice:", err.message);
    });

    return () => {
      socket.off(`getNotification::${userId}`, onNotify);
      socket.off(`get-notification::${userId}`, onNotify);
      socket.disconnect();
    };
  }, [userId, role, router, syncFromServer]);

  // Mark single item read and navigate
  const handleReadAndNavigate = async (notification: NotificationItem) => {
    const dest = resolveNotificationPath(notification.path, role);

    if (!notification.seen) {
      setNotifications((curr) =>
        curr.map((n) =>
          n._id === notification._id ? { ...n, seen: true } : n,
        ),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      void readNotificationAction(notification._id);
    }

    setOpen(false);
    if (dest) {
      router.push(dest);
    }
  };

  // Mark all read
  const handleReadAll = async () => {
    if (!notifications.length || unreadCount === 0) return;

    setNotifications((curr) => curr.map((n) => ({ ...n, seen: true })));
    setUnreadCount(0);

    const res = await readAllNotificationsAction();
    if (!res.success) {
      toast.error(res.message || "Failed to mark notifications as read.");
      void syncFromServer({ quiet: true });
    } else {
      toast.success("All notifications marked as read");
    }
  };

  // Mark single item read without navigating
  const handleMarkReadOnly = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const target = notifications.find((n) => n._id === id);
    if (!target || target.seen) return;

    setNotifications((curr) =>
      curr.map((n) => (n._id === id ? { ...n, seen: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    const res = await readNotificationAction(id);
    if (!res.success) {
      void syncFromServer({ quiet: true });
    }
  };

  // Delete single notification
  const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    const target = notifications.find((n) => n._id === id);
    setNotifications((curr) => curr.filter((n) => n._id !== id));
    if (target && !target.seen) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    const res = await deleteNotificationAction(id);
    if (!res.success) {
      toast.error(res.message || "Failed to delete notification.");
      void syncFromServer({ quiet: true });
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (!notifications.length) return;

    if (!window.confirm("Are you sure you want to clear all notifications?")) {
      return;
    }

    setNotifications([]);
    setUnreadCount(0);

    const res = await clearAllNotificationsAction();
    if (!res.success) {
      toast.error(res.message || "Failed to clear notifications.");
      void syncFromServer({ quiet: true });
    } else {
      toast.success("All notifications cleared");
    }
  };

  const notificationsPageRoute =
    role === "ARTISAN" ? "/pro/notifications" : "/account/notifications";

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* BELL TRIGGER BUTTON */}
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) {
            void syncFromServer({ quiet: true });
          }
        }}
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-2xs transition-all duration-200 hover:border-[#FE375D]/40 hover:text-[#FE375D] hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE375D]/40 cursor-pointer",
          open && "border-[#FE375D] text-[#FE375D] ring-2 ring-[#FE375D]/20",
          className,
        )}
        title="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FE375D] px-1 text-[10px] font-bold text-white shadow-xs ring-2 ring-white animate-in zoom-in-75 duration-200">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* FLOATING NOTIFICATION POPUP (Tailwind CSS, No shadcn) */}
      {open && (
        <div
          role="dialog"
          aria-label="Notifications Panel"
          className="absolute right-0 top-full mt-2.5 w-[360px] sm:w-[420px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200/80 bg-white shadow-2xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 text-slate-800"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-sm font-bold text-slate-900 tracking-tight">
                Notifications
              </h3>
              {unreadCount > 0 ? (
                <span className="rounded-full bg-[#FE375D]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#FE375D]">
                  {unreadCount} new
                </span>
              ) : (
                <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                  Caught up
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => void handleReadAll()}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#FE375D] hover:bg-[#FE375D]/10 transition cursor-pointer"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => void handleClearAll()}
                  aria-label="Clear all notifications"
                  className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                  title="Clear all notifications"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* FILTER TABS */}
          {notifications.length > 0 && (
            <div className="border-b border-slate-100 bg-white px-3 py-2">
              <div className="flex items-center rounded-xl bg-slate-100/90 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={cn(
                    "flex-1 rounded-lg py-1 text-center font-semibold transition-all cursor-pointer",
                    filter === "all"
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("unread")}
                  className={cn(
                    "flex-1 rounded-lg py-1 text-center font-semibold transition-all cursor-pointer",
                    filter === "unread"
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-900",
                  )}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>
          )}

          {/* LIST CONTAINER */}
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-[380px] overflow-y-auto overscroll-contain divide-y divide-slate-100/80"
          >
            {isFetching && notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-xs text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-[#FE375D]" />
                <span>Loading notifications…</span>
              </div>
            ) : displayedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center space-y-2.5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                  <Inbox className="h-6 w-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {filter === "unread"
                      ? "No unread notifications"
                      : "You're all caught up!"}
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                    {filter === "unread"
                      ? "You've read all your notifications."
                      : "New updates, job requests, and quotes will appear here."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {displayedNotifications.map((notification) => {
                  const { Icon, badgeColor } = getNotificationIcon(
                    notification.title,
                    notification.path,
                  );
                  const senderAvatar = notification.sender?.image
                    ? getImageUrl(notification.sender.image)
                    : null;

                  return (
                    <div
                      key={notification._id}
                      onClick={() => void handleReadAndNavigate(notification)}
                      className={cn(
                        "group relative flex items-start gap-3 p-3.5 text-left transition-all duration-150 cursor-pointer",
                        notification.seen
                          ? "bg-white hover:bg-slate-50/80"
                          : "bg-slate-50/60 hover:bg-slate-100/70",
                      )}
                    >
                      {/* SENDER AVATAR OR CATEGORY ICON */}
                      <div className="relative shrink-0 mt-0.5">
                        {senderAvatar ? (
                          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 shadow-2xs">
                            <Image
                              src={senderAvatar}
                              alt={notification.sender?.name || "User"}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "grid h-10 w-10 place-items-center rounded-xl shadow-2xs transition-colors",
                              badgeColor,
                            )}
                          >
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                        )}

                        {/* Unread indicator dot */}
                        {!notification.seen && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FE375D] opacity-60" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FE375D] ring-2 ring-white" />
                          </span>
                        )}
                      </div>

                      {/* CONTENT BODY */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-xs leading-snug line-clamp-1",
                              notification.seen
                                ? "font-semibold text-slate-800"
                                : "font-bold text-slate-950",
                            )}
                          >
                            {notification.title}
                          </p>
                          {notification.createdAt && (
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 shrink-0 font-medium pt-0.5">
                              <Clock className="h-2.5 w-2.5" />
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                      </div>

                      {/* HOVER QUICK ACTIONS */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0 pl-1">
                        {!notification.seen && (
                          <button
                            type="button"
                            onClick={(e) => void handleMarkReadOnly(e, notification._id)}
                            className="grid h-7 w-7 place-items-center rounded-lg text-slate-600 hover:text-[#FE375D] hover:bg-[#FE375D]/10 transition cursor-pointer"
                            title="Mark as read"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteOne(e, notification._id)}
                          className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete notification"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* INFINITE SCROLL INDICATOR */}
                {isLoadingMore && (
                  <div className="flex items-center justify-center gap-1.5 py-3 text-xs text-slate-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#FE375D]" />
                    <span>Loading more…</span>
                  </div>
                )}

                {hasMore && !isLoadingMore && (
                  <div className="p-2 text-center bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => void loadMore()}
                      className="text-xs font-semibold text-[#FE375D] hover:underline py-1 cursor-pointer"
                    >
                      Load more notifications
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 text-center">
            <Link
              href={notificationsPageRoute}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FE375D] hover:text-[#e0284e] transition-colors"
            >
              <span>View All Notifications</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

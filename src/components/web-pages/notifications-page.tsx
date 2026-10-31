"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  CheckCheck,
  Search,
  Trash2,
  X,
  Briefcase,
  FileText,
  Calendar,
  MessageSquare,
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Filter,
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
} from "@/components/layout/Notification/actions";
import { resolveNotificationPath } from "@/components/layout/Notification/TopbarNotifications";

interface NotificationsPageProps {
  role?: "pro" | "homeowner" | string;
}

const PAGE_SIZE = 12;

type CategoryFilter = "all" | "unread" | "jobs" | "quotes" | "messages";

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
    year: "numeric",
  });
}

function getNotificationCategory(title: string = "", path: string = ""): CategoryFilter {
  const lower = `${title} ${path}`.toLowerCase();
  if (
    lower.includes("job") ||
    lower.includes("match") ||
    lower.includes("work") ||
    lower.includes("service")
  ) {
    return "jobs";
  }
  if (
    lower.includes("quote") ||
    lower.includes("booking") ||
    lower.includes("schedule") ||
    lower.includes("proposal") ||
    lower.includes("estimate")
  ) {
    return "quotes";
  }
  if (
    lower.includes("message") ||
    lower.includes("chat") ||
    lower.includes("inquiry") ||
    lower.includes("contact")
  ) {
    return "messages";
  }
  return "all";
}

function getCategoryIcon(title: string = "", path: string = "") {
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
      tag: "Job Match",
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
      tag: "Quotation",
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
      tag: "Booking",
    };
  }
  if (
    lower.includes("message") ||
    lower.includes("chat") ||
    lower.includes("inquiry")
  ) {
    return {
      Icon: MessageSquare,
      badgeColor: "bg-blue-50 text-blue-600 border border-blue-100",
      tag: "Message",
    };
  }
  if (
    lower.includes("review") ||
    lower.includes("rating") ||
    lower.includes("star")
  ) {
    return {
      Icon: Star,
      badgeColor: "bg-amber-50 text-amber-500 border border-amber-100",
      tag: "Review",
    };
  }
  if (
    lower.includes("verify") ||
    lower.includes("security") ||
    lower.includes("identity")
  ) {
    return {
      Icon: ShieldCheck,
      badgeColor: "bg-teal-50 text-teal-600 border border-teal-100",
      tag: "Security",
    };
  }

  return {
    Icon: Sparkles,
    badgeColor: "bg-slate-50 text-slate-700 border border-slate-200",
    tag: "System",
  };
}

export function NotificationsPage({ role }: NotificationsPageProps) {
  const router = useRouter();
  const isArtisanRole = role === "pro";

  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Filters & Search
  const [activeTab, setActiveTab] = React.useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Pagination
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalCount, setTotalCount] = React.useState(0);

  // Fetch notifications
  const loadNotifications = React.useCallback(
    async (targetPage = 1, search = "") => {
      setIsLoading(true);
      try {
        const res = await getNotificationsAction(
          targetPage,
          PAGE_SIZE,
          search || undefined,
        );
        if (res.success && res.data) {
          const raw = res.data as NotificationsPayload;
          const list = Array.isArray(raw.data) ? raw.data : [];
          setNotifications(list);
          setUnreadCount(
            typeof raw.unreadCount === "number"
              ? raw.unreadCount
              : list.filter((n) => !n.seen).length,
          );

          const resolvedPage = Number(res.pagination?.page) || targetPage;
          const resolvedTotal = Number(res.pagination?.totalPage) || 1;
          const resolvedCount = Number(res.pagination?.total) || list.length;
          setPage(resolvedPage);
          setTotalPages(resolvedTotal);
          setTotalCount(resolvedCount);
        } else {
          toast.error(res.message || "Failed to load notifications");
        }
      } catch {
        toast.error("Network error loading notifications");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    void loadNotifications(1, searchQuery);
  }, [loadNotifications, searchQuery]);

  // Real-time socket sync
  React.useEffect(() => {
    let userId: string | undefined;
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        userId = parsed._id || parsed.id;
      }
    } catch {}

    if (!userId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://10.10.26.173:5005";

    const token = Cookies.get("accessToken");
    const socket: Socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: token ? { token } : undefined,
    });

    const onNotify = (notif?: any) => {
      void loadNotifications(page, searchQuery);
      if (notif?.title) {
        toast(notif.title, {
          description: notif.message,
        });
      }
    };

    socket.on(`getNotification::${userId}`, onNotify);
    socket.on(`get-notification::${userId}`, onNotify);

    return () => {
      socket.off(`getNotification::${userId}`, onNotify);
      socket.off(`get-notification::${userId}`, onNotify);
      socket.disconnect();
    };
  }, [loadNotifications, page, searchQuery]);

  // Filtered list based on active category
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab === "unread") {
        return !item.seen;
      }
      if (activeTab === "jobs") {
        return getNotificationCategory(item.title, item.path) === "jobs";
      }
      if (activeTab === "quotes") {
        return getNotificationCategory(item.title, item.path) === "quotes";
      }
      if (activeTab === "messages") {
        return getNotificationCategory(item.title, item.path) === "messages";
      }
      return true;
    });
  }, [notifications, activeTab]);

  // Mark single as read
  const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, seen: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    const res = await readNotificationAction(id);
    if (!res.success) {
      void loadNotifications(page, searchQuery);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    if (!notifications.length || unreadCount === 0) return;
    setIsUpdating(true);
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    setUnreadCount(0);

    const res = await readAllNotificationsAction();
    setIsUpdating(false);
    if (!res.success) {
      toast.error(res.message || "Failed to mark all as read");
      void loadNotifications(page, searchQuery);
    } else {
      toast.success("All notifications marked as read");
    }
  };

  // Delete single notification
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const target = notifications.find((n) => n._id === id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (target && !target.seen) {
      setUnreadCount((c) => Math.max(0, c - 1));
    }

    const res = await deleteNotificationAction(id);
    if (!res.success) {
      toast.error(res.message || "Failed to delete notification");
      void loadNotifications(page, searchQuery);
    } else {
      toast.success("Notification deleted");
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    if (!notifications.length) return;
    if (!window.confirm("Are you sure you want to clear all notifications?")) {
      return;
    }

    setIsUpdating(true);
    setNotifications([]);
    setUnreadCount(0);

    const res = await clearAllNotificationsAction();
    setIsUpdating(false);
    if (!res.success) {
      toast.error(res.message || "Failed to clear notifications");
      void loadNotifications(page, searchQuery);
    } else {
      toast.success("All notifications cleared");
    }
  };

  // Navigate to notification destination
  const handleNavigate = (notification: NotificationItem) => {
    if (!notification.seen) {
      void handleMarkRead(notification._id);
    }
    const path = resolveNotificationPath(
      notification.path,
      isArtisanRole ? "ARTISAN" : "CUSTOMER",
    );
    if (path) {
      router.push(path);
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line/70 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-title tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 ? (
              <span className="inline-flex items-center rounded-full bg-[#FE375D]/10 px-3 py-1 text-xs font-bold text-[#FE375D] border border-[#FE375D]/20 animate-pulse">
                {unreadCount} unread
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-smoke px-3 py-1 text-xs font-medium text-muted border border-line">
                All caught up
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-copy">
            Stay updated with real-time job requests, proposals, schedule alerts, and system notices.
          </p>
        </div>

        {/* BULK ACTIONS */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => void handleMarkAllRead()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-semibold text-title shadow-2xs hover:border-[#FE375D] hover:text-[#FE375D] transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4 text-[#FE375D]" />
              <span>Mark all as read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => void handleClearAll()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold text-muted hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50/50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              title="Clear all notifications"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* CATEGORY TABS */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {(
            [
              { key: "all", label: "All" },
              { key: "unread", label: `Unread (${unreadCount})` },
              { key: "jobs", label: "Jobs & Work" },
              { key: "quotes", label: "Quotes & Bookings" },
              { key: "messages", label: "Messages" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-[#FE375D] text-white shadow-xs"
                    : "bg-white text-muted border border-line/70 hover:text-title hover:border-line",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SEARCH INPUT */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full rounded-xl border border-line bg-white pl-9 pr-8 py-2 text-xs text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-title cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* NOTIFICATIONS CONTENT */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-line/80 bg-white p-4.5 animate-pulse"
            >
              <div className="h-11 w-11 rounded-xl bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-slate-200 rounded" />
                <div className="h-3.5 w-2/3 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-line border-dashed bg-white p-12 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-smoke text-[#FE375D]/80 mb-4">
            <Inbox className="h-8 w-8 stroke-[1.5]" />
          </div>
          <h3 className="font-display text-lg font-bold text-title">
            {activeTab === "unread"
              ? "No unread notifications"
              : searchQuery
                ? "No matching notifications"
                : "No notifications found"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-copy leading-relaxed">
            {activeTab === "unread"
              ? "You have acknowledged all recent notifications. Great job keeping up!"
              : searchQuery
                ? `No notifications found matching "${searchQuery}". Try a different keyword.`
                : "You will receive updates whenever new jobs match your skills, clients send inquiries, or updates occur."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-xl border border-line bg-smoke px-4 py-2 text-xs font-semibold text-title hover:border-[#FE375D] transition-colors cursor-pointer"
            >
              Clear search filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((note) => {
            const { Icon, badgeColor, tag } = getCategoryIcon(note.title, note.path);
            const senderAvatar = note.sender?.image
              ? getImageUrl(note.sender.image)
              : null;
            const targetPath = resolveNotificationPath(
              note.path,
              isArtisanRole ? "ARTISAN" : "CUSTOMER",
            );

            return (
              <div
                key={note._id}
                onClick={() => handleNavigate(note)}
                className={cn(
                  "group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4.5 transition-all duration-200 cursor-pointer",
                  note.seen
                    ? "border-line/70 bg-white hover:border-[#FE375D]/40 hover:shadow-xs"
                    : "border-rose-200/80 bg-rose-50/20 hover:border-[#FE375D] hover:bg-rose-50/40 shadow-xs",
                )}
              >
                {/* LEFT: AVATAR / ICON & TEXT */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* ICON OR SENDER AVATAR */}
                  <div className="relative shrink-0 mt-0.5">
                    {senderAvatar ? (
                      <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-line shadow-2xs">
                        <Image
                          src={senderAvatar}
                          alt={note.sender?.name || "User"}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "grid h-11 w-11 place-items-center rounded-xl shadow-2xs transition-colors",
                          badgeColor,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    )}

                    {/* UNREAD GLOW PIN */}
                    {!note.seen && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FE375D] opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#FE375D] ring-2 ring-white" />
                      </span>
                    )}
                  </div>

                  {/* BODY CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-smoke px-2 py-0.5 text-[10px] font-bold text-muted border border-line">
                        {tag}
                      </span>
                      <h3
                        className={cn(
                          "font-display text-sm leading-snug truncate",
                          note.seen
                            ? "font-semibold text-title"
                            : "font-bold text-title",
                        )}
                      >
                        {note.title}
                      </h3>
                    </div>

                    <p className="mt-1 text-xs text-copy leading-relaxed line-clamp-2">
                      {note.message}
                    </p>

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
                      {note.createdAt && (
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(note.createdAt)}
                        </span>
                      )}
                      {note.sender?.name && (
                        <span>
                          From: <strong className="text-title">{note.sender.name}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT: ACTIONS */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-line/50 w-full sm:w-auto justify-end">
                  {targetPath && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FE375D] group-hover:translate-x-0.5 transition-transform">
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}

                  {!note.seen && (
                    <button
                      type="button"
                      onClick={(e) => void handleMarkRead(note._id, e)}
                      className="grid h-8 w-8 place-items-center rounded-xl border border-line bg-white text-muted hover:border-[#FE375D] hover:text-[#FE375D] transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => void handleDelete(note._id, e)}
                    className="grid h-8 w-8 place-items-center rounded-xl border border-line bg-white text-muted hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-line/70 pt-4">
          <p className="text-xs text-muted">
            Showing Page <strong className="text-title">{page}</strong> of{" "}
            <strong className="text-title">{totalPages}</strong> ({totalCount} total)
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => void loadNotifications(page - 1, searchQuery)}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-semibold text-title hover:border-[#FE375D] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() => void loadNotifications(page + 1, searchQuery)}
              className="inline-flex items-center gap-1 rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-semibold text-title hover:border-[#FE375D] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

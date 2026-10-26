"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { markAllNotificationsRead, markNotificationRead } from "@/redux/slices/featuresSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export function NotificationsPage({ role }: { role: "homeowner" | "pro" }) {
  const dispatch = useAppDispatch();
  const notes = useAppSelector((state) =>
    state.features.notifications.filter((item) => item.role === role || item.role === "all"),
  );
  const unread = notes.filter((item) => !item.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-line/70 pb-4 pt-1">
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-[22px] sm:text-[26px] font-semibold text-title tracking-tight">
            Notifications
          </h1>
          {unread > 0 ? (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              {unread} unread
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-smoke px-2.5 py-0.5 text-xs font-semibold text-muted border border-line">
              All caught up
            </span>
          )}
        </div>
        {unread > 0 ? (
          <button
            type="button"
            onClick={() => dispatch(markAllNotificationsRead(role))}
            className="font-display text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
          >
            Mark all as read
          </button>
        ) : null}
      </div>

      {notes.length === 0 ? (
        <div className="mt-5">
          <EmptyState title="No notifications" description="Quotes and messages show up here." />
        </div>
      ) : (
        <ul className="mt-4 overflow-hidden rounded-[14px] border border-line bg-white">
          {notes.map((note, index) => (
            <li
              key={note.id}
              className={cn(
                "flex gap-2.5 px-3.5 py-3 md:px-4",
                index > 0 && "border-t border-line",
                !note.read && "bg-smoke/50",
              )}
            >
              <span
                className={cn(
                  "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                  note.read ? "bg-transparent" : "bg-primary",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={note.href}
                    onClick={() => {
                      if (!note.read) dispatch(markNotificationRead(note.id));
                    }}
                    className="font-display text-sm font-bold leading-5 text-title hover:text-primary"
                  >
                    {note.title}
                  </Link>
                  <time className="shrink-0 text-[11px] leading-5 text-muted">{note.createdAt}</time>
                </div>
                <p className="mt-0.5 text-sm leading-5 text-copy">{note.body}</p>
                <div className="mt-1.5 flex flex-wrap gap-3 text-[13px]">
                  <Link
                    href={note.href}
                    onClick={() => {
                      if (!note.read) dispatch(markNotificationRead(note.id));
                    }}
                    className="font-semibold text-primary"
                  >
                    Open
                  </Link>
                  {!note.read ? (
                    <button
                      type="button"
                      onClick={() => dispatch(markNotificationRead(note.id))}
                      className="font-semibold text-muted hover:text-title"
                    >
                      Mark read
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

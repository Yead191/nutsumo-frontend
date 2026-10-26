"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  Briefcase,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileCheck,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/cn";

function getSidebarIcon(label: string) {
  const norm = label.toLowerCase();
  if (norm.includes("booking")) return CalendarCheck;
  if (norm.includes("dashboard") || norm.includes("overview")) return LayoutDashboard;
  if (norm.includes("post")) return PlusCircle;
  if (norm.includes("request") || norm.includes("job")) return ClipboardList;
  if (norm.includes("message")) return MessageSquare;
  if (norm.includes("saved")) return Bookmark;
  if (norm.includes("notification")) return Bell;
  if (norm.includes("review")) return Star;
  if (norm.includes("application") || norm.includes("verif")) return FileCheck;
  if (norm.includes("dispute")) return ShieldCheck;
  if (norm.includes("professional") || norm.includes("member")) return UserRound;
  if (norm.includes("profile")) return UserRound;
  if (norm.includes("security")) return ShieldCheck;
  if (norm.includes("password")) return KeyRound;
  if (norm.includes("subscription") || norm.includes("membership") || norm.includes("pricing")) return CreditCard;
  return Briefcase;
}

export function DashboardSidebar({
  items,
}: {
  items: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 self-start md:w-64 lg:w-72">
      <nav
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 md:flex-col md:overflow-visible md:rounded-[20px] md:border md:border-line/70 md:bg-white md:p-2.5 md:shadow-xs"
        aria-label="Account"
      >
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/account/bookings" && pathname.startsWith("/account/bookings")) ||
            (item.href === "/account" && pathname === "/account") ||
            (item.href === "/pro/jobs" && pathname.startsWith("/pro/jobs/")) ||
            (item.href === "/pro/pricing" && pathname.startsWith("/pro/transactions")) ||
            (item.href === "/account/messages" && pathname.startsWith("/account/messages")) ||
            (item.href === "/pro/messages" && pathname.startsWith("/pro/messages"));
          const Icon = getSidebarIcon(item.label);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex shrink-0 items-center justify-between gap-3 rounded-[12px] px-3.5 py-2.5 font-display text-[14px] font-medium transition-all duration-200",
                active
                  ? "bg-primary text-white shadow-sm font-semibold"
                  : "border border-line bg-white text-title hover:bg-smoke hover:text-primary md:border-transparent",
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-white" : "text-muted group-hover:text-primary",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <ChevronRight
                className={cn(
                  "hidden h-3.5 w-3.5 shrink-0 transition-transform md:block",
                  active
                    ? "text-white/80"
                    : "text-muted/40 group-hover:translate-x-0.5 group-hover:text-primary",
                )}
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

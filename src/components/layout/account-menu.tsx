"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Repeat,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/cn";
import type { User } from "@/types";

function roleLabel(role: User["role"]) {
  if (role === "pro") return "Verified Pro";
  return "Homeowner";
}

export function AccountMenu({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }
  const rootRef = useRef<HTMLDivElement>(null);

  const isPro = user.role === "pro";
  const profileHref = isPro ? "/pro/profile" : "/account/profile";
  const dashboardHref = isPro ? "/pro" : "/account";

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function handleRoleSwitch(targetRole: User["role"]) {
    setOpen(false);
    router.push(targetRole === "pro" ? "/pro" : "/account");
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-smoke border border-line/60"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <UserAvatar user={user} size="sm" />
        <span className="hidden text-left xl:block">
          <span className="block font-display text-sm font-bold leading-tight text-title">{user.name}</span>
          <span className="block text-[11px] font-medium text-muted">{roleLabel(user.role)}</span>
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-72 overflow-hidden rounded-[18px] border border-line bg-white shadow-xl animate-in fade-in"
        >
          {/* User Identity Header */}
          <div className="flex items-center gap-3 border-b border-line/70 bg-surface/50 px-4 py-3.5">
            <UserAvatar user={user} size="md" />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-title">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
              <span className="mt-0.5 inline-block rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-semibold text-primary">
                {roleLabel(user.role)}
              </span>
            </div>
          </div>

          <div className="p-2 space-y-0.5">
            <Link
              href={dashboardHref}
              role="menuitem"
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 font-display text-xs sm:text-sm font-medium text-title hover:bg-smoke transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-primary" />
              {isPro ? "Dashboard" : "My Requests"}
            </Link>
            <Link
              href={profileHref}
              role="menuitem"
              className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 font-display text-xs sm:text-sm font-medium text-title hover:bg-smoke transition-colors"
            >
              <UserRound className="h-4 w-4 text-muted" />
              Profile
            </Link>
          </div>

          {/* Demo Role Switcher */}
          <div className="border-t border-line/70 bg-smoke/40 p-2">
            {user.role !== "homeowner" ? (
              <button
                type="button"
                onClick={() => handleRoleSwitch("homeowner")}
                className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left font-display text-xs font-semibold text-primary hover:bg-white hover:shadow-xs transition"
              >
                <span className="flex items-center gap-2">
                  <Repeat className="h-3.5 w-3.5" />
                  Switch to Homeowner
                </span>
                <span className="text-[10px] text-muted font-normal">Demo</span>
              </button>
            ) : null}
            {user.role !== "pro" ? (
              <button
                type="button"
                onClick={() => handleRoleSwitch("pro")}
                className="flex w-full items-center justify-between rounded-[10px] px-3 py-2 text-left font-display text-xs font-semibold text-primary hover:bg-white hover:shadow-xs transition"
              >
                <span className="flex items-center gap-2">
                  <Repeat className="h-3.5 w-3.5" />
                  Switch to Pro View
                </span>
                <span className="text-[10px] text-muted font-normal">Demo</span>
              </button>
            ) : null}
          </div>

          {/* Log Out */}
          <div className="border-t border-line/70 p-2">
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left font-display text-xs sm:text-sm font-medium text-error hover:bg-red-50 transition-colors"
              onClick={() => {
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

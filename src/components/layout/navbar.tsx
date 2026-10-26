"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { AccountMenu } from "@/components/layout/account-menu";
import { NotificationMenu } from "@/components/layout/notification-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";
import { useAppSelector } from "@/redux/hooks";

const homeownerLinks = [
  { href: "/", label: "Home" },
  { href: "/browse-pros", label: "Find Pros" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const isPro = user?.role === "pro";
  const isDashboard = pathname.startsWith("/pro") || pathname.startsWith("/account");
  const navLinks = isPro || isDashboard ? [] : homeownerLinks;

  const [open, setOpen] = useState(false);
  const notifHref = isPro ? "/pro/notifications" : "/account/notifications";
  const unreadCount = useAppSelector((state) =>
    user ? state.features.notifications.filter((n) => !n.read && (n.role === user.role || n.role === "all")).length : 0,
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line/70 shadow-[0_4px_20px_color-mix(in_srgb,var(--ink)_4%,transparent)]">
      <div className="container-site flex h-[74px] items-center justify-between gap-6">
        <Logo />

        {navLinks.length > 0 && (
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-sans text-[15px] font-medium tracking-normal text-[#555] transition-colors hover:text-title",
                  pathname === link.href && "text-primary font-semibold",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-3.5 lg:flex">
          {user ? (
            <>
              {isPro && (
                <Link
                  href="/pro/jobs"
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-display text-xs font-semibold text-primary hover:bg-primary/10 transition"
                  title="View live homeowner job requests"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Pro Contractor</span>
                </Link>
              )}
              {/* Notification Popover Dropdown */}
              <NotificationMenu user={user} />
              <AccountMenu user={user} />
            </>
          ) : (
            <Button href="/login" size="sm" className="font-medium">
              Get Started ↗
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {user ? (
            <>
              <NotificationMenu user={user} />
              <AccountMenu user={user} />
            </>
          ) : null}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-title"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-5 py-5 lg:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-base font-medium text-title py-1"
              >
                {link.label}
              </Link>
            ))}
              {user ? (
                <Link
                  href={notifHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-[12px] bg-smoke px-4 py-2.5 font-display text-sm font-semibold text-title hover:bg-smoke/80 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4 text-primary" />
                    <span>Notifications</span>
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-error px-2 py-0.5 font-display text-[11px] font-bold text-white">
                      {unreadCount} unread
                    </span>
                  )}
                </Link>
              ) : (
                <Button
                  href="/login"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="w-full justify-center"
                >
                  Get Started ↗
                </Button>
              )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
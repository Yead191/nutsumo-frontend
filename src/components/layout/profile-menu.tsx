"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  User,
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { cn } from "@/lib/cn";

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface ProfileMenuProps {
  user: any;
  onLogout?: () => void | Promise<void>;
}

export function ProfileMenu({ user, onLogout }: ProfileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    if (onLogout) {
      await onLogout();
      return;
    }

    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("role", { path: "/" });
    Cookies.remove("accessToken");
    Cookies.remove("role");

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("lhf-auth-role");
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-changed"));
    }

    try {
      const { logoutUser } =
        await import("@/helpers/next-fetch/apiActions/authActions");
      await logoutUser();
    } catch {}

    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  const isArtisan = user?.role === "ARTISAN";
  const dashboardHref = isArtisan ? "/pro" : "/account";
  const jobsHref = isArtisan ? "/pro/jobs" : "/account/bookings";
  const profileHref = isArtisan ? "/pro/profile" : "/account";

  const userImage = getImageUrl(user?.image);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 p-1   rounded-full  shadow-2xs transition-all cursor-pointer"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-[#FE375D]/10 border border-[#FE375D]/20 flex items-center justify-center text-[#FE375D] font-bold text-xs select-none">
          {user?.image ? (
            <Image
              src={getImageUrl(user?.image) || ""}
              alt={user?.name || "User avatar"}
              width={60}
              height={60}
              className="object-cover h-full w-full"
              draggable={false}
              loading="eager"
            />
          ) : (
            <span>{getInitials(user?.name)}</span>
          )}
        </div>

        {/* <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden sm:inline-block">
          {user?.name || "My Account"}
        </span>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-[#FE375D]"
          )}
        /> */}
      </button>

      {/* Floating Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-white border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="relative h-9 w-9 rounded-full overflow-hidden bg-[#FE375D]/10 text-[#FE375D] font-bold text-xs flex items-center justify-center shrink-0">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span>{getInitials(user?.name)}</span>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || ""}
                </p>
              </div>
            </div>

            {/* Role Badge & Identity Status */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FE375D]/10 text-[#FE375D]">
                {isArtisan ? "Artisan" : "Customer"}
              </span>

              {isArtisan && (
                <>
                  {user?.identityStatus === "verified" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                  {user?.identityStatus === "pending" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      <span>In Review</span>
                    </span>
                  )}
                  {(user?.identityStatus === "not_submitted" ||
                    !user?.identityStatus) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>Unverified</span>
                    </span>
                  )}
                  {user?.identityStatus === "needs_update" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                      <ShieldAlert className="w-3 h-3 text-red-600" />
                      <span>Update Needed</span>
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Artisan Verification Action Callout */}
            {isArtisan &&
              (user?.identityStatus === "not_submitted" ||
                user?.identityStatus === "needs_update" ||
                !user?.identityStatus) && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50/90 border border-rose-200/80 text-left">
                  <p className="text-[11px] font-bold text-rose-900 mb-0.5">
                    {user?.identityStatus === "needs_update"
                      ? "Action Needed: Update ID"
                      : "Identity Verification Required"}
                  </p>
                  <p className="text-[10px] text-rose-700 leading-snug mb-2">
                    Upload your National ID & live selfie to activate your
                    account and start receiving clients.
                  </p>
                  <Link
                    href={
                      "/verify-identity?email=" +
                      encodeURIComponent(user?.email || "")
                    }
                    onClick={() => setIsOpen(false)}
                    className="w-full h-7 rounded-lg bg-[#FE375D] hover:bg-[#e0284e] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>
                      {user?.identityStatus === "needs_update"
                        ? "Update Documents"
                        : "Verify Identity Now"}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
          </div>

          {/* Links */}
          <div className="space-y-0.5">
            <Link
              href={dashboardHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-slate-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href={jobsHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Briefcase className="h-4 w-4 text-slate-400" />
              <span>My Jobs & Bookings</span>
            </Link>

            <Link
              href={profileHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <User className="h-4 w-4 text-slate-400" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/account/security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Security Settings</span>
            </Link>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
}

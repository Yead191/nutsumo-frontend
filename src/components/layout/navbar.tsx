"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Plus,
  Briefcase,
  LogOut,
  AlertTriangle,
  Bell,
} from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { ProfileMenu } from "@/components/layout/profile-menu";
import { TopbarNotifications } from "@/components/layout/Notification/TopbarNotifications";
import { cn } from "@/lib/cn";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/browse-jobs", label: "Job Seekerss", hasDropdown: true },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  user?: any;
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(isHome);
  const [isAtTop, setIsAtTop] = useState(true);
  const [hideBanner, setHideBanner] = useState(false);

  // Centralized logout handler that clears client & server session immediately
  const handleLogout = useCallback(async () => {
    // 1. Immediately update UI state so Navbar revalidates instantly with zero delay
    setOpen(false);

    // 2. Remove auth cookies across all paths
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("role", { path: "/" });
    Cookies.remove("accessToken");
    Cookies.remove("role");

    // 3. Clear cached local session
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("lhf-auth-role");
    } catch {}

    // 4. Notify all components listening to auth state
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-changed"));
    }

    // 5. Server-side session deletion & cache invalidation
    try {
      const { logoutUser } =
        await import("@/helpers/next-fetch/apiActions/authActions");
      await logoutUser();
    } catch {}

    toast.success("Logged out successfully");

    // 6. Navigate to home and revalidate server components
    router.push("/");
    router.refresh();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsAtTop(currentScrollY <= 10);

      if (!isHome) {
        setIsOverHero(false);
        return;
      }
      const heroElement = document.getElementById("hero");
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        const inHeroRange = rect.top <= 10 && rect.bottom > 80;
        setIsOverHero(inHeroRange || currentScrollY < 80);
      } else {
        setIsOverHero(currentScrollY < 80);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isHome]);

  const isArtisan = Boolean(user?.role === "ARTISAN");
  const myJobsHref = isArtisan ? "/pro/jobs" : "/account/bookings";
  const postJobHref = "/account/post-job";

  const isArtisanUnverified =
    user &&
    user?.role === "ARTISAN" &&
    (user?.identityStatus === "not_submitted" ||
      user?.identityStatus === "needs_update" ||
      !user?.identityStatus);

  const showBanner = isArtisanUnverified && !hideBanner && isAtTop;

  return (
    <>
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-60 bg-linear-to-r from-rose-600 via-[#FE375D] to-rose-700 text-white text-xs font-semibold py-2 px-4 shadow-sm flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 max-w-4xl mx-auto truncate">
            <AlertTriangle className="w-4 h-4 text-amber-200 shrink-0" />
            <span className="truncate">
              {user?.identityStatus === "needs_update"
                ? "Your ID verification needs correction. Please review admin feedback and resubmit."
                : "Complete your Artisan National ID & Live Selfie verification to unlock full client bookings."}
            </span>
            <Link
              href={
                "/verify-identity?email=" +
                encodeURIComponent(user?.email || "")
              }
              className="ml-2 inline-flex items-center gap-1 bg-white text-[#FE375D] px-2.5 py-0.5 rounded-full font-bold text-[11px] hover:bg-white/90 transition-colors shrink-0"
            >
              <span>Verify Now</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setHideBanner(true)}
            className="text-white/80 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
          isOverHero
            ? "bg-transparent py-4 sm:py-6 px-4 md:px-6"
            : "navbar-header-glass py-3",
          showBanner && "pt-11!",
        )}
        style={
          !isOverHero
            ? {
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
              }
            : undefined
        }
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href={"/"} className="">
            <Image
              src="/logo.png"
              alt="Nutsumo"
              width={180}
              height={60}
              priority
              draggable={false}
              className={"w-40 h-fit object-contain"}
            />
          </Link>

          {/* Center Floating Nav Pill with Frosted Glass & Blur Effect */}
          <nav className="hidden md:flex items-center">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full p-1.5 transition-all duration-300",
                isOverHero ? "nav-glass-blur" : "nav-glass-scrolled",
              )}
              style={{
                backdropFilter: isOverHero
                  ? "blur(20px) saturate(180%)"
                  : "blur(16px)",
                WebkitBackdropFilter: isOverHero
                  ? "blur(20px) saturate(180%)"
                  : "blur(16px)",
              }}
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center gap-1 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200",
                      isActive
                        ? "bg-[#FE375D] text-white shadow-sm"
                        : "text-slate-800 hover:text-[#FE375D] hover:bg-white/40",
                    )}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right CTA / Auth Controls */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {user && user?._id ? (
              <>
                {/* Button 1: My Jobs */}
                <Link
                  href={myJobsHref}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-2xs hover:border-[#FE375D] hover:text-[#FE375D] transition-all"
                >
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                  <span>My Jobs</span>
                </Link>

                {/* Button 2: Post Job (Primary) */}
                <Link
                  href={postJobHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2 text-sm font-semibold shadow-md transition-all group"
                >
                  <span>Post Job</span>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                  </span>
                </Link>

                {/* Real-time Notifications */}
                <TopbarNotifications
                  userId={user._id || user.id}
                  role={user.role}
                />

                {/* Profile Avatar & Menu */}
                <ProfileMenu user={user} onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-[#FE375D] hover:opacity-85 transition-opacity px-2"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2.5 text-sm font-semibold shadow-md transition-all group"
                >
                  <span>Sign Up</span>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#FE375D] transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger & Notification */}
          <div className="flex md:hidden items-center gap-2">
            {user && (user?._id || user?.id) && (
              <TopbarNotifications
                userId={user._id || user.id}
                role={user.role}
              />
            )}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/90 text-slate-800 shadow-sm"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="md:hidden mt-3 mx-4 rounded-2xl bg-white border border-slate-200 p-5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors",
                    pathname === link.href
                      ? "bg-[#FE375D] text-white"
                      : "text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-slate-100 my-2" />

              {user && user?._id ? (
                <div className="flex flex-col gap-2.5 pt-1">
                  {/* User info display on mobile */}
                  <div className="px-2 py-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {user?.name || "My Account"}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#FE375D] bg-[#FE375D]/10 px-2 py-0.5 rounded-full">
                      {isArtisan ? "Artisan" : "Customer"}
                    </span>
                  </div>

                  {/* Mobile Notifications link */}
                  <Link
                    href={isArtisan ? "/pro/notifications" : "/account/notifications"}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-slate-800 rounded-xl bg-slate-50 border border-slate-200/60 hover:border-[#FE375D] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="h-4 w-4 text-[#FE375D]" />
                      <span>Notifications</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>

                  {/* Mobile Button 1: My Jobs */}
                  <Link
                    href={myJobsHref}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-800 rounded-xl bg-slate-100 border border-slate-200/60"
                  >
                    <Briefcase className="h-4 w-4 text-slate-600" />
                    <span>My Jobs</span>
                  </Link>

                  {/* Mobile Button 2: Post Job (Primary) */}
                  <Link
                    href={postJobHref}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#FE375D] text-white py-3 text-sm font-semibold shadow-md"
                  >
                    <span>Post Job</span>
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#FE375D]">
                      <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-center py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-center py-2.5 text-sm font-bold text-[#FE375D] hover:bg-slate-50 rounded-xl"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#FE375D] text-white py-3 text-sm font-semibold shadow-md"
                  >
                    <span>Sign Up</span>
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#FE375D]">
                      <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

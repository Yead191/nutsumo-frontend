"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  User as UserIcon,
} from "lucide-react";
import Cookies from "js-cookie";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/browse-jobs", label: "Job Seekerss", hasDropdown: true },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(isHome);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsAuthenticated(Boolean(token));

    const handleScroll = () => {
      if (!isHome) {
        setIsOverHero(false);
        return;
      }
      const heroElement = document.getElementById("hero");
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        // Glass effect active when hero tag reaches top (-0 to 10px range) and is visible in viewport
        const inHeroRange = rect.top <= 10 && rect.bottom > 80;
        setIsOverHero(inHeroRange || window.scrollY < 80);
      } else {
        setIsOverHero(window.scrollY < 80);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, isHome]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
        isOverHero ? "bg-transparent py-4 sm:py-8" : "navbar-header-glass py-3",
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo size="lg" />

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
        <div className="hidden md:flex items-center gap-5">
          {isAuthenticated ? (
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-[#FE375D] hover:text-[#FE375D] transition-all"
            >
              <UserIcon className="h-4 w-4 text-[#FE375D]" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-[#FE375D] hover:opacity-85 transition-opacity"
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

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
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
            {isAuthenticated ? (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-800 rounded-xl bg-slate-100"
              >
                <UserIcon className="h-4 w-4 text-[#FE375D]" />
                <span>My Account</span>
              </Link>
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
  );
}

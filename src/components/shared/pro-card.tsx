"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { photos } from "@/lib/media";
import { loginHref } from "@/lib/role-access";
import { toggleFavorite } from "@/redux/slices/featuresSlice";
import { useRoleAccess } from "@/hooks/use-role-access";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Professional } from "@/types";
import { cn } from "@/lib/cn";

export function ProCard({
  pro,
  className,
  distance,
}: {
  pro: Professional;
  className?: string;
  distance?: number;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { access } = useRoleAccess();
  const user = useAppSelector((state) => state.auth.user);
  const isOwner = user?.role === "pro" && (pro.id === "pro-1" || pro.name.toLowerCase() === (user.name || "").toLowerCase());
  const saved = useAppSelector((state) => state.features.favorites.includes(pro.id));
  const image = photos.services[pro.categorySlug] || photos.banner;
  const href = `/browse-pros/${pro.id}`;

  function onSave(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (access.audience === "guest") {
      router.push(loginHref({ next: pathname || href }));
      return;
    }
    if (!access.canSavePro) return;
    dispatch(toggleFavorite(pro.id));
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full min-w-0 w-full flex-col overflow-hidden rounded-[20px] border border-line/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md cursor-pointer",
        className,
      )}
    >
      {/* 1. Photo Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-smoke">
        <span
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

        {/* Top-left Owner Storefront Badge */}
        {isOwner && (
          <span className="absolute left-3.5 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-primary/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Your Storefront
          </span>
        )}

        {/* Top-right favorite button */}
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save professional"}
          title={
            access.audience === "guest"
              ? "Create an account to save"
              : access.audience === "pro"
                ? "Homeowner-only action"
                : undefined
          }
          disabled={access.audience === "pro"}
          className={cn(
            "absolute right-3.5 top-3.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-white/60 transition-transform hover:scale-105 active:scale-95",
            saved && access.canSavePro ? "text-error" : "text-muted hover:text-title",
            access.audience === "pro" && "opacity-50",
          )}
          onClick={onSave}
        >
          <Heart className={cn("h-4 w-4", saved && access.canSavePro && "fill-current")} />
        </button>
      </div>

      {/* 2. Card Content Body */}
      <div className="flex flex-1 flex-col p-5 pb-4.5">
        {/* Category Row */}
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-full bg-smoke px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-primary">
            {pro.trade}
          </span>
        </div>

        {/* Pro Name as Main Title with Verified Shield */}
        <h3 className="mt-2.5 font-display text-[17px] font-semibold text-title tracking-tight leading-snug transition-colors group-hover:text-primary flex items-center gap-1.5">
          <span className="truncate">{pro.name}</span>
          <span title="Screened & Verified Professional" className="inline-flex shrink-0">
            <ShieldCheck
              className="h-4 w-4 text-primary fill-primary/15"
              aria-label="Verified Pro"
            />
          </span>
        </h3>

        {/* Location Row (No Company Name) */}
        <p className="mt-1 flex items-center gap-1.5 font-sans text-xs text-muted truncate">
          <MapPin className="h-3 w-3 shrink-0 text-muted" />
          <span>{pro.city}, {pro.state}</span>
          {distance != null && (
            <>
              <span className="text-muted/40">·</span>
              <span className="font-medium text-title">{distance < 1 ? "<1" : distance} mi away</span>
            </>
          )}
        </p>

        {/* Rating & Reviews & Jobs Row */}
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 font-semibold text-title">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
            <span>{pro.rating.toFixed(1)}</span>
          </div>
          <span className="text-muted">({pro.reviewCount})</span>
          <span className="h-1 w-1 rounded-full bg-muted/40" />
          <span className="font-medium text-copy">{pro.jobsCompleted} jobs</span>
        </div>
      </div>

      {/* 3. Card Footer with Full-Bleed Border & Proper Standard Spacing */}
      <div className="mt-auto border-t border-line/70 bg-white px-5 py-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-[11px] font-medium text-muted leading-none">
              From
            </span>
            <span className="mt-1.5 block font-display text-[17px] font-bold text-title leading-none">
              ${pro.startingPrice}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-smoke px-3.5 py-1.5 text-xs font-semibold text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:shadow-xs">
            {isOwner ? "Preview storefront" : "View profile"}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IArtisanProfileItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface ArtisanHeroIdentityProps {
  profile: IArtisanProfileItem;
  onRequestQuote: () => void;
}

export function ArtisanHeroIdentity({
  profile,
  onRequestQuote,
}: ArtisanHeroIdentityProps) {
  const user = profile.user || ({} as any);
  const avatarUrl = user.image ? getImageUrl(user.image) : null;
  const displayName = profile.businessName || user.name || "Master Artisan";
  const categoryName =
    typeof profile.category === "object"
      ? profile.category?.name
      : profile.category;
  const trade = profile.trade || categoryName || "Professional Artisan";
  const locationText =
    profile.location || profile.city || (user as any).location || "Accra, Ghana";
  const isAvailable =
    profile.availability !== "BOOKED" &&
    profile.availabilityStatus?.toLowerCase() !== "booked";

  const initials = (user.name || displayName || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join("");

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/browse-pros"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Verified Pros</span>
        </Link>

        {/* Live Availability Pill */}
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold border">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Available for Hire
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Currently Booked
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        {/* Left Column: Avatar & Core Identity */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0 shadow-sm">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full grid place-items-center bg-primary/10 text-primary font-bold text-2xl font-display">
                {initials}
              </div>
            )}
            {user.verified && (
              <div
                title="Verified Professional"
                className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-white shadow-md ring-2 ring-white"
              >
                <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-title tracking-tight">
                {displayName}
              </h1>
              {user.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Pro
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-primary flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                {trade}
              </span>
              {profile.businessName && user.name && profile.businessName !== user.name && (
                <span className="text-muted text-xs font-normal">
                  operated by {user.name}
                </span>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1">
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{locationText}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Escrow Protected</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Intent Action CTAs */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:min-w-[240px]">
          <button
            type="button"
            onClick={onRequestQuote}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white px-6 py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Request Custom Quote</span>
          </button>

          <Link
            href={`/account/messages?to=${user._id || profile._id}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-title px-6 py-3 text-sm font-bold shadow-2xs transition-colors"
          >
            <MessageSquare className="h-4 w-4 text-slate-500" />
            <span>Message Artisan</span>
          </Link>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-muted flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Zero upfront fee • Pay only upon satisfaction</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

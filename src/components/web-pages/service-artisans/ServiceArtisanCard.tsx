"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
  ArrowRight,
  Lock,
  Briefcase,
  Banknote,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IArtisanProfileItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface ServiceArtisanCardProps {
  artisan: IArtisanProfileItem;
  serviceId?: string;
  serviceName?: string;
  customRate?: {
    amount: number;
    type: string;
  };
  onRequestQuote: () => void;
}

export function ServiceArtisanCard({
  artisan,
  serviceId,
  serviceName,
  customRate,
  onRequestQuote,
}: ServiceArtisanCardProps) {
  const user = artisan.user || ({} as any);
  const avatarUrl = user.image ? getImageUrl(user.image) : null;
  const displayName = artisan.businessName || user.name || "Master Artisan";
  const trade = artisan.trade || "Craftsman";
  const location = artisan.location || artisan.city || user.location || "Location not set";
  const isAvailable =
    artisan.availability !== "BOOKED" &&
    artisan.availabilityStatus?.toLowerCase() !== "booked";

  const reviewsCount = artisan.reviewsCount || 0;
  const rating = reviewsCount > 0 ? Number(artisan.rating || 0).toFixed(1) : "New";
  const completedJobs = artisan.completedJobs || 0;

  const rateAmount =
    customRate?.amount ||
    artisan.startingOffer?.rateAmount ||
    artisan.startingRate ||
    artisan.hourlyRate ||
    0;
  const rateType = customRate?.type
    ? customRate.type.toLowerCase() === "hourly"
      ? "/ hr"
      : customRate.type.toLowerCase() === "daily"
        ? "/ day"
        : " fixed"
    : "/ hr";

  const initials = (user.name || displayName || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join("");

  const profileHref = `/job-seeker/${user._id || artisan._id}`;

  return (
    <div className="group rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xs hover:shadow-lg hover:border-primary/40 transition-all flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        {/* Top Header: Avatar, Name, Status, Rate */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Avatar */}
            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="h-full w-full grid place-items-center bg-primary/10 text-primary font-bold text-lg font-display">
                  {initials}
                </div>
              )}
              {user.verified && (
                <div
                  title="Verified Pro"
                  className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-white shadow-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
              )}
            </div>

            {/* Name, Trade, Availability */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={profileHref}
                  className="font-display text-base font-bold text-title group-hover:text-primary transition-colors hover:underline"
                >
                  {displayName}
                </Link>
                {user.verified && (
                  <span className="inline-flex items-center text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-primary rounded-md bg-primary/10 px-2 py-0.5 text-[11px]">
                  {trade}
                </span>

                {/* Status Pill */}
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Booked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rate Display */}
          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-muted block tracking-wider">
              {customRate ? "Service Rate" : "Starting At"}
            </span>
            <div className="font-display text-lg font-black text-title">
              {rateAmount ? `GH₵ ${rateAmount}` : "Quote"}
              {rateAmount ? (
                <span className="text-xs font-normal text-muted ml-0.5">
                  {rateType}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bio / Summary Snippet */}
        {artisan.bio ? (
          <p className="text-xs text-copy line-clamp-2 leading-relaxed">{artisan.bio}</p>
        ) : null}

        {/* Badges / Metrics Strip */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-muted border-t border-slate-100">
          {/* Star Rating */}
          <div className="flex items-center gap-1 font-bold text-title">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
            <span>{rating}</span>
            {reviewsCount > 0 ? (
              <span className="text-muted font-normal text-[11px]">
                ({reviewsCount})
              </span>
            ) : null}
          </div>

          <span>•</span>

          {/* Completed Jobs */}
          <div className="flex items-center gap-1 text-slate-700 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>{completedJobs} jobs done</span>
          </div>

          <span>•</span>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-700 font-medium">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: View Profile & Request Quote */}
      <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5">
        <Link
          href={profileHref}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-title py-2.5 text-xs font-bold transition-colors"
        >
          <span>View Profile</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        <button
          type="button"
          onClick={onRequestQuote}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-primary hover:bg-primary-hover text-white py-2.5 text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer transform active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Request Quote</span>
        </button>
      </div>
    </div>
  );
}


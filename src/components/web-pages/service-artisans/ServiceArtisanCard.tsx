"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, BadgeCheck, MapPin, Briefcase } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import { categoryPhoto } from "@/lib/stock-photos";
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

/** Fiverr gig-style card: work cover photo, pro identity, rating and starting price. */
export function ServiceArtisanCard({
  artisan,
  serviceName,
  customRate,
  onRequestQuote,
}: ServiceArtisanCardProps) {
  const user = artisan.user || ({} as any);
  const avatarUrl = user.image ? getImageUrl(user.image) : null;
  const displayName = artisan.businessName || user.name || "Top Professional";
  const trade = artisan.trade || "Craftsman";
  const location = artisan.location || artisan.city || user.location || "";
  const isAvailable =
    artisan.availability !== "BOOKED" &&
    artisan.availabilityStatus?.toLowerCase() !== "booked";

  const reviewsCount = artisan.reviewsCount || 0;
  const rating = reviewsCount > 0 ? Number(artisan.rating || 0).toFixed(1) : null;
  const completedJobs = artisan.completedJobs || 0;

  const rateAmount =
    customRate?.amount ||
    artisan.startingOffer?.rateAmount ||
    artisan.startingRate ||
    artisan.hourlyRate ||
    0;
  const rateType = customRate?.type
    ? customRate.type.toLowerCase() === "hourly"
      ? "/hr"
      : customRate.type.toLowerCase() === "daily"
        ? "/day"
        : " fixed"
    : "/hr";

  const initials = (user.name || displayName || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join("");

  const profileHref = `/job-seeker/${user._id || artisan._id}`;
  // Cover shows the kind of work (stock photo); falls back to the pro's avatar.
  const cover = categoryPhoto(serviceName, trade) || avatarUrl;
  const title = artisan.bio || (serviceName ? `${serviceName} by a verified ${trade.toLowerCase()} pro` : trade);

  return (
    <article className="group flex h-full flex-col">
      {/* Cover */}
      <Link href={profileHref} className="relative block aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-[#4A0D1E] to-primary font-display text-3xl font-semibold text-white">
            {initials}
          </div>
        )}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
            isAvailable ? "text-emerald-700" : "text-amber-700"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-amber-500"}`} />
          {isAvailable ? "Available" : "Booked"}
        </span>
      </Link>

      {/* Identity */}
      <div className="mt-3 flex items-center gap-2.5">
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary/10">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={displayName} fill sizes="32px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-xs font-semibold text-primary">{initials}</span>
          )}
        </div>
        <Link href={profileHref} className="min-w-0 truncate text-sm font-semibold text-title hover:underline">
          {displayName}
        </Link>
        {user.verified ? <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" /> : null}
      </div>

      <Link href={profileHref} className="mt-2 line-clamp-2 text-[15px] leading-snug text-title transition-colors hover:text-primary">
        {title}
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-copy">
        <span className="inline-flex items-center gap-1 font-semibold text-title">
          <Star className="h-3.5 w-3.5 fill-title text-title" />
          {rating ?? "New"}
          {reviewsCount > 0 ? <span className="font-normal text-copy">({reviewsCount})</span> : null}
        </span>
        <span className="inline-flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" />
          {completedJobs} jobs
        </span>
        {location ? (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </span>
        ) : null}
      </div>

      <div className="min-h-3 flex-1" />

      {/* Price + CTA */}
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
        <p className="text-[13px] text-copy">
          {rateAmount ? (
            <>
              {customRate ? "Rate" : "From"}{" "}
              <span className="font-display text-base font-semibold text-title">GH₵ {rateAmount.toLocaleString()}</span>
              {rateType}
            </>
          ) : (
            <span className="font-semibold text-title">Custom quote</span>
          )}
        </p>
        <button
          type="button"
          onClick={onRequestQuote}
          className="rounded-lg bg-title px-3.5 py-2 text-sm font-semibold text-white! transition-colors hover:bg-primary cursor-pointer"
        >
          Request quote
        </button>
      </div>
    </article>
  );
}

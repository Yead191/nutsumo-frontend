import Link from "next/link";
import Image from "next/image";
import { Star, BadgeCheck, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import type { IArtisanProfileItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";
import { categoryPhoto, stock } from "@/lib/stock-photos";

interface FeaturedArtisansGridProps {
  artisans: IArtisanProfileItem[];
}

/** The backend's default avatar for users who never uploaded a photo. */
const DEFAULT_AVATAR = /i\.ibb\.co\/z5YHLV9\/profile\.png/;

export function FeaturedArtisansGrid({ artisans }: FeaturedArtisansGridProps) {
  if (!artisans || artisans.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20 sm:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
              Top rated professionals
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-title sm:text-4xl">
              Featured verified pros
            </h2>
            <p className="mt-3 max-w-2xl text-base text-copy sm:text-lg">
              ID-checked workers with real reviews, clear rates and escrow-protected payments.
            </p>
          </div>
          <Link
            href="/browse-pros"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-title underline-offset-4 hover:underline"
          >
            Browse all pros
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artisans.map((artisan) => (
            <ArtisanPhotoCard key={artisan._id} artisan={artisan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArtisanPhotoCard({ artisan }: { artisan: IArtisanProfileItem }) {
  const user = artisan.user || {};
  const displayName = user.name || artisan.businessName || "Verified Pro";
  const trade = artisan.trade || user.trade || "Skilled Professional";
  const categoryName =
    artisan.category && typeof artisan.category === "object" ? artisan.category.name : "";
  const location = artisan.location || user.location || "";
  const reviewsCount = Number(artisan.reviewsCount) || 0;
  const rating = reviewsCount > 0 ? Number(artisan.rating) || 0 : 0;
  const completedJobs = Number(artisan.completedJobs) || 0;
  const rate =
    artisan.startingOffer?.rateAmount || artisan.startingRate || artisan.hourlyRate || 0;
  const rateSuffix =
    String(artisan.startingOffer?.rateType || "").toUpperCase() === "DAILY" ? "/day" : "/hr";
  const isAvailable = artisan.availabilityStatus !== "Booked";
  const profileUrl = `/job-seeker/${user._id || artisan._id}`;

  // Their own photo if they uploaded one; otherwise a photo of their trade.
  const ownPhoto =
    user.image && !DEFAULT_AVATAR.test(String(user.image)) ? getImageUrl(user.image) : null;
  const cover =
    ownPhoto || categoryPhoto(trade, categoryName, artisan.businessName) || stock.constructionTeam;

  return (
    <Link
      href={profileUrl}
      className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.12)] transition-shadow hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
    >
      <Image
        src={cover}
        alt={ownPhoto ? displayName : ""}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Fade to black so the text stays readable on any photo */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/10" />

      {/* Top badges */}
      <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? "bg-emerald-400" : "bg-amber-400"}`} />
          {isAvailable ? "Available" : "Booked"}
        </span>
        {rate ? (
          <span className="rounded-full bg-white/95 px-3.5 py-1.5 text-sm font-bold text-title shadow-sm">
            GH₵{rate}
            <span className="font-medium text-muted">{rateSuffix}</span>
          </span>
        ) : null}
      </div>

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        {!ownPhoto ? (
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/15 font-display text-xl font-semibold text-white ring-2 ring-white/40 backdrop-blur-md">
            {displayName.charAt(0).toUpperCase()}
          </span>
        ) : null}

        <h3 className="flex items-center gap-1.5 font-display text-2xl font-semibold leading-tight text-white! sm:text-[26px]">
          <span className="truncate">{displayName}</span>
          {user.verified !== false ? (
            <BadgeCheck className="h-6 w-6 shrink-0 fill-primary text-white" aria-label="Verified" />
          ) : null}
        </h3>
        <p className="mt-1 truncate text-base font-medium text-white/85">{trade}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
          <span className="inline-flex items-center gap-1 font-semibold text-white">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {reviewsCount > 0 ? (
              <>
                {rating.toFixed(1)} <span className="font-normal text-white/70">({reviewsCount})</span>
              </>
            ) : (
              "New"
            )}
          </span>
          {completedJobs > 0 ? <span>{completedJobs} jobs done</span> : null}
          {location ? (
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{location}</span>
            </span>
          ) : null}
        </div>

        <span className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-3.5 text-base font-semibold text-title transition-colors group-hover:bg-primary group-hover:text-white">
          See profile
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

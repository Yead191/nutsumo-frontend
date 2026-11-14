import Link from "next/link";
import Image from "next/image";
import {
  Star,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  DollarSign,
  User,
} from "lucide-react";
import type { IArtisanProfileItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { getImageUrl } from "@/lib/getImageUrl";

interface FeaturedArtisansGridProps {
  artisans: IArtisanProfileItem[];
}

export function FeaturedArtisansGrid({ artisans }: FeaturedArtisansGridProps) {
  if (!artisans || artisans.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2 font-display">
              Top Rated Professionals
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-title tracking-tight">
              Featured Verified Craftsmen
            </h2>
            <p className="mt-2 text-sm sm:text-base text-copy max-w-2xl font-sans">
              Hand-picked specialists with proven track records, verified
              customer reviews, and 100% escrow compliance.
            </p>
          </div>

          <Link
            href="/browse-pros"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover hover:underline transition-colors shrink-0 group"
          >
            <span>Browse All Professionals</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artisans.map((artisan) => {
            const user = artisan.user || {};
            const avatarUrl = user.image ? getImageUrl(user.image) : null;
            const displayName =
              user.name || artisan.businessName || "Verified Pro";
            const trade = artisan.trade || user.trade || "Craftsman";
            const location = artisan.location || user.location || "Location not set";
            const reviewsCount = Number(artisan.reviewsCount) || 0;
            const rating = reviewsCount > 0 ? Number(artisan.rating) || 0 : 0;
            const completedJobs = Number(artisan.completedJobs) || 0;
            const listedRate =
              artisan.startingOffer?.rateAmount ||
              artisan.startingRate ||
              artisan.hourlyRate ||
              0;
            const rate = listedRate;
            const rateSuffix =
              String(artisan.startingOffer?.rateType || "").toUpperCase() === "DAILY"
                ? "/ day"
                : "/ hr";
            const isAvailable = artisan.availabilityStatus !== "Booked";
            const profileUrl = `/job-seeker/${user._id || artisan._id}`;

            return (
              <div
                key={artisan._id}
                className="group rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Avatar & Availability */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-2xs">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={displayName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-primary/10 text-primary font-bold text-lg font-display">
                          {displayName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                        isAvailable
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isAvailable ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      <span>{isAvailable ? "Available" : "Booked"}</span>
                    </span>
                  </div>

                  {/* Name & Trade */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display text-base sm:text-lg font-bold text-title group-hover:text-primary transition-colors line-clamp-1">
                        {displayName}
                      </h3>
                      {user.verified !== false && (
                        <span title="Verified Pro">
                          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-primary/90 line-clamp-1">
                      {trade}
                    </p>

                    <p className="flex items-center gap-1 text-xs text-muted pt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{location}</span>
                    </p>
                    {(artisan.responseSamples || 0) >= 3 && (
                      <p className="text-[11px] text-muted pt-1">
                        {typeof artisan.responseTimeMinutes === "number"
                          ? artisan.responseTimeMinutes < 60
                            ? `Replies in ${Math.max(1, Math.round(artisan.responseTimeMinutes))}m`
                            : `Replies in ${Math.round(artisan.responseTimeMinutes / 60)}h`
                          : "Response time building"}
                        {typeof artisan.acceptRate === "number"
                          ? ` · Accepts ${Math.round(artisan.acceptRate * 100)}%`
                          : ""}
                      </p>
                    )}
                  </div>

                  {/* Stats Pill Strip */}
                  <div className="my-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-bold text-title">
                        {reviewsCount > 0 ? rating.toFixed(1) : "New"}
                      </span>
                      {reviewsCount > 0 ? (
                        <span className="text-muted text-[11px]">
                          ({reviewsCount})
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1 text-right justify-end text-emerald-700 font-medium text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {completedJobs > 0
                          ? `${completedJobs} jobs`
                          : "Verified Pro"}
                      </span>
                    </div>
                  </div>

                  {/* Starting Rate */}
                  <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between text-xs mb-4">
                    <span className="text-muted">Starting Rate:</span>
                    <strong className="font-display font-bold text-title text-sm text-primary">
                      {rate ? `GH₵ ${rate}` : "Quote"}
                      {rate ? (
                        <span className="text-[10px] text-muted font-normal ml-0.5">
                          {rateSuffix}
                        </span>
                      ) : null}
                    </strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Link
                    href={profileUrl}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white py-2.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href={`${profileUrl}#quote`}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:text-primary py-2 text-xs font-semibold text-title transition-colors"
                  >
                    <span>Request Custom Quote</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

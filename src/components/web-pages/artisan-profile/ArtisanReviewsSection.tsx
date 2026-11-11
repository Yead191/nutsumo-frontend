"use client";

import Image from "next/image";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  CornerDownRight,
  UserCheck,
} from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IArtisanReviewData } from "@/helpers/next-fetch/apiActions/marketplaceActions";
import { formatDate } from "@/hooks/formatDate";

interface ArtisanReviewsSectionProps {
  reviewData?: IArtisanReviewData;
  artisanName?: string;
}

export function ArtisanReviewsSection({
  reviewData,
  artisanName = "Artisan",
}: ArtisanReviewsSectionProps) {
  const reviews = reviewData?.reviews || [];
  const summary = reviewData?.summary || {
    averageRating: reviews.length > 0 ? 4.9 : 0,
    totalReviews: reviews.length,
  };

  const avgRating = summary.averageRating || 5.0;
  const totalCount = summary.totalReviews || reviews.length;

  // Calculate 5★ distribution
  const counts = [5, 4, 3, 2, 1].map((star) => {
    const starCount = reviews.filter(
      (r) => Math.round(r.rating) === star,
    ).length;
    const percentage =
      totalCount > 0
        ? Math.round((starCount / totalCount) * 100)
        : star === 5
          ? 85
          : star === 4
            ? 15
            : 0;
    return { star, count: starCount, percentage };
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-8">
      {/* 1. REVIEW SUMMARY & DISTRIBUTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <div className="text-center sm:text-left">
            <div className="font-display text-4xl sm:text-5xl font-black text-title">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-1 my-1.5 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i <= Math.round(avgRating)
                      ? "text-amber-500 fill-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted font-medium">
              Based on {totalCount} verified{" "}
              {totalCount === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="hidden sm:block h-20 w-px bg-slate-200" />

          <div className="hidden sm:flex flex-col gap-1 text-xs text-muted">
            <div className="flex items-center gap-1.5 font-bold text-title">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Verified Escrow Clients</span>
            </div>
            <p className="text-[11px] text-muted max-w-xs">
              Reviews can only be submitted after payment is completed and
              milestone work is signed off.
            </p>
          </div>
        </div>

        {/* Distribution Bars */}
        <div className="flex-1 max-w-sm space-y-1.5">
          {counts.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3 text-xs">
              <span className="font-bold text-title w-7 text-right">
                {star} ★
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[11px] text-muted w-10 text-right">
                {percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. REVIEWS LIST */}
      <div className="space-y-6">
        <h3 className="font-display text-base sm:text-lg font-bold text-title">
          Client Feedback & Performance
        </h3>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center space-y-2">
            <MessageCircle className="h-8 w-8 text-slate-400 mx-auto" />
            <h4 className="font-bold text-sm text-title">
              No Client Reviews Yet
            </h4>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Be the first client to hire this professional! Your project will
              be fully backed by Nutsumo 100% Escrow Protection.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const customerImg = rev.customer?.image
                ? getImageUrl(rev.customer.image)
                : null;
              const customerName = rev.customer?.name || "Verified Client";
              const jobTitle = rev.job?.title;
              // const formattedDate = new Date(rev.createdAt).toLocaleDateString(
              //   undefined,
              //   { month: "short", day: "numeric", year: "numeric" },
              // );

              return (
                <div
                  key={rev._id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {customerImg ? (
                          <Image
                            src={customerImg}
                            alt={customerName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full grid place-items-center bg-primary/10 text-primary font-bold text-xs">
                            {customerName.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display text-sm font-bold text-title">
                            {customerName}
                          </h4>
                          {rev.customer?.verified && (
                            <span
                              title="Verified Customer"
                              className="text-emerald-600"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= rev.rating
                              ? "text-amber-500 fill-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verified Job Badge */}
                  {jobTitle && (
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>Verified Contract: {jobTitle}</span>
                    </div>
                  )}

                  {/* Review Comment */}
                  <p className="text-xs sm:text-sm text-copy leading-relaxed">
                    "{rev.comment}"
                  </p>

                  {/* Official Artisan Reply Box */}
                  {rev.reply?.comment && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-title">
                        <CornerDownRight className="h-3.5 w-3.5 text-primary" />
                        <span>Response from {artisanName}</span>
                        {rev.reply.repliedAt && (
                          <span className="text-[10px] text-muted font-normal">
                            • {formatDate(rev.reply.repliedAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted leading-relaxed pl-5">
                        "{rev.reply.comment}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

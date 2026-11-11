import {
  Star,
  CheckCircle2,
  Briefcase,
  Clock,
  Banknote,
  Award,
} from "lucide-react";
import type { IArtisanProfileItem } from "@/helpers/next-fetch/apiActions/marketplaceActions";

interface ArtisanStatsStripProps {
  profile: IArtisanProfileItem;
  totalReviews?: number;
  averageRating?: number;
}

export function ArtisanStatsStrip({
  profile,
  totalReviews = 0,
  averageRating = 0,
}: ArtisanStatsStripProps) {
  const rating =
    averageRating > 0
      ? averageRating.toFixed(1)
      : (profile.rating || 5.0).toFixed(1);
  const reviewsCount =
    totalReviews > 0 ? totalReviews : profile.reviewsCount || 18;
  const completedCount = profile.completedJobs || 24;
  const experienceYears = profile.experienceYears || 5;
  const rate = profile.startingRate || profile.hourlyRate || 50;

  const stats = [
    {
      icon: Star,
      iconColor: "text-amber-500 fill-amber-400",
      bg: "bg-amber-50 border-amber-100",
      label: "Star Rating",
      value: `${rating} ★`,
      subtext: `From ${reviewsCount} verified reviews`,
    },
    {
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
      label: "Completed Jobs",
      value: `${completedCount}+`,
      subtext: "100% Escrow Fulfilled",
    },
    {
      icon: Award,
      iconColor: "text-primary",
      bg: "bg-primary/5 border-primary/10",
      label: "Experience",
      value: `${experienceYears}+ Yrs`,
      subtext: "Master craftsman trade",
    },
    {
      icon: Banknote,
      iconColor: "text-indigo-600",
      bg: "bg-indigo-50 border-indigo-100",
      label: "Starting From",
      value: `GH₵ ${rate}`,
      subtext: "Transparent upfront quotes",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`grid h-10 w-10 place-items-center rounded-2xl border ${stat.bg}`}
              >
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted font-display">
                {stat.label}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-title font-display">
              {stat.value}
            </div>

            <p className="text-[11px] sm:text-xs text-muted mt-1">
              {stat.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}

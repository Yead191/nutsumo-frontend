"use client";

import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import type { IJobItem } from "../types";

interface JobMarketplaceCardProps {
  job: IJobItem;
  onSendProposal?: (job: IJobItem) => void;
  currentUserRole?: string | null;
}

export function JobMarketplaceCard({
  job,
  onSendProposal,
  currentUserRole,
}: JobMarketplaceCardProps) {
  const categoryName =
    typeof job.category === "object" && job.category
      ? job.category.name
      : "";
  const serviceName =
    typeof job.service === "object" && job.service
      ? job.service.name
      : job.customServiceName || "";

  const isArtisan = currentUserRole === "ARTISAN";

  const formattedDate = job.preferredDate
    ? new Date(job.preferredDate).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Flexible timeline";

  const postedAgo = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="group relative rounded-3xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-lg hover:border-[#FE375D]/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* TOP ROW: CATEGORY & STATUS */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {categoryName ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                <Tag className="h-3 w-3 text-slate-500" />
                <span>{categoryName}</span>
              </span>
            ) : null}
            {serviceName ? (
              <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#FE375D]">
                {serviceName}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Open for Proposals</span>
          </div>
        </div>

        {/* TITLE */}
        <Link
          href={`/jobs/${job._id}`}
          className="group-hover:text-[#FE375D] transition-colors"
        >
          <h3 className="font-display text-lg sm:text-xl font-bold text-title tracking-tight line-clamp-2">
            {job.title}
          </h3>
        </Link>

        {/* DESCRIPTION */}
        <p className="mt-2 text-xs sm:text-sm text-copy line-clamp-3 leading-relaxed">
          {job.description}
        </p>

        {/* META BADGES */}
        <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted border-t border-line/50 pt-3">
          <div className="flex items-center gap-1 text-slate-700 font-medium">
            <MapPin className="h-3.5 w-3.5 text-muted shrink-0" />
            <span className="truncate max-w-[180px]">{job.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted shrink-0" />
            <span>Target: {formattedDate}</span>
          </div>

          {postedAgo ? (
            <div className="flex items-center gap-1 ml-auto text-[11px] text-muted">
              <Clock className="h-3 w-3" />
              <span>Posted {postedAgo}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* BOTTOM ACTION ROW */}
      <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
        {/* BUDGET */}
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
            Estimated Budget
          </span>
          <div className="font-display text-xl font-black text-[#FE375D] tracking-tight">
            GH₵{job.budget?.toLocaleString() || "Negotiable"}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {isArtisan && onSendProposal ? (
            <button
              type="button"
              onClick={() => onSendProposal(job)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Send Proposal</span>
            </button>
          ) : null}

          <Link
            href={`/jobs/${job._id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-smoke/60 hover:bg-white hover:border-title px-3.5 py-2 text-xs font-semibold text-title transition-all"
          >
            <span>Details</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

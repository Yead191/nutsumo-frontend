"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Clock, ArrowRight, Sparkles, Briefcase } from "lucide-react";
import { categoryPhoto } from "@/lib/stock-photos";
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

  // Illustrative cover for the kind of work (stock photo), not the client's own image.
  const cover = categoryPhoto(serviceName, categoryName, job.title);
  const href = `/jobs/${job._id}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition-shadow hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.35)]">
      {/* Cover */}
      <Link href={href} className="relative block aspect-video overflow-hidden bg-slate-100">
        {cover ? (
          <Image
            src={cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-[#4A0D1E] to-primary">
            <Briefcase className="h-10 w-10 text-white/80" strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Open for proposals
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {/* Category / service */}
        {categoryName || serviceName ? (
          <p className="truncate text-xs font-semibold uppercase tracking-[0.08em] text-primary">
            {[categoryName, serviceName].filter(Boolean).join(" · ")}
          </p>
        ) : null}

        <Link href={href}>
          <h3 className="mt-1.5 line-clamp-2 text-lg font-semibold leading-snug text-title transition-colors group-hover:text-primary">
            {job.title}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-copy">{job.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-copy">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="max-w-[170px] truncate">{job.location}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {formattedDate}
          </span>
          {postedAgo ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Posted {postedAgo}
            </span>
          ) : null}
        </div>

        {/* Spacer keeps the footer pinned to the bottom of equal-height cards */}
        <div className="min-h-5 flex-1" />

        {/* Budget + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-copy">Budget</span>
            <span className="font-display text-xl font-semibold text-title">
              {job.budget ? `GH₵ ${job.budget.toLocaleString()}` : "Negotiable"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isArtisan && onSendProposal ? (
              <button
                type="button"
                onClick={() => onSendProposal(job)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Send proposal
              </button>
            ) : null}
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-title transition-colors hover:border-title"
            >
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Briefcase,
  ExternalLink,
} from "lucide-react";
import { SendProposalModal } from "@/components/web-pages/jobs-marketplace/components/SendProposalModal";
import type { IJobItem } from "../types";

interface ArtisanJobsFeedProps {
  availableJobs: IJobItem[];
}

export function ArtisanJobsFeed({ availableJobs }: ArtisanJobsFeedProps) {
  const [selectedJob, setSelectedJob] = useState<IJobItem | null>(null);

  if (availableJobs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-smoke/40 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-[#FE375D] mb-4">
          <Briefcase className="h-7 w-7" />
        </div>
        <h3 className="font-display text-lg font-bold text-title">
          No new open jobs right now
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted max-w-md mx-auto">
          We notify Job Seekers as soon as new client requests matching your trades are posted. Check back soon or visit the full marketplace!
        </p>
        <Link
          href="/jobs"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
        >
          <span>Explore All Jobs &rarr;</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <p className="text-xs text-muted">
          Showing <strong>{availableJobs.length}</strong> active client requests open for bids.
        </p>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#FE375D] hover:underline"
        >
          <span>Open Full Marketplace</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableJobs.map((job) => {
          const categoryName =
            typeof job.category === "object" && job.category
              ? job.category.name
              : "";
          const serviceName =
            typeof job.service === "object" && job.service
              ? job.service.name
              : job.customServiceName || "";

          const formattedDate = job.preferredDate
            ? new Date(job.preferredDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            : "Flexible";

          return (
            <div
              key={job._id}
              className="rounded-3xl border border-line bg-white p-5 shadow-xs hover:border-[#FE375D]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-[#FE375D]">
                    {serviceName || categoryName || "Service Request"}
                  </span>

                  <span className="font-display text-sm font-black text-[#FE375D]">
                    GH₵{job.budget?.toLocaleString() || "Open"}
                  </span>
                </div>

                <Link
                  href={`/pro/jobs/${job._id}`}
                  className="font-display text-base font-bold text-title hover:text-[#FE375D] transition-colors line-clamp-1"
                >
                  {job.title}
                </Link>

                <p className="mt-1.5 text-xs text-copy line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="mt-3 flex items-center gap-3 text-xs text-muted border-t border-line/60 pt-2.5">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between gap-2">
                <Link
                  href={`/pro/jobs/${job._id}`}
                  className="text-xs font-semibold text-muted hover:text-title transition-colors"
                >
                  View Details
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-3.5 py-1.5 text-xs font-semibold shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Send Proposal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <SendProposalModal
          isOpen={Boolean(selectedJob)}
          onClose={() => setSelectedJob(null)}
          job={selectedJob}
          currentUserRole="ARTISAN"
        />
      )}
    </div>
  );
}

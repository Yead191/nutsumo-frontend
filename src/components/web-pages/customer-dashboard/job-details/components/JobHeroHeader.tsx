import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  DollarSign,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type { IJobItem } from "@/helpers/next-fetch/apiActions/jobActions";

interface JobHeroHeaderProps {
  job: IJobItem;
  onCancelJob: () => void;
}

export function JobHeroHeader({ job, onCancelJob }: JobHeroHeaderProps) {
  const isOpen = job.status === "OPEN";
  const isBooked = job.status === "BOOKED";

  const preferredDateFormatted = job.preferredDate
    ? new Date(job.preferredDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Flexible";

  const postedDateFormatted = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-3 border-b border-line/70 pb-5">
      {/* Back button */}
      <div>
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#FE375D] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Service Requests</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-title tracking-tight">
              {job.title}
            </h1>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border",
                isOpen
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : isBooked
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-slate-100 text-slate-700 border-slate-200",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  isOpen
                    ? "bg-emerald-500 animate-pulse"
                    : isBooked
                      ? "bg-blue-500"
                      : "bg-slate-400",
                )}
              />
              <span>{job.status}</span>
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-muted">
            Posted on {postedDateFormatted}
          </p>
        </div>

        {/* Cancel Job Action (if OPEN) */}
        {isOpen && (
          <button
            type="button"
            onClick={onCancelJob}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-muted hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Cancel Request</span>
          </button>
        )}
      </div>

      {/* METAS BADGES ROW */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-5 pt-2 text-xs">
        <span className="flex items-center gap-1.5 font-bold text-title">
          <span className="text-muted font-normal">Est. Budget:</span>
          <span className="text-[#FE375D] text-sm">GH₵ {job.budget}</span>
        </span>

        {job.location && (
          <span className="flex items-center gap-1.5 text-title font-medium">
            <MapPin className="h-3.5 w-3.5 text-[#FE375D]" />
            <span>{job.location}</span>
            {job.postCode && <span className="text-muted">({job.postCode})</span>}
          </span>
        )}

        <span className="flex items-center gap-1.5 text-muted font-medium">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>Preferred Date: {preferredDateFormatted}</span>
        </span>
      </div>
    </div>
  );
}

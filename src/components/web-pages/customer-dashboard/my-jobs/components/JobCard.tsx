import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  FileText,
  DollarSign,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IJobItem, JobStatus } from "@/helpers/next-fetch/apiActions/jobActions";

interface JobCardProps {
  job: IJobItem;
}

function getStatusStyle(status: JobStatus) {
  switch (status) {
    case "OPEN":
      return {
        label: "Receiving Quotes",
        dotColor: "bg-emerald-500",
        badgeClasses: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "BOOKED":
      return {
        label: "Booked · Pro Hired",
        dotColor: "bg-blue-500",
        badgeClasses: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        dotColor: "bg-amber-500",
        badgeClasses: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        dotColor: "bg-teal-500",
        badgeClasses: "bg-teal-50 text-teal-700 border-teal-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        dotColor: "bg-slate-400",
        badgeClasses: "bg-slate-100 text-slate-600 border-slate-200",
      };
    default:
      return {
        label: status,
        dotColor: "bg-slate-400",
        badgeClasses: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}

export function JobCard({ job }: JobCardProps) {
  const statusInfo = getStatusStyle(job.status);
  const categoryName =
    typeof job.category === "object" && job.category?.name
      ? job.category.name
      : "";
  const serviceName =
    typeof job.service === "object" && job.service?.name
      ? job.service.name
      : job.customServiceName || "";

  const firstImage =
    Array.isArray(job.images) && job.images.length > 0
      ? getImageUrl(job.images[0])
      : null;

  const extraImagesCount =
    Array.isArray(job.images) && job.images.length > 1
      ? job.images.length - 1
      : 0;

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
      })
    : "";

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-line/80 bg-white p-5 sm:p-6 shadow-2xs hover:border-[#FE375D]/40 hover:shadow-md transition-all duration-300">
      <div>
        {/* TOP ROW: Category & Status Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2">
            {categoryName ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-smoke px-3 py-1 text-xs font-bold text-title border border-line">
                <Layers className="h-3.5 w-3.5 text-[#FE375D]" />
                <span>{categoryName}</span>
                {serviceName && (
                  <>
                    <span className="text-muted/60">/</span>
                    <span className="text-muted font-medium">{serviceName}</span>
                  </>
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-smoke px-3 py-1 text-xs font-semibold text-muted border border-line">
                <Briefcase className="h-3.5 w-3.5 text-[#FE375D]" />
                <span>Service Request</span>
              </span>
            )}
          </div>

          {/* Status Badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border shadow-2xs",
              statusInfo.badgeClasses,
            )}
          >
            <span
              className={cn("h-2 w-2 rounded-full", statusInfo.dotColor)}
            />
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* TITLE & DESCRIPTION */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Link
              href={`/account/jobs/${job._id}`}
              className="font-display text-base sm:text-lg font-bold text-title hover:text-[#FE375D] transition-colors line-clamp-1"
            >
              {job.title}
            </Link>
            <p className="mt-1.5 text-xs sm:text-sm text-copy line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* THUMBNAIL PREVIEW (IF IMAGES EXIST) */}
          {firstImage && (
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-2xl border border-line shadow-2xs">
              <Image
                src={firstImage}
                alt={job.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="80px"
              />
              {extraImagesCount > 0 && (
                <span className="absolute bottom-1 right-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                  +{extraImagesCount}
                </span>
              )}
            </div>
          )}
        </div>

        {/* SPECS ROW: Location, Preferred Date, Budget */}
        <div className="mt-4 pt-4 border-t border-line/60 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted">
          {job.location && (
            <span className="flex items-center gap-1.5 font-medium text-title">
              <MapPin className="h-3.5 w-3.5 text-[#FE375D] shrink-0" />
              <span>{job.location}</span>
              {job.postCode && <span className="text-muted">({job.postCode})</span>}
            </span>
          )}

          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>Target: {preferredDateFormatted}</span>
          </span>

          <span className="flex items-center gap-1 font-bold text-title">
            <span className="text-muted font-normal">Est. Budget:</span>
            <span className="text-[#FE375D]">GH₵ {job.budget}</span>
          </span>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="mt-5 pt-4 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {job.status === "OPEN" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-[#FE375D] px-3 py-1 text-xs font-bold border border-rose-100">
              <FileText className="h-3.5 w-3.5" />
              <span>Review Proposals & Hire</span>
            </span>
          ) : job.status === "BOOKED" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-bold border border-blue-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Confirmed Booking</span>
            </span>
          ) : (
            <span className="text-xs text-muted">Posted {postedDateFormatted}</span>
          )}
        </div>

        <Link
          href={`/account/jobs/${job._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-title hover:bg-[#FE375D] text-white px-5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-xs group-hover:scale-[1.02]"
        >
          <span>View Details & Quotes</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

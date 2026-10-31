"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Send,
  ShieldCheck,
  Tag,
  Wrench,
  Sparkles,
  Share2,
  CheckCircle2,
  User,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { SendProposalModal } from "./SendProposalModal";
import type { IJobItem } from "../types";

interface JobDetailsViewProps {
  job: IJobItem;
  currentUserRole?: string | null;
  currentUserId?: string | null;
}

export function JobDetailsView({
  job,
  currentUserRole,
  currentUserId,
}: JobDetailsViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const categoryName =
    typeof job.category === "object" && job.category
      ? job.category.name
      : "";
  const serviceName =
    typeof job.service === "object" && job.service
      ? job.service.name
      : job.customServiceName || "";

  const isArtisan = currentUserRole === "ARTISAN";
  const isOwner =
    typeof job.customer === "object" && job.customer
      ? job.customer._id === currentUserId
      : job.customer === currentUserId;

  const formattedDate = job.preferredDate
    ? new Date(job.preferredDate).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Flexible timeline";

  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* BREADCRUMBS & TOP NAV */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/70 pb-4">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#FE375D] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Jobs</span>
        </Link>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-muted hover:text-title hover:border-title transition-colors cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Share Job</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT TWO COLUMNS: JOB DETAILS & SCOPE */}
        <div className="lg:col-span-2 space-y-6">
          {/* HEADER CARD */}
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for Proposals</span>
              </span>

              {categoryName ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  <Tag className="h-3 w-3 text-slate-500" />
                  <span>{categoryName}</span>
                </span>
              ) : null}

              {serviceName ? (
                <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#FE375D]">
                  {serviceName}
                </span>
              ) : null}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-title tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted border-t border-line/70 pt-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <MapPin className="h-4 w-4 text-[#FE375D] shrink-0" />
                <span>{job.location} {job.postCode ? `(${job.postCode})` : ""}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted shrink-0" />
                <span>Required: {formattedDate}</span>
              </div>

              {postedDate ? (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted shrink-0" />
                  <span>Posted {postedDate}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* PHOTOS GALLERY (IF AVAILABLE) */}
          {job.images && job.images.length > 0 ? (
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="font-display text-base font-bold text-title">
                Job Photos & Attachments ({job.images.length})
              </h2>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-line">
                <Image
                  src={job.images[selectedImageIndex] || job.images[0]}
                  alt="Job photo"
                  fill
                  className="object-cover"
                />
              </div>

              {job.images.length > 1 ? (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {job.images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-16 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-[#FE375D] ring-2 ring-[#FE375D]/30"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* DESCRIPTION & SPECIFICATIONS */}
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="font-display text-lg font-bold text-title">
              Detailed Description & Requirements
            </h2>
            <div className="prose prose-sm max-w-none text-copy whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </div>

          {/* SERVICE EXPECTATIONS & GUARANTEE */}
          <div className="rounded-3xl border border-line bg-smoke/60 p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-title font-bold text-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>Nutsumo Client Protection & Quality Standards</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Every job on Nutsumo is backed by our customer satisfaction protocol. As a verified Job Seeker, your quotes are delivered straight to the client without third-party markups. Upon acceptance, payments are processed with full transparency.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: PROPOSAL CARD & CLIENT SUMMARY */}
        <div className="space-y-6">
          {/* BUDGET & PROPOSAL CARD (STICKY) */}
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-7 shadow-lg space-y-5 lg:sticky lg:top-24">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                Client Target Budget
              </span>
              <div className="font-display text-3xl sm:text-4xl font-black text-[#FE375D] tracking-tight mt-1">
                GH₵{job.budget?.toLocaleString() || "Open / Quote"}
              </div>
              <p className="text-[11px] text-muted mt-1">
                Ghana Cedis (GHS) · Propose your best rate
              </p>
            </div>

            {/* ACTION BUTTON */}
            {isOwner ? (
              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 space-y-2">
                <p className="font-bold">You posted this job</p>
                <p className="text-[11px]">
                  You can review incoming quotations and manage this request in your client dashboard.
                </p>
                <Link
                  href={`/account/jobs/${job._id}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[#FE375D] hover:underline"
                >
                  Manage My Job &rarr;
                </Link>
              </div>
            ) : isArtisan ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FE375D] hover:bg-[#e0284e] text-white py-3.5 px-5 text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Submit Quotation</span>
              </button>
            ) : currentUserRole ? (
              <div className="rounded-2xl bg-slate-100 p-4 border border-line text-xs text-slate-700 space-y-1 text-center">
                <p className="font-semibold">Looking to submit a quote?</p>
                <p className="text-[11px] text-muted">
                  You are currently logged in as a Client. To submit proposals, register or switch to a Job Seeker account.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href={`/login?next=/jobs/${job._id}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FE375D] hover:bg-[#e0284e] text-white py-3.5 px-5 text-sm font-bold shadow-md transition-all hover:scale-[1.02]"
                >
                  <Send className="h-4 w-4" />
                  <span>Log in to Submit Quote</span>
                </Link>
                <p className="text-center text-[11px] text-muted">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-bold text-[#FE375D] hover:underline">
                    Sign up as Job Seeker
                  </Link>
                </p>
              </div>
            )}

            {/* KEY POINTS LIST */}
            <div className="space-y-2.5 pt-4 border-t border-line text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Direct client chat upon proposal review</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Zero commission deducted from your quote</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Escrow milestone payout security</span>
              </div>
            </div>
          </div>

          {/* CLIENT SUMMARY CARD */}
          <div className="rounded-3xl border border-line bg-white p-6 shadow-xs space-y-3">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
              Client Information
            </span>

            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 font-bold">
                {typeof job.customer === "object" && job.customer?.name
                  ? job.customer.name.slice(0, 2).toUpperCase()
                  : "CL"}
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-title">
                  {typeof job.customer === "object" && job.customer?.name
                    ? job.customer.name
                    : "Verified Client"}
                </h4>
                <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Identity & Phone Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROPOSAL MODAL */}
      <SendProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
        currentUserRole={currentUserRole}
      />
    </div>
  );
}

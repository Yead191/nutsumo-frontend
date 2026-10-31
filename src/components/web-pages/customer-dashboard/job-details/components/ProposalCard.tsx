"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Star,
  Clock,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IQuotationItem } from "@/helpers/next-fetch/apiActions/quotationActions";

interface ProposalCardProps {
  proposal: IQuotationItem;
  jobStatus: string;
  onAccept: (proposal: IQuotationItem) => void;
  onReject: (proposal: IQuotationItem) => void;
}

export function ProposalCard({
  proposal,
  jobStatus,
  onAccept,
  onReject,
}: ProposalCardProps) {
  const artisan = proposal.artisan;
  const avatarUrl = artisan?.image ? getImageUrl(artisan.image) : null;
  const profile = artisan?.artisanProfileData;

  const isPending = proposal.status === "PENDING";
  const isAccepted = proposal.status === "ACCEPTED";
  const isRejected = proposal.status === "REJECTED";
  const isWithdrawn = proposal.status === "WITHDRAWN";

  const submittedDateFormatted = proposal.createdAt
    ? new Date(proposal.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "";

  return (
    <div
      className={cn(
        "rounded-3xl border p-5 sm:p-6 transition-all duration-300 relative",
        isAccepted
          ? "border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20"
          : isRejected
            ? "border-line/60 bg-slate-50/50 opacity-70"
            : "border-line/80 bg-white hover:border-[#FE375D]/40 shadow-2xs hover:shadow-sm",
      )}
    >
      {/* HEADER: ARTISAN PROFILE & STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* ARTISAN INFO */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-2xl border border-line bg-white shadow-2xs">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={artisan?.name || "Artisan"}
                fill
                className="object-cover"
                sizes="52px"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-slate-100 text-base font-bold text-title">
                {artisan?.name?.charAt(0) || "A"}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-display text-base font-bold text-title truncate">
                {artisan?.name}
              </h4>
              {artisan?.verified && (
                <span
                  title="Verified Professional"
                  className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200"
                >
                  <ShieldCheck className="h-3 w-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <p className="text-xs text-muted truncate mt-0.5">
              {profile?.trade || profile?.businessName || "Professional Craftsman"}
              {profile?.experienceYears ? ` · ${profile.experienceYears} yrs exp` : ""}
            </p>

            {/* RATING & LOCATION */}
            <div className="mt-1 flex items-center gap-3 text-xs text-muted">
              {profile?.rating ? (
                <span className="flex items-center gap-1 font-semibold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{profile.rating.toFixed(1)}</span>
                  {profile.reviewsCount ? (
                    <span className="text-muted font-normal">({profile.reviewsCount})</span>
                  ) : null}
                </span>
              ) : null}

              {artisan?.location && (
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="h-3 w-3 text-muted" />
                  <span>{artisan.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PROPOSAL FINANCIAL TERMS */}
        <div className="flex flex-col items-start sm:items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-muted font-medium">Proposed:</span>
            <span className="font-display text-2xl font-bold text-[#FE375D]">
              GH₵ {proposal.proposedAmount}
            </span>
            <span className="text-xs text-muted font-semibold uppercase">
              /{proposal.rateType}
            </span>
          </div>

          {proposal.estimatedDuration && (
            <span className="flex items-center gap-1 text-xs text-muted mt-0.5">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Est: {proposal.estimatedDuration}</span>
            </span>
          )}
        </div>
      </div>

      {/* PROPOSAL MESSAGE */}
      <div className="mt-4 rounded-2xl bg-smoke/70 p-4 border border-line/60">
        <p className="text-xs sm:text-sm text-title/90 leading-relaxed italic">
          &ldquo;{proposal.message}&rdquo;
        </p>
      </div>

      {/* FOOTER & ACTIONS */}
      <div className="mt-4 pt-3.5 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11px] text-muted">
          Submitted {submittedDateFormatted}
        </span>

        {/* STATUS / ACTION BUTTONS */}
        <div className="flex items-center gap-2.5">
          {isAccepted ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-4 py-1.5 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              <span>Offer Accepted · Booking Confirmed</span>
            </div>
          ) : isRejected ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-muted">
              <XCircle className="h-4 w-4 text-rose-500" />
              <span>Declined {proposal.rejectReason ? `(${proposal.rejectReason})` : ""}</span>
            </div>
          ) : isWithdrawn ? (
            <span className="text-xs text-muted">Proposal withdrawn by artisan</span>
          ) : isPending && jobStatus === "OPEN" ? (
            <>
              {/* Decline Button */}
              <button
                type="button"
                onClick={() => onReject(proposal)}
                className="rounded-full border border-line bg-white hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 px-4 py-2 text-xs font-semibold text-muted transition-colors cursor-pointer"
              >
                Decline
              </button>

              {/* Accept Offer Button */}
              <button
                type="button"
                onClick={() => onAccept(proposal)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2 text-xs font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Accept Offer</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

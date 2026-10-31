"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, X, Loader2, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IQuotationItem } from "@/helpers/next-fetch/apiActions/quotationActions";
import { acceptQuotationAction } from "@/helpers/next-fetch/apiActions/quotationActions";

interface AcceptProposalModalProps {
  proposal: IQuotationItem;
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId?: string) => void;
}

export function AcceptProposalModal({
  proposal,
  jobId,
  isOpen,
  onClose,
  onSuccess,
}: AcceptProposalModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const artisan = proposal.artisan;
  const avatarUrl = artisan?.image ? getImageUrl(artisan.image) : null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const res = await acceptQuotationAction(proposal._id, jobId);
      if (res.success && res.data) {
        toast.success("Offer accepted! Your booking has been confirmed 🎉");
        const bookingId = res.data.booking?._id;
        onSuccess(bookingId);
      } else {
        toast.error(res.message || "Failed to accept proposal");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-smoke hover:text-title transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-title">
              Accept Proposal & Hire Artisan
            </h3>
            <p className="text-xs text-muted">
              Confirm your booking with this verified professional.
            </p>
          </div>
        </div>

        {/* PROPOSAL SUMMARY CARD */}
        <div className="rounded-2xl border border-line bg-smoke/60 p-4 space-y-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-line bg-white shadow-2xs">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={artisan?.name || "Artisan"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-slate-100 text-xs font-bold text-title">
                  {artisan?.name?.charAt(0) || "P"}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-sm font-bold text-title">
                  {artisan?.name}
                </h4>
                {artisan?.verified && (
                  <span title="Verified Artisan">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 inline" />
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">
                {artisan?.artisanProfileData?.trade || "Verified Craftsman"}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
            <span className="text-muted">Agreed Rate:</span>
            <span className="font-display font-bold text-base text-[#FE375D]">
              GH₵ {proposal.proposedAmount}{" "}
              <span className="text-xs font-normal text-muted">({proposal.rateType})</span>
            </span>
          </div>

          {proposal.estimatedDuration && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted">Estimated Duration:</span>
              <span className="font-semibold text-title">
                {proposal.estimatedDuration}
              </span>
            </div>
          )}
        </div>

        {/* POLICY BULLETS */}
        <div className="space-y-2 text-xs text-muted mb-6 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
          <p className="font-semibold text-blue-950 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Nutsumo Booking Protection:</span>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Your job status will transition to <strong>Booked</strong>.</li>
            <li>All other pending proposals for this job will be automatically declined.</li>
            <li>A confirmed work order with booking reference will be generated.</li>
          </ul>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-muted hover:text-title hover:border-title transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Confirming Booking...</span>
              </>
            ) : (
              <span>Confirm & Hire Artisan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

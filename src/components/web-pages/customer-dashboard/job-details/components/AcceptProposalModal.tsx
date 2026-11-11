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
        const checkoutUrl = res.data.checkoutUrl;
        const bookingId = res.data.booking?._id;

        if (checkoutUrl) {
          toast.success("Offer accepted! Redirecting to secure Stripe Escrow Checkout... 🔒");
          window.location.href = checkoutUrl;
          return;
        }

        toast.success("Offer accepted! Booking created awaiting escrow payment 🎉");
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
              Accept Proposal & Fund Escrow
            </h3>
            <p className="text-xs text-muted">
              Secure your booking with Nutsumo&apos;s Escrow Guarantee.
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

          <div className="pt-2 border-t border-line/60 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted">Service Cost:</span>
              <span className="font-semibold text-title">
                GH₵ {proposal.proposedAmount}{" "}
                <span className="text-[11px] font-normal text-muted">({proposal.rateType})</span>
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-dashed border-line/70">
              <span className="font-bold text-title">Total Amount Payable:</span>
              <span className="font-display font-bold text-base text-primary">
                GH₵ {proposal.proposedAmount}{" "}
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full ml-1">
                  Escrow Protected 🔒
                </span>
              </span>
            </div>

            <p className="text-[10px] text-muted pt-1">
              * Total includes statutory Ghana taxes (VAT 15%, NHIL 2.5%, GETFund 2.5%). No hidden fees.
            </p>
          </div>

          {proposal.estimatedDuration && (
            <div className="flex items-center justify-between text-xs pt-1 border-t border-line/50">
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
            <span>100% Escrow Protection Guarantee:</span>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600">
            <li>Your payment is deposited safely into <strong>Nutsumo Escrow</strong> via Stripe.</li>
            <li>Artisan begins work only after escrow is confirmed.</li>
            <li>Funds are released to the artisan only after you inspect and approve completion.</li>
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
                <span>Redirecting to Escrow...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Accept & Fund Escrow</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

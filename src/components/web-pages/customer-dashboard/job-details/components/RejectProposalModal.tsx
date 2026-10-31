"use client";

import { useState } from "react";
import { AlertCircle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { IQuotationItem } from "@/helpers/next-fetch/apiActions/quotationActions";
import { rejectQuotationAction } from "@/helpers/next-fetch/apiActions/quotationActions";

interface RejectProposalModalProps {
  proposal: IQuotationItem;
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_REASONS = [
  "Rate is higher than expected",
  "Scheduled date / availability doesn't match",
  "Scope details not clear",
  "Selected another proposal",
];

export function RejectProposalModal({
  proposal,
  jobId,
  isOpen,
  onClose,
  onSuccess,
}: RejectProposalModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      const res = await rejectQuotationAction(
        proposal._id,
        reason.trim() || "Declined by customer",
        jobId,
      );
      if (res.success) {
        toast.success("Proposal declined");
        onSuccess();
      } else {
        toast.error(res.message || "Failed to decline proposal");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-line z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-smoke hover:text-title transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-title">
              Decline Proposal
            </h3>
            <p className="text-xs text-muted">
              From {proposal.artisan?.name} (GH₵ {proposal.proposedAmount})
            </p>
          </div>
        </div>

        <p className="text-xs text-muted mb-3">
          Select or enter a reason for declining. This helps the artisan improve their future bids:
        </p>

        {/* REASON CHIPS */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {COMMON_REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className="rounded-lg border border-line bg-smoke/60 px-2.5 py-1 text-[11px] font-medium text-title hover:border-[#FE375D] transition-colors cursor-pointer"
            >
              {r}
            </button>
          ))}
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)..."
          rows={3}
          className="w-full rounded-xl border border-line p-3 text-xs text-title focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] resize-none"
        />

        <div className="mt-5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-muted hover:text-title cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleReject}
            className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-semibold shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Declining...</span>
              </>
            ) : (
              <span>Confirm Decline</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

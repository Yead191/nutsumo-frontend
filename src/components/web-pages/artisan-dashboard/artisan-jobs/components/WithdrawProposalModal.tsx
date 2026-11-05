"use client";

import { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { withdrawQuotationAction } from "@/helpers/next-fetch/apiActions/quotationActions";

interface WithdrawProposalModalProps {
  quotationId: string;
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function WithdrawProposalModal({
  quotationId,
  jobId,
  isOpen,
  onClose,
  onSuccess,
}: WithdrawProposalModalProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  if (!isOpen) return null;

  const handleConfirmWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const res = await withdrawQuotationAction(quotationId, jobId);
      if (res.success) {
        toast.success("Proposal withdrawn successfully.");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Failed to withdraw proposal.");
      }
    } catch {
      toast.error("An error occurred while withdrawing proposal.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={!isWithdrawing ? onClose : undefined}
      />

      {/* DIALOG BOX */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-line z-10 animate-in fade-in zoom-in-95 duration-200 space-y-4">
        <button
          type="button"
          disabled={isWithdrawing}
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-smoke hover:text-title transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-100">
            <AlertTriangle className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-title">
              Withdraw Proposal?
            </h3>
            <p className="text-xs text-muted">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-copy leading-relaxed bg-smoke/60 p-3.5 rounded-2xl border border-line/60">
          Are you sure you want to withdraw your offer for this job? Your quotation will be cancelled, and the homeowner will be notified that your proposal was retracted.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isWithdrawing}
            onClick={onClose}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-muted hover:text-title hover:border-title transition-colors cursor-pointer"
          >
            Keep Proposal
          </button>
          <button
            type="button"
            disabled={isWithdrawing}
            onClick={handleConfirmWithdraw}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Withdrawing...</span>
              </>
            ) : (
              <span>Yes, Withdraw Proposal</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

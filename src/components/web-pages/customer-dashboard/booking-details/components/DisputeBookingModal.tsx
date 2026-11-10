"use client";

import { useState } from "react";
import {
  AlertTriangle,
  X,
  Loader2,
  ShieldAlert,
  PhoneCall,
} from "lucide-react";
import { toast } from "sonner";
import { disputeBookingAction } from "@/helpers/next-fetch/apiActions/bookingActions";

interface DisputeBookingModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DisputeBookingModal({
  bookingId,
  isOpen,
  onClose,
  onSuccess,
}: DisputeBookingModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim() || reason.trim().length < 10) {
      toast.error(
        "Please explain the issue thoroughly (at least 10 characters)",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await disputeBookingAction(bookingId, {
        reason: reason.trim(),
      });

      if (res.success) {
        toast.success(
          "Dispute submitted. A Nutsumo resolution specialist has been assigned to mediate.",
        );
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Failed to submit dispute");
      }
    } catch {
      toast.error("An unexpected error occurred while initiating dispute");
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

      {/* Dialog */}
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
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
            <AlertTriangle className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-title">
              Open Resolution Dispute
            </h3>
            <p className="text-xs text-muted">
              Initiate formal mediation with the Nutsumo trust & safety team.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-title mb-1.5">
              Reason for Dispute & Issues Encountered{" "}
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe the issue in detail (e.g., job abandoned, damage caused, work not done according to agreed scope)..."
              className="w-full rounded-2xl border border-line bg-smoke/40 p-3 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div className="rounded-2xl bg-rose-50/70 p-3.5 border border-rose-100 text-xs text-rose-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-rose-900">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span>Escrow Funds Frozen</span>
            </div>
            <p className="leading-relaxed">
              Once submitted, all milestone payouts are immediately locked.
              Neither party can withdraw or release funds without an Admin
              resolution officer&apos;s review.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-full border border-line bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-muted hover:text-title hover:border-title transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Dispute...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4" />
                  <span>Submit Dispute to Admin</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

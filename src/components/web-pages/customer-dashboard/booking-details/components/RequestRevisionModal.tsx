"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, X, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { requestBookingRevisionAction } from "@/helpers/next-fetch/apiActions/bookingActions";

interface RequestRevisionModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function RequestRevisionModal({
  bookingId,
  isOpen,
  onClose,
  onSuccess,
}: RequestRevisionModalProps) {
  const [revisionNotes, setRevisionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!revisionNotes.trim() || revisionNotes.trim().length < 5) {
      toast.error(
        "Please explain what adjustments are needed (at least 5 characters)",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestBookingRevisionAction(bookingId, {
        revisionNotes: revisionNotes.trim(),
      });

      if (res.success) {
        toast.success(
          "Revision requested! The artisan has been notified to make adjustments.",
        );
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Failed to request revision");
      }
    } catch {
      toast.error("An unexpected error occurred while requesting revision");
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
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <RefreshCw className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-title">
              Request Work Revisions
            </h3>
            <p className="text-xs text-muted">
              Ask your craftsman to fix or adjust details before releasing
              escrow.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-title mb-1.5">
              Specific Changes or Corrections Needed{" "}
              <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="E.g., The pipe joint on the left still has a slight water seep. Please inspect the seal and tighten before finalizing..."
              className="w-full rounded-2xl border border-line bg-smoke/40 p-3 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="rounded-2xl bg-blue-50/70 p-3.5 border border-blue-100 text-xs text-blue-950 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Escrow remains 100% protected:</strong> Your funds will
              not be released. The craftsman will review your notes and resubmit
              the delivered work once updated.
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
              className="inline-flex items-center gap-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Send Revision Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

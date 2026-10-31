"use client";

import { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cancelJobAction } from "@/helpers/next-fetch/apiActions/jobActions";

interface CancelJobModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CancelJobModal({
  jobId,
  isOpen,
  onClose,
  onSuccess,
}: CancelJobModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCancel = async () => {
    setIsSubmitting(true);
    try {
      const res = await cancelJobAction(jobId);
      if (res.success) {
        toast.success("Job request cancelled");
        onSuccess();
      } else {
        toast.error(res.message || "Failed to cancel job");
      }
    } catch {
      toast.error("An unexpected error occurred");
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

      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-line z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-smoke hover:text-title transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <AlertTriangle className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-title">
              Cancel Service Request?
            </h3>
            <p className="text-xs text-muted">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-copy leading-relaxed mb-6">
          Are you sure you want to cancel this job? Once cancelled, active artisans will no longer be able to submit proposals, and current proposals will be closed.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-full border border-line bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-muted hover:text-title cursor-pointer"
          >
            Keep Open
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleCancel}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cancelling...</span>
              </>
            ) : (
              <span>Yes, Cancel Job</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

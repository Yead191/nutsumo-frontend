"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Send,
  Loader2,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { submitQuotationAction } from "@/helpers/next-fetch/apiActions/quotationActions";
import type { RateType } from "@/helpers/next-fetch/apiActions/quotationActions";
import type { IJobItem } from "../types";

interface SendProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: IJobItem;
  currentUserRole?: string | null;
  onSuccess?: () => void;
}

export function SendProposalModal({
  isOpen,
  onClose,
  job,
  currentUserRole,
  onSuccess,
}: SendProposalModalProps) {
  const router = useRouter();

  const [proposedAmount, setProposedAmount] = useState<string>(
    job.budget ? String(job.budget) : "",
  );
  const [rateType, setRateType] = useState<RateType>("FIXED");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [message, setMessage] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isArtisan = currentUserRole === "ARTISAN";
  const isLoggedIn = Boolean(currentUserRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error("Please log in to submit a proposal");
      router.push(`/login?next=/jobs/${job._id}`);
      return;
    }

    if (!isArtisan) {
      toast.error("Only registered Job Seekers can submit quotations");
      return;
    }

    const amountNum = Number(proposedAmount);
    if (!proposedAmount || Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid proposal amount in GH₵");
      return;
    }

    if (!message.trim() || message.trim().length < 15) {
      toast.error("Please introduce yourself and your proposal details (at least 15 characters)");
      return;
    }

    if (!agreedTerms) {
      toast.error("Please acknowledge the platform terms and service commitment");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitQuotationAction({
        job: job._id,
        proposedAmount: amountNum,
        rateType,
        estimatedDuration: estimatedDuration.trim() || undefined,
        message: message.trim(),
      });

      if (res.success) {
        toast.success("Quotation submitted successfully! The client has been notified.");
        onClose();
        if (onSuccess) onSuccess();
        router.refresh();
      } else {
        toast.error(res.message || "Failed to submit quotation. You may have already quoted this job.");
      }
    } catch {
      toast.error("An error occurred while submitting quotation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-smoke text-muted hover:text-title transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER */}
        <div className="border-b border-line/70 pb-4 pr-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-[#FE375D]">
            Official Proposal
          </span>
          <h2 className="font-display text-xl font-bold text-title tracking-tight mt-1.5">
            Submit Quotation to Client
          </h2>
          <p className="text-xs text-muted truncate mt-0.5">
            For: <span className="font-semibold text-title">{job.title}</span>
          </p>
        </div>

        {/* ROLE NOTICE */}
        {!isLoggedIn ? (
          <div className="my-6 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Account Required</p>
              <p className="mt-0.5">
                You must be logged in as a registered Job Seeker to send proposals to clients.
              </p>
              <Link
                href={`/login?next=/jobs/${job._id}`}
                className="mt-2 inline-flex items-center gap-1.5 font-bold text-[#FE375D] hover:underline"
              >
                Log In Now &rarr;
              </Link>
            </div>
          </div>
        ) : !isArtisan ? (
          <div className="my-6 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#FE375D] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Job Seeker Access Only</p>
              <p className="mt-0.5">
                Your current account role is not registered as a Job Seeker. Only registered service providers can submit quotations.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* TARGET CLIENT BUDGET INFO */}
            {job.budget ? (
              <div className="flex items-center justify-between rounded-2xl bg-smoke/80 px-4 py-3 border border-line text-xs">
                <span className="text-muted">Client Target Budget:</span>
                <span className="font-display font-bold text-sm text-[#FE375D]">
                  GH₵{job.budget.toLocaleString()}
                </span>
              </div>
            ) : null}

            {/* AMOUNT & RATE TYPE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-title mb-1.5">
                  Your Proposed Price (GH₵) <span className="text-[#FE375D]">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-xs font-bold text-muted">
                    GH₵
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full rounded-xl border border-line bg-white pl-12 pr-3.5 py-2.5 text-xs sm:text-sm font-bold text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-title mb-1.5">
                  Pricing Structure
                </label>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value as RateType)}
                  className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-xs sm:text-sm font-medium text-title focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs cursor-pointer"
                >
                  <option value="FIXED">Fixed Total Price</option>
                  <option value="HOURLY">Hourly Rate</option>
                  <option value="DAILY">Daily Rate</option>
                </select>
              </div>
            </div>

            {/* ESTIMATED TIMELINE */}
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Estimated Duration / Turnaround
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="e.g. 2-3 hours, 1 day, or 3 days"
                  className="w-full rounded-xl border border-line bg-white pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs"
                />
              </div>
            </div>

            {/* COVER LETTER / MESSAGE */}
            <div>
              <label className="block text-xs font-semibold text-title mb-1.5">
                Proposal Details & Message <span className="text-[#FE375D]">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain how you will solve this job, your relevant experience, tools or materials included, and when you can begin..."
                className="w-full rounded-xl border border-line bg-white p-3 text-xs sm:text-sm text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] shadow-2xs resize-none"
              />
              <span className="text-[11px] text-muted block mt-1">
                Clear and professional proposals have a 3x higher acceptance rate.
              </span>
            </div>

            {/* TERMS CHECKBOX */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="proposal-terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-line text-[#FE375D] focus:ring-[#FE375D] cursor-pointer"
              />
              <label
                htmlFor="proposal-terms"
                className="text-[11px] text-muted leading-tight cursor-pointer"
              >
                I confirm that I am qualified to perform this work and will abide by Nutsumo's Quality Guarantee and safety standards.
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-3 border-t border-line flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-muted hover:text-title transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Proposal</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

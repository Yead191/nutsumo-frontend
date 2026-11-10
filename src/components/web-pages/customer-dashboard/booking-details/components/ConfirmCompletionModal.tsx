"use client";

import { useState } from "react";
import { Star, X, Loader2, CheckCircle2, ShieldCheck, ThumbsUp, MessageSquare, Clock, Award } from "lucide-react";
import { toast } from "sonner";
import { confirmBookingCompletionAction } from "@/helpers/next-fetch/apiActions/bookingActions";

interface ConfirmCompletionModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfirmCompletionModal({
  bookingId,
  isOpen,
  onClose,
  onSuccess,
}: ConfirmCompletionModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");

  // Detailed sub-ratings
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [communicationRating, setCommunicationRating] = useState<number>(5);
  const [timelinessRating, setTimelinessRating] = useState<number>(5);
  const [showDetailedRatings, setShowDetailedRatings] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await confirmBookingCompletionAction(bookingId, {
        rating,
        feedback: feedback.trim() || undefined,
      });

      if (res.success) {
        toast.success("Work confirmed & approved! Escrow released to payout 🎉");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Failed to confirm completion");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRow = (
    value: number,
    onChange: (val: number) => void,
    label: string,
    Icon: any = Star,
  ) => (
    <div className="flex items-center justify-between py-1.5 border-b border-line/60 last:border-none">
      <span className="text-xs font-medium text-title flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-primary" />
        <span>{label}</span>
      </span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 hover:scale-110 transition-transform cursor-pointer"
          >
            <Star
              className={`h-4 w-4 ${
                star <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-line z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
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
              Confirm Completion & Release Escrow
            </h3>
            <p className="text-xs text-muted">
              Rate your craftsman and authorize the final milestone payout.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OVERALL RATING */}
          <div className="rounded-2xl border border-line bg-smoke/40 p-4 text-center space-y-2">
            <label className="block text-xs font-bold text-title">
              Overall Satisfaction Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="grid h-10 w-10 place-items-center rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  <Star
                    className={`h-7 w-7 transition-all ${
                      (hoverRating || rating) >= star
                        ? "fill-amber-400 text-amber-400 scale-110"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-extrabold text-title">
              {hoverRating || rating} / 5 Stars ·{" "}
              {(hoverRating || rating) === 5
                ? "Exceptional Service"
                : (hoverRating || rating) === 4
                  ? "Good Experience"
                  : (hoverRating || rating) === 3
                    ? "Average"
                    : "Below Expectations"}
            </span>
          </div>

          {/* DETAILED RATINGS TOGGLE */}
          <div className="border border-line/80 rounded-2xl p-3.5 bg-white">
            <button
              type="button"
              onClick={() => setShowDetailedRatings(!showDetailedRatings)}
              className="w-full flex items-center justify-between text-xs font-semibold text-title cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-primary" />
                <span>Rate specific aspects (Quality, Communication, Timeliness)</span>
              </span>
              <span className="text-primary font-bold">
                {showDetailedRatings ? "Hide" : "Expand"}
              </span>
            </button>

            {showDetailedRatings && (
              <div className="mt-3 pt-3 border-t border-line/60 space-y-1">
                {renderStarRow(qualityRating, setQualityRating, "Quality of Work", Award)}
                {renderStarRow(communicationRating, setCommunicationRating, "Communication", MessageSquare)}
                {renderStarRow(timelinessRating, setTimelinessRating, "Timeliness & Punctuality", Clock)}
              </div>
            )}
          </div>

          {/* FEEDBACK COMMENT */}
          <div>
            <label className="block text-xs font-semibold text-title mb-1.5">
              Review & Testimonial <span className="text-muted font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share what impressed you most with this craftsman to help other homeowners..."
              className="w-full rounded-2xl border border-line bg-smoke/40 p-3 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* ESCROW RELEASE NOTICE */}
          <div className="rounded-2xl bg-emerald-50/70 p-3.5 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              By confirming, you acknowledge that you have inspected the delivered work and authorize the platform to disburse the held escrow funds to the craftsman.
            </p>
          </div>

          {/* ACTIONS */}
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
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Releasing Escrow...</span>
                </>
              ) : (
                <>
                  <ThumbsUp className="h-4 w-4" />
                  <span>Confirm & Release Escrow</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

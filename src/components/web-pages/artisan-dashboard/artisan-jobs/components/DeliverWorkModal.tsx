"use client";

import { useState } from "react";
import { PackageCheck, X, Loader2, ImagePlus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deliverBookingWorkAction } from "@/helpers/next-fetch/apiActions/bookingActions";

interface DeliverWorkModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeliverWorkModal({
  bookingId,
  isOpen,
  onClose,
  onSuccess,
}: DeliverWorkModalProps) {
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [workImages, setWorkImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    try {
      new URL(imageUrlInput.trim());
      setWorkImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    } catch {
      toast.error("Please enter a valid image URL");
    }
  };

  const handleRemoveImage = (index: number) => {
    setWorkImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryNotes.trim() || deliveryNotes.trim().length < 5) {
      toast.error("Please provide detailed delivery notes (at least 5 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await deliverBookingWorkAction(bookingId, {
        deliveryNotes: deliveryNotes.trim(),
        workImages: workImages.length > 0 ? workImages : undefined,
      });

      if (res.success) {
        toast.success("Work delivered successfully! Customer notified for review 🎉");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Failed to deliver work");
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
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <PackageCheck className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-title">
              Deliver Completed Work
            </h3>
            <p className="text-xs text-muted">
              Submit your work handover notes and proof for client sign-off.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DELIVERY NOTES */}
          <div>
            <label className="block text-xs font-semibold text-title mb-1.5">
              Work Delivery Notes <span className="text-[#FE375D]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Explain the work done, replacements made, test results, and any maintenance advice for the client..."
              className="w-full rounded-2xl border border-line bg-smoke/40 p-3 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FE375D]"
            />
          </div>

          {/* PROOF IMAGES INPUT */}
          <div>
            <label className="block text-xs font-semibold text-title mb-1.5">
              Completion Photo Proof (Optional URLs)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 rounded-xl border border-line bg-white px-3 py-2 text-xs text-title focus:outline-none focus:ring-1 focus:ring-[#FE375D]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="inline-flex items-center gap-1 rounded-xl bg-slate-900 text-white px-4 py-2 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            {workImages.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {workImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-lg bg-smoke px-2.5 py-1 text-xs border border-line"
                  >
                    <span className="max-w-[150px] truncate font-mono text-[11px] text-muted">
                      {img}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-muted hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NOTICE */}
          <div className="rounded-2xl bg-blue-50/70 p-3.5 border border-blue-100 text-xs text-blue-950 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Once delivered, the customer will receive an alert to inspect the job and authorize payout.
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
              className="inline-flex items-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Delivery...</span>
                </>
              ) : (
                <span>Submit & Deliver Work</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

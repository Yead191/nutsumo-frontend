"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  PackageCheck,
  X,
  Loader2,
  UploadCloud,
  ShieldCheck,
  Trash2,
  FileImage,
  Plus,
} from "lucide-react";
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    // Limit to max 10 images total
    const totalCount = selectedFiles.length + filesArray.length;
    if (totalCount > 10) {
      toast.error("You can upload a maximum of 10 proof photos.");
      return;
    }

    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...filesArray]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);

    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    // Revoke preview object url
    if (filePreviews[index]) {
      URL.revokeObjectURL(filePreviews[index]);
    }
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryNotes.trim() || deliveryNotes.trim().length < 5) {
      toast.error("Please provide detailed delivery notes (at least 5 characters)");
      return;
    }

    setIsSubmitting(true);
    try {
      let res;
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append("deliveryNotes", deliveryNotes.trim());
        selectedFiles.forEach((file) => {
          formData.append("deliveryProof", file);
        });
        res = await deliverBookingWorkAction(bookingId, formData);
      } else {
        res = await deliverBookingWorkAction(bookingId, {
          deliveryNotes: deliveryNotes.trim(),
        });
      }

      if (res.success) {
        toast.success("Work delivered successfully! Customer notified for review 🎉");
        onSuccess();
        onClose();
      } else {
        toast.error(res.message || "Failed to deliver work");
      }
    } catch {
      toast.error("An unexpected error occurred during delivery submission");
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
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <PackageCheck className="h-6 w-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-title">
              Deliver Completed Work
            </h3>
            <p className="text-xs text-muted">
              Submit your handover report and completion photos for client review.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DELIVERY NOTES */}
          <div>
            <label className="block text-xs font-semibold text-title mb-1.5">
              Work Delivery Notes <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Detail the work done, replacements made, water/pressure test results, and any maintenance advice for the homeowner..."
              className="w-full rounded-2xl border border-line bg-smoke/40 p-3 text-xs sm:text-sm text-title placeholder:text-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* PROOF IMAGES FILE UPLOAD */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-title">
                Completion Proof Photos{" "}
                <span className="text-muted font-normal">(Up to 10 photos)</span>
              </label>
              <span className="text-[11px] font-mono text-muted">
                {selectedFiles.length}/10 selected
              </span>
            </div>

            {/* DROPZONE / PICKER */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-line hover:border-primary rounded-2xl p-4 text-center cursor-pointer transition-colors bg-smoke/30 hover:bg-primary/5 flex flex-col items-center justify-center gap-1.5"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-2xs border border-line text-primary">
                <UploadCloud className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-title">
                Click to browse or take photos
              </span>
              <span className="text-[11px] text-muted">
                PNG, JPG, WEBP up to 10MB each
              </span>
            </div>

            {/* PREVIEWS */}
            {filePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {filePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl overflow-hidden border border-line group bg-slate-100"
                  >
                    <Image
                      src={preview}
                      alt={`Proof thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
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
              Once submitted, the homeowner is alerted to inspect the job. Escrow funds remain safely secured and will be disbursed once the client approves.
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
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Delivering Work...</span>
                </>
              ) : (
                <>
                  <PackageCheck className="h-4 w-4" />
                  <span>Submit & Deliver Work</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

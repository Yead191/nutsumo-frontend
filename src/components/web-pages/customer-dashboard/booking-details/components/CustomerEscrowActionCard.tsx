"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PackageCheck,
  Star,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Scale,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";
import { createBookingCheckoutSessionAction } from "@/helpers/next-fetch/apiActions/bookingActions";
import type { IBookingItem } from "@/helpers/next-fetch/apiActions/bookingActions";
import { ConfirmCompletionModal } from "./ConfirmCompletionModal";
import { RequestRevisionModal } from "./RequestRevisionModal";
import { DisputeBookingModal } from "./DisputeBookingModal";
import { ImageLightboxModal } from "@/components/shared/ImageLightboxModal";
import { getImageUrl } from "@/lib/getImageUrl";

interface CustomerEscrowActionCardProps {
  booking: IBookingItem;
  onRefresh?: () => void;
}

export function CustomerEscrowActionCard({
  booking,
  onRefresh,
}: CustomerEscrowActionCardProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isAwaitingPayment =
    booking.status === "AWAITING_PAYMENT" || booking.paymentStatus === "UNPAID";
  const isDelivered = booking.status === "DELIVERED";
  const isRevisionRequested = booking.status === "REVISION_REQUESTED";
  const isDisputed = booking.status === "DISPUTED";
  const isCompleted = booking.status === "COMPLETED";

  const handlePayEscrow = async () => {
    setIsRedirecting(true);
    try {
      const res = await createBookingCheckoutSessionAction(booking._id);
      if (res.success && res.data?.checkoutUrl) {
        toast.success("Redirecting to secure Stripe Escrow Checkout... 🔒");
        window.location.href = res.data.checkoutUrl;
      } else {
        toast.error(res.message || "Failed to initialize payment checkout");
        setIsRedirecting(false);
      }
    } catch {
      toast.error("Failed to connect with payment gateway");
      setIsRedirecting(false);
    }
  };

  const handleActionSuccess = () => {
    if (onRefresh) onRefresh();
    else window.location.reload();
  };

  // 1. AWAITING PAYMENT STATE
  if (isAwaitingPayment) {
    return (
      <div className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2.5 text-title">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-xs">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-title">
                Action Required: Fund Escrow Deposit
              </h3>
              <p className="text-xs text-muted">
                Artisan work will begin immediately once escrow is held.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-muted block uppercase font-bold">
              Total Due
            </span>
            <span className="font-display text-2xl font-black text-primary">
              GH₵ {booking.totalAmount?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 border border-line text-xs text-copy space-y-2">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Nutsumo 100% Escrow Guarantee:</strong> Your deposit is
              held securely in platform escrow. The artisan does NOT receive the
              payout until you inspect the delivered work and confirm
              satisfaction.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span className="text-xs text-muted flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-muted" />
            <span>Secure 256-bit encrypted Stripe checkout</span>
          </span>

          <button
            type="button"
            disabled={isRedirecting}
            onClick={handlePayEscrow}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-7 py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Redirecting to Stripe...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>
                  Pay Escrow Deposit (GH₵{" "}
                  {booking.totalAmount?.toLocaleString()})
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // 2. DELIVERED STATE: CUSTOMER INSPECTION & ACTIONS
  if (isDelivered) {
    return (
      <div className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2.5 text-title">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white shadow-xs">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-title">
                Artisan Delivered the Work!
              </h3>
              <p className="text-xs text-muted">
                Please inspect the job thoroughly and choose an action below.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Review Required
          </span>
        </div>

        {/* DELIVERY NOTES */}
        {booking.deliveryNotes && (
          <div className="rounded-2xl bg-white p-4 border border-line text-xs space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-muted block">
              Artisan&apos;s Handover Notes
            </span>
            <p className="text-xs sm:text-sm text-copy italic leading-relaxed whitespace-pre-line">
              &ldquo;{booking.deliveryNotes}&rdquo;
            </p>
          </div>
        )}

        {/* PROOF IMAGES */}
        {booking.deliveryProof && booking.deliveryProof.length > 0 && (
          <div className="rounded-2xl bg-white p-4 border border-line space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-muted block tracking-wider">
                Completion Proof Photos ({booking.deliveryProof.length})
              </span>
              <span className="text-[11px] text-muted hidden sm:inline">
                Click any photo to view full screen
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {booking.deliveryProof.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className="relative h-20 w-24 rounded-xl overflow-hidden border border-line bg-slate-100 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all text-left"
                  title="Click to view full screen"
                >
                  <Image
                    src={getImageUrl(img) || img}
                    alt={`Proof ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity gap-1">
                    <Maximize2 className="h-4 w-4 drop-shadow-md" />
                    <span className="text-[10px] font-semibold tracking-wide drop-shadow-sm">
                      View
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* THREE ACTION CHOICES: APPROVE / REVISION / DISPUTE */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsDisputeModalOpen(true)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Problem with work? Raise dispute</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsRevisionModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full border border-amber-300 bg-white hover:bg-amber-50 text-amber-800 px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-amber-600" />
              <span>Request Changes</span>
            </button>

            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Inspect & Release Escrow</span>
            </button>
          </div>
        </div>

        {/* MODALS */}
        <ConfirmCompletionModal
          bookingId={booking._id}
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onSuccess={handleActionSuccess}
        />
        <RequestRevisionModal
          bookingId={booking._id}
          isOpen={isRevisionModalOpen}
          onClose={() => setIsRevisionModalOpen(false)}
          onSuccess={handleActionSuccess}
        />
        <DisputeBookingModal
          bookingId={booking._id}
          isOpen={isDisputeModalOpen}
          onClose={() => setIsDisputeModalOpen(false)}
          onSuccess={handleActionSuccess}
        />

        {/* FULLSCREEN IMAGE LIGHTBOX */}
        {booking.deliveryProof && booking.deliveryProof.length > 0 && (
          <ImageLightboxModal
            images={booking.deliveryProof}
            initialIndex={lightboxIndex ?? 0}
            isOpen={lightboxIndex !== null}
            onClose={() => setLightboxIndex(null)}
            title={`Completion Proof · Booking #${booking.bookingNumber || ""}`}
          />
        )}
      </div>
    );
  }

  // 3. REVISION REQUESTED STATE
  if (isRevisionRequested) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/60 pb-4">
          <div className="flex items-center gap-2.5 text-amber-950">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500 text-white shadow-xs">
              <RefreshCw className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-title">
                Revisions In Progress
              </h3>
              <p className="text-xs text-muted">
                The craftsman is addressing your requested adjustments.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Awaiting Re-Delivery
          </span>
        </div>

        {booking.revisionNotes && (
          <div className="rounded-2xl bg-white p-4 border border-amber-200 text-xs space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-muted block">
              Your Requested Changes ({booking.revisionCount || 1} revision)
            </span>
            <p className="text-xs sm:text-sm text-copy italic leading-relaxed whitespace-pre-line">
              &ldquo;{booking.revisionNotes}&rdquo;
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted pt-1">
          <span>Funds remain 100% secured in platform escrow.</span>
          <button
            type="button"
            onClick={() => setIsDisputeModalOpen(true)}
            className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
          >
            Unresponsive artisan? Open dispute
          </button>
        </div>

        <DisputeBookingModal
          bookingId={booking._id}
          isOpen={isDisputeModalOpen}
          onClose={() => setIsDisputeModalOpen(false)}
          onSuccess={handleActionSuccess}
        />

        {/* FULLSCREEN IMAGE LIGHTBOX */}
        {booking.deliveryProof && booking.deliveryProof.length > 0 && (
          <ImageLightboxModal
            images={booking.deliveryProof}
            initialIndex={lightboxIndex ?? 0}
            isOpen={lightboxIndex !== null}
            onClose={() => setLightboxIndex(null)}
            title={`Completion Proof · Booking #${booking.bookingNumber || ""}`}
          />
        )}
      </div>
    );
  }

  // 4. DISPUTED STATE
  if (isDisputed) {
    return (
      <div className="rounded-3xl border-2 border-rose-300 bg-rose-50/50 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-200 pb-4">
          <div className="flex items-center gap-2.5 text-rose-950">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-600 text-white shadow-xs">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-title">
                Dispute Under Admin Review
              </h3>
              <p className="text-xs text-muted">
                A Nutsumo resolution specialist is actively mediating this case.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-rose-100 text-rose-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Escrow Frozen
          </span>
        </div>

        {booking.disputeReason && (
          <div className="rounded-2xl bg-white p-4 border border-rose-200 text-xs space-y-1.5">
            <span className="text-[10px] font-bold uppercase text-rose-800 block">
              Reported Issue
            </span>
            <p className="text-xs sm:text-sm text-copy leading-relaxed whitespace-pre-line">
              &ldquo;{booking.disputeReason}&rdquo;
            </p>
          </div>
        )}

        <p className="text-xs text-slate-600 leading-relaxed">
          Both parties will be contacted via email/messages. Neither payment
          payout nor refund can proceed without admin resolution.
        </p>
      </div>
    );
  }

  // 5. COMPLETED STATE
  if (isCompleted) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-emerald-800">
          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          <h3 className="font-display text-base font-bold text-title">
            Booking Successfully Completed!
          </h3>
        </div>

        <p className="text-xs text-copy leading-relaxed">
          You approved this job on{" "}
          {booking.customerConfirmedAt
            ? new Date(booking.customerConfirmedAt).toLocaleDateString()
            : "record"}
          . Escrow funds have been successfully released to the craftsman.
        </p>

        {booking.customerRating && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-xs text-muted font-medium">Your Review:</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= (booking.customerRating || 0)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-title ml-1">
              {booking.customerRating}/5
            </span>
          </div>
        )}

        {booking.customerFeedback && (
          <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-emerald-100">
            &ldquo;{booking.customerFeedback}&rdquo;
          </p>
        )}

        {booking.deliveryProof && booking.deliveryProof.length > 0 && (
          <div className="pt-2 border-t border-emerald-200/60 space-y-2">
            <span className="text-[10px] font-bold uppercase text-muted block tracking-wider">
              Completed Work Photos ({booking.deliveryProof.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {booking.deliveryProof.map((img, idx) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className="relative h-14 w-18 rounded-xl overflow-hidden border border-emerald-200 bg-white group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-left"
                  title="Click to view full screen"
                >
                  <Image
                    src={getImageUrl(img) || img}
                    alt={`Proof ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                    <Maximize2 className="h-3.5 w-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FULLSCREEN IMAGE LIGHTBOX */}
        {booking.deliveryProof && booking.deliveryProof.length > 0 && (
          <ImageLightboxModal
            images={booking.deliveryProof}
            initialIndex={lightboxIndex ?? 0}
            isOpen={lightboxIndex !== null}
            onClose={() => setLightboxIndex(null)}
            title={`Completed Work · Booking #${booking.bookingNumber || ""}`}
          />
        )}
      </div>
    );
  }

  // 6. IN PROGRESS / CONFIRMED ESCROW HELD
  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 sm:p-6 shadow-xs space-y-2">
      <div className="flex items-center gap-2 text-primary font-bold text-sm">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span>Escrow Deposit Protected · Work in Execution</span>
      </div>
      <p className="text-xs text-copy leading-relaxed">
        Your payment of GH₵ {booking.totalAmount?.toLocaleString()} is securely
        held in platform escrow. The artisan has been notified to execute the
        project scope. You will be prompted to review and authorize release once
        the artisan delivers.
      </p>
    </div>
  );
}

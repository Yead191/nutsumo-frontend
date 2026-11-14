import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, Lock, Clock, AlertTriangle } from "lucide-react";
import { verifyBookingPaymentAction, getBookingDetailsAction } from "@/helpers/next-fetch/apiActions/bookingActions";

export const metadata: Metadata = {
  title: "Payment Successful · Escrow Deposit Secured · Nutsumo",
  description: "Your escrow payment has been successfully secured on Nutsumo.",
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    bookingId?: string;
    session_id?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { bookingId, session_id } = await searchParams;

  let booking: any = null;
  let errorMsg: string | null = null;

  if (session_id) {
    const verifyRes = await verifyBookingPaymentAction(session_id);
    if (verifyRes.success && verifyRes.data) {
      booking = verifyRes.data;
    } else {
      errorMsg = verifyRes.message || "Payment verification in progress";
    }
  }

  // Fallback to fetch booking by bookingId if verify didn't return doc
  if (!booking && bookingId) {
    const bookingRes = await getBookingDetailsAction(bookingId);
    if (bookingRes.success && bookingRes.data) {
      booking = bookingRes.data;
    }
  }

  const targetBookingId = booking?._id || bookingId;
  const bookingNumber = booking?.bookingNumber || "CONFIRMED";
  const amount = booking?.totalAmount;
  const jobTitle = booking?.job?.title || "Home Service";

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 sm:px-6 bg-slate-50/50 ">
      <div className="w-full max-w-xl rounded-3xl border border-line bg-white p-6 sm:p-10 shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* SUCCESS ICON */}
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-inner">
          <CheckCircle2 className="h-10 w-10 stroke-[2.2]" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 uppercase tracking-wider mb-2">
            <Lock className="h-3.5 w-3.5" />
            <span>Escrow Deposit Secured</span>
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-title tracking-tight">
            Payment Successfully Held in Escrow!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
            Your funds are safely protected under Nutsumo Assurance. The artisan has been notified to start work immediately.
          </p>
        </div>

        {/* BOOKING INFO TILE */}
        <div className="rounded-2xl border border-line bg-smoke/60 p-4 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-line/60">
            <span className="text-muted font-medium">Booking Reference:</span>
            <span className="font-mono font-bold text-title">#{bookingNumber}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-line/60">
            <span className="text-muted font-medium">Service Scope:</span>
            <span className="font-bold text-title truncate max-w-[200px] sm:max-w-xs">{jobTitle}</span>
          </div>

          {amount !== undefined && (
            <div className="flex items-center justify-between pb-2 border-b border-line/60">
              <span className="text-muted font-medium">Secured Amount:</span>
              <span className="font-display font-bold text-base text-[#FE375D]">
                GH₵ {amount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-muted font-medium">Escrow Status:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ESCROW HELD (100% Protected)
            </span>
          </div>
        </div>

        {/* ESCROW GUARANTEE CALLOUT */}
        <div className="rounded-2xl bg-blue-50/70 p-4 border border-blue-100 text-left flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 space-y-1">
            <p className="font-bold">How Nutsumo Escrow Protects You:</p>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
              <li>The artisan begins work with guaranteed milestone funding.</li>
              <li>Funds are NOT released until you inspect the delivered work.</li>
              <li>You have full control to approve completion or request adjustments.</li>
            </ul>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {targetBookingId ? (
            <Link
              href={`/account/bookings/${targetBookingId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-7 py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>View Booking & Track Progress</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/account/bookings"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-7 py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Go to My Bookings</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <Link
            href="/account"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-muted hover:text-title hover:border-title transition-colors cursor-pointer"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

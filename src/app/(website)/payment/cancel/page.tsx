import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { getBookingDetailsAction } from "@/helpers/next-fetch/apiActions/bookingActions";

export const metadata: Metadata = {
  title: "Payment Cancelled · Nutsumo",
  description: "Your escrow payment checkout was cancelled or incomplete.",
};

interface PaymentCancelPageProps {
  searchParams: Promise<{
    bookingId?: string;
  }>;
}

export default async function PaymentCancelPage({
  searchParams,
}: PaymentCancelPageProps) {
  const { bookingId } = await searchParams;

  let booking: any = null;
  if (bookingId) {
    const res = await getBookingDetailsAction(bookingId);
    if (res.success && res.data) {
      booking = res.data;
    }
  }

  const bookingNumber = booking?.bookingNumber || "PENDING";
  const amount = booking?.totalAmount;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-slate-50/50">
      <div className="w-full max-w-xl rounded-3xl border border-line bg-white p-6 sm:p-10 shadow-xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* CANCEL ICON */}
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-100 shadow-inner">
          <AlertCircle className="h-10 w-10 stroke-[2.2]" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700 border border-amber-200 uppercase tracking-wider mb-2">
            Escrow Deposit Pending
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-title tracking-tight">
            Checkout Incomplete
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
            You were not charged. Your booking reference is safely saved under your account, but the artisan cannot begin work until the escrow deposit is funded.
          </p>
        </div>

        {/* BOOKING INFO */}
        {booking && (
          <div className="rounded-2xl border border-line bg-smoke/60 p-4 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Booking Reference:</span>
              <span className="font-mono font-bold text-title">#{bookingNumber}</span>
            </div>
            {amount !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-muted font-medium">Pending Deposit:</span>
                <span className="font-display font-bold text-[#FE375D]">
                  GH₵ {amount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted font-medium">Current Status:</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                AWAITING PAYMENT
              </span>
            </div>
          </div>
        )}

        {/* HELPFUL NOTE */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-line text-left text-xs text-muted flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            You can complete the escrow deposit at any time. If you changed your mind or need to discuss project scope with the artisan, you can do so through your dashboard.
          </p>
        </div>

        {/* BUTTONS */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          {bookingId ? (
            <Link
              href={`/account/bookings/${bookingId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-7 py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Escrow Payment</span>
            </Link>
          ) : (
            <Link
              href="/account/bookings"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-7 py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Go to My Bookings</span>
            </Link>
          )}

          <Link
            href="/account"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-white px-6 py-3 text-xs sm:text-sm font-semibold text-muted hover:text-title hover:border-title transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

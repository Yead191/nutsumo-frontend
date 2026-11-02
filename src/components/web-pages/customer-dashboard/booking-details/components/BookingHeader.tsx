import Link from "next/link";
import { ArrowLeft, CalendarCheck, ShieldCheck, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import type { IBookingItem } from "@/helpers/next-fetch/apiActions/bookingActions";

interface BookingHeaderProps {
  booking: IBookingItem;
}

export function BookingHeader({ booking }: BookingHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.bookingNumber);
    setCopied(true);
    toast.success("Booking reference copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const bookingDateFormatted = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-3 border-b border-line/70 pb-5">
      <div>
        <Link
          href="/account/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#FE375D] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Bookings</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-title tracking-tight">
              Booking #{booking.bookingNumber}
            </h1>

            <button
              type="button"
              onClick={handleCopy}
              className="grid h-7 w-7 place-items-center rounded-lg border border-line bg-white text-muted hover:border-[#FE375D] hover:text-[#FE375D] transition-colors cursor-pointer"
              title="Copy booking reference"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Confirmed on {bookingDateFormatted} · Guaranteed under Nutsumo Assurance
          </p>
        </div>

        {/* STATUS PILLS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Payment Status */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider",
              booking.paymentStatus === "ESCROW_HELD"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : booking.paymentStatus === "PAID"
                  ? "bg-teal-50 text-teal-700 border-teal-200"
                  : "bg-amber-50 text-amber-700 border-amber-200",
            )}
          >
            {booking.paymentStatus === "ESCROW_HELD" ? "Escrow Held 🔒" : booking.paymentStatus}
          </span>

          {/* Booking Status */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border",
              booking.status === "AWAITING_PAYMENT"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : booking.status === "CONFIRMED"
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : booking.status === "IN_PROGRESS"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : booking.status === "DELIVERED"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : booking.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                booking.status === "IN_PROGRESS" || booking.status === "AWAITING_PAYMENT"
                  ? "animate-pulse"
                  : "",
                booking.status === "AWAITING_PAYMENT"
                  ? "bg-amber-500"
                  : booking.status === "CONFIRMED"
                    ? "bg-blue-500"
                    : booking.status === "IN_PROGRESS"
                      ? "bg-indigo-500"
                      : booking.status === "DELIVERED"
                        ? "bg-purple-500"
                        : "bg-emerald-500",
              )}
            />
            <span>{booking.status.replace(/_/g, " ")}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

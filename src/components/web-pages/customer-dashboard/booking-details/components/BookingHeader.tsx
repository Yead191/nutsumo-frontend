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
        <div className="flex items-center gap-2">
          {/* Payment Status */}
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider",
              booking.paymentStatus === "PAID"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200",
            )}
          >
            {booking.paymentStatus}
          </span>

          {/* Booking Status */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3.5 py-1 text-xs font-bold border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{booking.status}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

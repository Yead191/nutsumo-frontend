import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  ShieldCheck,
  Phone,
  MessageSquare,
  ArrowRight,
  Clock,
  DollarSign,
  FileText,
  CalendarCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { getImageUrl } from "@/lib/getImageUrl";
import type { IBookingItem, BookingStatus } from "@/helpers/next-fetch/apiActions/bookingActions";

interface BookingCardProps {
  booking: IBookingItem;
}

function getBookingStatusBadge(status: BookingStatus) {
  switch (status) {
    case "CONFIRMED":
      return {
        label: "Confirmed",
        dotColor: "bg-emerald-500",
        classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        dotColor: "bg-amber-500",
        classes: "bg-amber-50 text-amber-700 border-amber-200",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        dotColor: "bg-teal-500",
        classes: "bg-teal-50 text-teal-700 border-teal-200",
      };
    case "CANCELLED":
      return {
        label: "Cancelled",
        dotColor: "bg-slate-400",
        classes: "bg-slate-100 text-slate-600 border-slate-200",
      };
    default:
      return {
        label: status,
        dotColor: "bg-slate-400",
        classes: "bg-slate-100 text-slate-700 border-slate-200",
      };
  }
}

export function BookingCard({ booking }: BookingCardProps) {
  const statusBadge = getBookingStatusBadge(booking.status);
  const artisan = booking.artisan;
  const avatarUrl = artisan?.image ? getImageUrl(artisan.image) : null;

  const scheduledDateFormatted = booking.job?.preferredDate
    ? new Date(booking.job.preferredDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Flexible";

  const bookingDateFormatted = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="group rounded-3xl border border-line/80 bg-white p-5 sm:p-6 shadow-2xs hover:border-[#FE375D]/40 hover:shadow-md transition-all duration-300">
      {/* HEADER: Booking # & Status Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-line/60 mb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-muted bg-smoke px-3 py-1 rounded-full border border-line">
            #{booking.bookingNumber}
          </span>
          <span className="text-[11px] text-muted">Booked on {bookingDateFormatted}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Payment Status Pill */}
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-wider",
              booking.paymentStatus === "PAID"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200",
            )}
          >
            {booking.paymentStatus}
          </span>

          {/* Booking Status Pill */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border",
              statusBadge.classes,
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", statusBadge.dotColor)} />
            <span>{statusBadge.label}</span>
          </span>
        </div>
      </div>

      {/* BODY: Job info + Artisan info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        {/* LEFT: JOB DETAILS */}
        <div>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
            Job Details
          </span>
          <h3 className="font-display text-base sm:text-lg font-bold text-title mt-0.5 line-clamp-1">
            {booking.job?.title || "Home Repair Service"}
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-muted">
            {booking.job?.location && (
              <span className="flex items-center gap-1.5 text-title font-medium">
                <MapPin className="h-3.5 w-3.5 text-[#FE375D] shrink-0" />
                <span className="truncate">{booking.job.location}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Target: {scheduledDateFormatted}</span>
            </span>
          </div>
        </div>

        {/* RIGHT: HIRED ARTISAN CONTACT */}
        <div className="rounded-2xl bg-smoke/60 p-4 border border-line/60">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-line bg-white shadow-2xs">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={artisan?.name || "Artisan"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-slate-100 text-sm font-bold text-title">
                  {artisan?.name?.charAt(0) || "P"}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display text-sm font-bold text-title truncate">
                  {artisan?.name}
                </h4>
                {artisan?.verified && (
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted truncate">
                {artisan?.phone || artisan?.email || "Hired Professional"}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-line/60 flex items-center justify-between text-xs">
            <span className="text-muted font-medium">Contract Rate:</span>
            <span className="font-display font-bold text-base text-[#FE375D]">
              GH₵ {booking.totalAmount}{" "}
              <span className="text-xs font-normal text-muted">({booking.rateType})</span>
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="mt-5 pt-4 border-t border-line/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {artisan?.phone && (
            <a
              href={`tel:${artisan.phone}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-title hover:border-emerald-500 hover:text-emerald-700 transition-colors shadow-2xs"
            >
              <Phone className="h-3.5 w-3.5 text-emerald-600" />
              <span>Call Pro</span>
            </a>
          )}

          <Link
            href={`/account/messages?recipient=${artisan?._id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-title hover:border-[#FE375D] hover:text-[#FE375D] transition-colors shadow-2xs"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#FE375D]" />
            <span>Chat</span>
          </Link>
        </div>

        <Link
          href={`/account/bookings/${booking._id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-title hover:bg-[#FE375D] text-white px-5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-xs group-hover:scale-[1.02]"
        >
          <span>View Booking Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

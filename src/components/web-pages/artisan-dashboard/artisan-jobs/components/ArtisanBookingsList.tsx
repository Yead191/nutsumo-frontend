"use client";

import Link from "next/link";
import {
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Receipt,
  Clock,
  Briefcase,
} from "lucide-react";
import type { IBookingItem } from "../types";

interface ArtisanBookingsListProps {
  bookings: IBookingItem[];
}

export function ArtisanBookingsList({ bookings }: ArtisanBookingsListProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-smoke/40 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 mb-4">
          <Briefcase className="h-7 w-7" />
        </div>
        <h3 className="font-display text-lg font-bold text-title">
          No active contracts yet
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted max-w-md mx-auto">
          When clients accept your quotations, your active contracts and schedules will appear right here with full client contact and payment protection.
        </p>
        <Link
          href="/jobs"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
        >
          <span>Browse Available Jobs &rarr;</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const jobTitle = booking.job?.title || "Contract Service";
        const location = booking.job?.location || "Accra, Ghana";
        const clientName = booking.customer?.name || "Verified Client";
        const clientPhone = booking.customer?.phone;
        const clientEmail = booking.customer?.email;

        const scheduledDate = booking.startDate
          ? new Date(booking.startDate).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : booking.job?.preferredDate
            ? new Date(booking.job.preferredDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "To be coordinated";

        return (
          <div
            key={booking._id}
            className="rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-xs hover:border-[#FE375D]/40 transition-all space-y-4"
          >
            {/* TOP ROW */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted">
                  #{booking.bookingNumber || booking._id.slice(-8).toUpperCase()}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    booking.status === "COMPLETED"
                      ? "bg-blue-50 text-blue-700"
                      : booking.status === "IN_PROGRESS"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span>{booking.status}</span>
                </span>
              </div>

              <div className="font-display text-lg font-bold text-[#FE375D]">
                GH₵{booking.totalAmount?.toLocaleString()}
                <span className="text-[10px] text-muted font-normal ml-1">
                  ({booking.rateType || "FIXED"})
                </span>
              </div>
            </div>

            {/* TITLE & CLIENT DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-display text-base font-bold text-title">
                  {jobTitle}
                </h4>

                <div className="mt-2 space-y-1 text-xs text-muted">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted shrink-0" />
                    <span>{location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted shrink-0" />
                    <span>Schedule: {scheduledDate}</span>
                  </div>
                </div>
              </div>

              {/* CLIENT CONTACT CARD */}
              <div className="rounded-2xl bg-smoke/70 p-3.5 border border-line/70 text-xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                  Client Contact
                </span>
                <div className="flex items-center gap-2 font-bold text-title">
                  <User className="h-3.5 w-3.5 text-muted" />
                  <span>{clientName}</span>
                </div>
                {clientPhone ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="h-3.5 w-3.5 text-muted" />
                    <a href={`tel:${clientPhone}`} className="hover:text-[#FE375D]">
                      {clientPhone}
                    </a>
                  </div>
                ) : null}
                {clientEmail ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="h-3.5 w-3.5 text-muted" />
                    <a href={`mailto:${clientEmail}`} className="hover:text-[#FE375D]">
                      {clientEmail}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-muted">
                Payment Status:{" "}
                <strong className="text-title font-semibold">
                  {booking.paymentStatus || "ESCROW HELD"}
                </strong>
              </span>

              {booking.job?._id ? (
                <Link
                  href={`/pro/jobs/${booking.job._id}`}
                  className="inline-flex items-center gap-1 font-bold text-[#FE375D] hover:underline"
                >
                  <span>View Contract Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

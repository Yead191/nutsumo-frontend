import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  FileText,
} from "lucide-react";
import type { IBookingItem } from "@/helpers/next-fetch/apiActions/bookingActions";

interface BookingContractCardProps {
  booking: IBookingItem;
}

export function BookingContractCard({ booking }: BookingContractCardProps) {
  const job = booking.job;
  const quote = booking.quotation;

  const scheduledDateFormatted = job?.preferredDate
    ? new Date(job.preferredDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Flexible / To Be Coordinated";

  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-2xs space-y-6">
      {/* 1. CONTRACT FINANCIALS */}
      <div>
        <h3 className="font-display text-sm font-bold text-title mb-3">
          Agreed Pricing & Terms
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl border border-line bg-smoke/70 p-3.5">
            <span className="text-[11px] text-muted block">Total Agreed Rate</span>
            <span className="font-display text-xl font-bold text-[#FE375D] mt-0.5 block">
              GH₵ {booking.totalAmount}
            </span>
            <span className="text-[10px] text-muted uppercase font-semibold">
              ({booking.rateType} Pricing)
            </span>
          </div>

          <div className="rounded-2xl border border-line bg-smoke/70 p-3.5">
            <span className="text-[11px] text-muted block">Payment Status</span>
            <span className="font-display text-base font-bold text-title mt-0.5 block uppercase">
              {booking.paymentStatus}
            </span>
            <span className="text-[10px] text-muted">Pay after service completion</span>
          </div>

          {quote?.estimatedDuration && (
            <div className="rounded-2xl border border-line bg-smoke/70 p-3.5">
              <span className="text-[11px] text-muted block">Estimated Time</span>
              <span className="font-display text-base font-bold text-title mt-0.5 block">
                {quote.estimatedDuration}
              </span>
              <span className="text-[10px] text-muted">Estimated completion window</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. JOB DETAILS & LOCATION */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-bold text-title">
            Service Scope & Location
          </h3>
          {job?._id && (
            <Link
              href={`/account/jobs/${job._id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#FE375D] hover:underline"
            >
              <span>View Original Request</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-smoke/50 p-4 space-y-3">
          <div>
            <h4 className="font-display text-sm font-bold text-title">
              {job?.title || "Home Repair Project"}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-line/60 text-xs">
            {job?.location && (
              <span className="flex items-center gap-1.5 text-title font-medium">
                <MapPin className="h-3.5 w-3.5 text-[#FE375D] shrink-0" />
                <span>{job.location}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 text-title font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>Target Schedule: {scheduledDateFormatted}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. PROPOSAL MESSAGE */}
      {quote?.message && (
        <div>
          <h3 className="font-display text-sm font-bold text-title mb-2">
            Artisan&apos;s Accepted Proposal Note
          </h3>
          <div className="rounded-2xl bg-smoke/60 p-4 border border-line/60">
            <p className="text-xs sm:text-sm text-copy italic leading-relaxed">
              &ldquo;{quote.message}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* 4. NUTSUMO GUARANTEE BANNER */}
      <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 space-y-1">
          <strong className="block font-bold">Nutsumo Direct Work Assurance:</strong>
          <p className="text-slate-600 leading-relaxed">
            All work is protected under our verified craftsmanship guarantee. If you have any inquiries, schedule adjustments, or need support, contact our 24/7 resolution desk.
          </p>
        </div>
      </div>
    </div>
  );
}

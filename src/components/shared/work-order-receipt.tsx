"use client";

import {
  CheckCircle2,
  Clock,
  MapPin,
  Printer,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Booking, ChangeRequest, Job, JobCompletion, Professional } from "@/types";

interface WorkOrderReceiptProps {
  job: Job;
  booking?: Booking;
  pro?: Professional | null;
  completion?: JobCompletion;
  changeRequests?: ChangeRequest[];
  onClose?: () => void;
}

export function WorkOrderReceipt({
  job,
  booking,
  pro,
  completion,
  changeRequests = [],
  onClose,
}: WorkOrderReceiptProps) {
  const receiptNumber =
    booking?.paymentReceiptNumber ||
    completion?.receiptNumber ||
    `LHF-REC-${job.id.replace(/\D/g, "").slice(-6) || "842911"}`;

  const paymentMethod =
    booking?.paymentMethod || completion?.paymentMethod || "zelle";

  const paymentLabels: Record<string, string> = {
    zelle: "Zelle (Direct Bank Transfer)",
    card: "Credit / Debit Card (Square/Stripe)",
    cash: "Cash Settlement",
    check: "Personal / Bank Check",
    bank_transfer: "Direct ACH / Bank Transfer",
  };

  const basePrice = booking?.agreedPrice ?? 150;
  const approvedChanges = changeRequests.filter((cr) => cr.status === "approved");
  const changeTotal = approvedChanges.reduce((sum, cr) => sum + cr.amount, 0);
  const finalTotal = basePrice; // note: in marketplaceSlice, approved changeRequests are already added to booking.agreedPrice!

  const serviceDate = booking?.scheduledDate || completion?.proMarkedAt?.slice(0, 10) || job.postedAt;
  const arrivalWindow = booking?.arrivalWindow || booking?.scheduledTime || "10:00 AM – 12:00 PM";

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[24px] border border-line/80 bg-white p-6 sm:p-8 shadow-2xl">
        {/* Close Button */}
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-smoke text-muted hover:bg-stone-200 hover:text-title transition"
            aria-label="Close receipt"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}

        {/* Receipt Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line/80 pb-6 pr-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white font-display text-xs font-bold">
                LH
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-title">
                LocalHomeFix
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Paid &amp; Completed
              </span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl font-bold text-title">
              Itemized Work Order &amp; Receipt
            </h1>
            <p className="text-xs text-muted">
              Official job completion record · Direct contractor settlement ($0 platform fee)
            </p>
          </div>

          <div className="text-right">
            <p className="font-mono text-xs font-bold text-title">
              Receipt #{receiptNumber}
            </p>
            <p className="text-xs text-muted">Date: {serviceDate}</p>
          </div>
        </div>

        {/* Contractor & Customer Two-Column Details */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 rounded-[18px] bg-smoke/60 p-5 border border-line/60">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Service Professional
            </p>
            <p className="mt-1 font-display text-base font-bold text-title">
              {pro?.name ?? "Professional Contractor"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {pro?.trade ?? "Home Specialist"}{pro?.city ? ` · ${pro.city}${pro?.state ? `, ${pro.state}` : ""}` : ""}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Background-Checked &amp; Verified Pro
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Homeowner &amp; Service Location
            </p>
            <p className="mt-1 font-display text-base font-bold text-title">
              {job.homeownerName}
            </p>
            <p className="mt-1 text-xs text-copy flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted shrink-0" />
              {job.city}, {job.state} {job.zip}
            </p>
            <p className="mt-1 text-xs text-muted flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted shrink-0" />
              Arrival Window: {arrivalWindow}
            </p>
          </div>
        </div>

        {/* Project Scope Description */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Job Scope &amp; Deliverables
          </p>
          <div className="mt-2 rounded-[14px] border border-line/70 bg-white p-4">
            <p className="font-display text-sm font-bold text-title">{job.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-copy">
              {booking?.scopeSnapshot || job.description}
            </p>
            {completion?.completionNotes ? (
              <div className="mt-3 border-t border-line/60 pt-2.5">
                <p className="text-[11px] font-semibold text-primary">
                  Pro Completion Note:
                </p>
                <p className="text-xs text-copy italic">
                  &ldquo;{completion.completionNotes}&rdquo;
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Itemized Price Table */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted">
            Itemized Settlement Breakdown
          </p>
          <div className="mt-2 overflow-hidden rounded-[14px] border border-line/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-smoke/80 font-semibold text-title border-b border-line/70">
                <tr>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4 text-center">Type</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                <tr>
                  <td className="py-3 px-4 font-medium text-title">
                    Base Agreed Contract Scope
                    <span className="block text-[11px] text-muted">
                      Diagnostic, Labor, and Service execution
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-muted">Original</td>
                  <td className="py-3 px-4 text-right font-semibold text-title">
                    ${changeTotal > 0 ? basePrice - changeTotal : basePrice}
                  </td>
                </tr>

                {approvedChanges.map((cr) => (
                  <tr key={cr.id} className="bg-amber-50/40">
                    <td className="py-3 px-4 text-copy">
                      <span className="font-medium text-title">
                        Change Order: {cr.reason}
                      </span>
                      <span className="block text-[11px] text-amber-700">
                        Approved by homeowner on-site
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-amber-800 font-medium">
                      Add-on
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-title">
                      +${cr.amount}
                    </td>
                  </tr>
                ))}

                <tr className="bg-emerald-50/40">
                  <td className="py-3 px-4">
                    <span className="font-medium text-emerald-800">
                      LocalHomeFix Platform Fee
                    </span>
                    <span className="block text-[11px] text-emerald-700">
                      Direct contractor model — $0 middleman fee
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-semibold">
                    $0 Markup
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                    $0.00
                  </td>
                </tr>
              </tbody>
              <tfoot className="border-t-2 border-line bg-smoke/80 font-bold text-title">
                <tr>
                  <td className="py-3.5 px-4 text-sm" colSpan={2}>
                    Total Direct Settlement
                  </td>
                  <td className="py-3.5 px-4 text-right text-base font-display text-title">
                    ${finalTotal}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Payment Method & Protection Banner */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-[12px] border border-line bg-smoke/50 p-3">
            <span className="text-[11px] font-bold uppercase text-muted">
              Settlement Method
            </span>
            <p className="mt-0.5 font-semibold text-title">
              {paymentLabels[paymentMethod] || paymentMethod}
            </p>
            <p className="text-[11px] text-muted">
              Paid directly to contractor upon inspection
            </p>
          </div>

          <div className="rounded-[12px] border border-emerald-200 bg-emerald-50/60 p-3 flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">
                $1,000 Peace of Mind Guarantee
              </p>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Backed by LocalHomeFix Workmanship &amp; Property Protection.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions: Print / PDF & Close */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line/80 pt-5">
          <p className="text-[11px] text-muted">
            Keep this receipt for home maintenance records and tax filings.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 font-semibold"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </Button>
            {onClose ? (
              <Button type="button" size="sm" onClick={onClose} className="rounded-full">
                Close
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

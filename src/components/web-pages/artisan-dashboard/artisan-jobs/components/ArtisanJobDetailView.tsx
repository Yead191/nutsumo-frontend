"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Send,
  ShieldCheck,
  Tag,
  Wrench,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Phone,
  Mail,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  submitQuotationAction,
  withdrawQuotationAction,
} from "@/helpers/next-fetch/apiActions/quotationActions";
import type {
  RateType,
  IQuotationItem,
} from "@/helpers/next-fetch/apiActions/quotationActions";
import type { IBookingItem } from "@/helpers/next-fetch/apiActions/bookingActions";
import type { IJobItem } from "../types";

interface ArtisanJobDetailViewProps {
  job: IJobItem;
  existingQuotation?: IQuotationItem | null;
  booking?: IBookingItem | null;
}

export function ArtisanJobDetailView({
  job,
  existingQuotation,
  booking,
}: ArtisanJobDetailViewProps) {
  const router = useRouter();

  // Quotation form state
  const [proposedAmount, setProposedAmount] = useState<string>(
    job.budget ? String(job.budget) : "",
  );
  const [rateType, setRateType] = useState<RateType>("FIXED");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const categoryName =
    typeof job.category === "object" && job.category ? job.category.name : "";
  const serviceName =
    typeof job.service === "object" && job.service
      ? job.service.name
      : job.customServiceName || "";

  const formattedDate = job.preferredDate
    ? new Date(job.preferredDate).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Flexible timeline";

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = Number(proposedAmount);
    if (!proposedAmount || Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid quotation amount in GH₵");
      return;
    }

    if (!message.trim() || message.trim().length < 15) {
      toast.error(
        "Please explain your quote and approach (at least 15 characters)",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitQuotationAction({
        job: job._id,
        proposedAmount: amountNum,
        rateType,
        estimatedDuration: estimatedDuration.trim() || undefined,
        message: message.trim(),
      });

      if (res.success) {
        toast.success("Proposal submitted successfully to client!");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to submit proposal.");
      }
    } catch {
      toast.error("An error occurred while submitting proposal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async (quotationId: string) => {
    if (!confirm("Are you sure you want to withdraw your proposal?")) return;

    setIsWithdrawing(true);
    try {
      const res = await withdrawQuotationAction(quotationId, job._id);
      if (res.success) {
        toast.success("Proposal withdrawn successfully.");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to withdraw proposal.");
      }
    } catch {
      toast.error("An error occurred while withdrawing proposal.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* TOP NAV */}
      <div className="border-b border-line/70 pb-4">
        <Link
          href="/pro/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-[#FE375D] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Jobs & Proposals</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT TWO COLUMNS: JOB DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          {/* HEADER CARD */}
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  job.status === "OPEN"
                    ? "bg-emerald-50 text-emerald-700"
                    : job.status === "BOOKED"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-700"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                <span>
                  {job.status === "OPEN" ? "Open for Proposals" : job.status}
                </span>
              </span>

              {categoryName ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  <Tag className="h-3 w-3 text-slate-500" />
                  <span>{categoryName}</span>
                </span>
              ) : null}

              {serviceName ? (
                <span className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-[#FE375D]">
                  {serviceName}
                </span>
              ) : null}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-title tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted border-t border-line/70 pt-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <MapPin className="h-4 w-4 text-[#FE375D] shrink-0" />
                <span>
                  {job.location} {job.postCode ? `(${job.postCode})` : ""}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted shrink-0" />
                <span>Required: {formattedDate}</span>
              </div>

              {job.createdAt ? (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-muted shrink-0" />
                  <span>
                    Posted{" "}
                    {new Date(job.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* PHOTOS GALLERY (IF AVAILABLE) */}
          {job.images && job.images.length > 0 ? (
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="font-display text-base font-bold text-title">
                Job Attachments ({job.images.length})
              </h2>

              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-line">
                <Image
                  src={job.images[selectedImageIndex] || job.images[0]}
                  alt="Job photo"
                  fill
                  className="object-cover"
                />
              </div>

              {job.images.length > 1 ? (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {job.images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-16 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-[#FE375D] ring-2 ring-[#FE375D]/30"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* SCOPE & DESCRIPTION */}
          <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-display text-lg font-bold text-title">
              Client Request Scope
            </h2>
            <div className="prose prose-sm max-w-none text-copy whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUOTATION & BOOKING STATUS */}
        <div className="space-y-6">
          {/* CONFIRMED CONTRACT CARD (IF BOOKED WITH THIS ARTISAN) */}
          {booking ? (
            <div className="rounded-3xl border-2 border-emerald-500/30 bg-emerald-50/40 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>You are Hired for this Job!</span>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-emerald-200/60 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted">Contract Total:</span>
                  <strong className="font-display text-sm text-[#FE375D]">
                    GH₵{booking.totalAmount?.toLocaleString()}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Booking Reference:</span>
                  <span className="font-mono font-semibold text-title">
                    #
                    {booking.bookingNumber ||
                      booking._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payment Security:</span>
                  <span className="font-semibold text-emerald-700">
                    {booking.paymentStatus || "ESCROW HELD"}
                  </span>
                </div>
              </div>

              {/* CLIENT CONTACT INFO */}
              <div className="rounded-2xl bg-white p-4 border border-emerald-200/60 text-xs space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted block">
                  Client Direct Contact
                </span>
                <div className="flex items-center gap-2 font-bold text-title">
                  <User className="h-4 w-4 text-muted" />
                  <span>{booking.customer?.name || "Client"}</span>
                </div>
                {booking.customer?.phone ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="h-4 w-4 text-muted" />
                    <a
                      href={`tel:${booking.customer.phone}`}
                      className="hover:text-[#FE375D]"
                    >
                      {booking.customer.phone}
                    </a>
                  </div>
                ) : null}
                {booking.customer?.email ? (
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="h-4 w-4 text-muted" />
                    <a
                      href={`mailto:${booking.customer.email}`}
                      className="hover:text-[#FE375D]"
                    >
                      {booking.customer.email}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* EXISTING PROPOSAL CARD */}
          {existingQuotation ? (
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-line/70 pb-3">
                <span className="font-display text-sm font-bold text-title">
                  Your Submitted Proposal
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    existingQuotation.status === "ACCEPTED"
                      ? "bg-emerald-50 text-emerald-700"
                      : existingQuotation.status === "PENDING"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span>{existingQuotation.status}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-muted block">
                  Proposed Amount
                </span>
                <div className="font-display text-2xl font-bold text-[#FE375D] mt-0.5">
                  GH₵{existingQuotation.proposedAmount?.toLocaleString()}
                  <span className="text-xs font-normal text-muted ml-1">
                    ({existingQuotation.rateType})
                  </span>
                </div>
              </div>

              {existingQuotation.estimatedDuration ? (
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Clock className="h-4 w-4 text-muted" />
                  <span>
                    Turnaround:{" "}
                    <strong>{existingQuotation.estimatedDuration}</strong>
                  </span>
                </div>
              ) : null}

              <div className="rounded-2xl bg-smoke/60 p-3.5 border border-line/60 text-xs text-copy leading-relaxed whitespace-pre-line">
                {existingQuotation.message}
              </div>

              {existingQuotation.status === "PENDING" ? (
                <button
                  type="button"
                  disabled={isWithdrawing}
                  onClick={() => handleWithdraw(existingQuotation._id)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 py-2.5 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Withdrawing Proposal...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Withdraw This Proposal</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>
          ) : null}

          {/* NEW PROPOSAL FORM (IF NO PROPOSAL YET & JOB IS OPEN) */}
          {!existingQuotation && !booking && job.status === "OPEN" ? (
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-7 shadow-lg space-y-4">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                  Client Target Budget
                </span>
                <div className="font-display text-3xl font-black text-[#FE375D] mt-0.5">
                  GH₵{job.budget?.toLocaleString() || "Open / Quote"}
                </div>
              </div>

              <form
                onSubmit={handleSubmitProposal}
                className="space-y-3.5 pt-2 border-t border-line"
              >
                <div>
                  <label className="block text-xs font-semibold text-title mb-1">
                    Your Proposed Price (GH₵){" "}
                    <span className="text-[#FE375D]">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-display text-xs font-bold text-muted">
                      GH₵
                    </span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={proposedAmount}
                      onChange={(e) => setProposedAmount(e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full rounded-xl border border-line bg-white pl-12 pr-3 py-2 text-xs sm:text-sm font-bold text-title  focus:outline-none focus:ring-1 focus:ring-[#FE375D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-title mb-1">
                    Pricing Rate Type
                  </label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as RateType)}
                    className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs text-title  focus:outline-none focus:ring-1 focus:ring-[#FE375D]"
                  >
                    <option value="FIXED">Fixed Total Price</option>
                    <option value="HOURLY">Hourly Rate</option>
                    <option value="DAILY">Daily Rate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-title mb-1">
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="e.g. 2 hours, 1 day"
                    className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-title mb-1">
                    Proposal Pitch & Details{" "}
                    <span className="text-[#FE375D]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain your approach, tools included, and relevant experience..."
                    className="w-full rounded-xl border border-line bg-white p-3 text-xs text-title placeholder:text-muted focus:border-[#FE375D] focus:outline-none focus:ring-1 focus:ring-[#FE375D] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FE375D] hover:bg-[#e0284e] text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Proposal</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : null}

          {/* SAFETY GUARANTEE */}
          <div className="rounded-3xl border border-line bg-smoke/60 p-5 text-xs text-muted space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-title">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>0% Commission Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Nutsumo does not deduct commission fees from your submitted
              proposal amount. What you quote is what you receive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

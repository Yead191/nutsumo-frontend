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
  PackageCheck,
  Lock,
  Edit3,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";
import {
  submitQuotationAction,
  updateQuotationAction,
  withdrawQuotationAction,
} from "@/helpers/next-fetch/apiActions/quotationActions";
import type {
  RateType,
  IQuotationItem,
} from "@/helpers/next-fetch/apiActions/quotationActions";
import {
  startBookingWorkAction,
  type IBookingItem,
} from "@/helpers/next-fetch/apiActions/bookingActions";
import { DeliverWorkModal } from "./DeliverWorkModal";
import { WithdrawProposalModal } from "./WithdrawProposalModal";
import type { IJobItem } from "../types";
import { getImageUrl } from "@/lib/getImageUrl";
import { calculateFeeBreakdown, TAX_RATES } from "@/lib/taxCalculator";
import { ImageLightboxModal } from "@/components/shared/ImageLightboxModal";

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
  const [isStartingWork, setIsStartingWork] = useState(false);
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isJobLightboxOpen, setIsJobLightboxOpen] = useState(false);
  const [isDeliveryLightboxOpen, setIsDeliveryLightboxOpen] = useState(false);
  const [deliveryLightboxIndex, setDeliveryLightboxIndex] = useState(0);

  // Proposal Edit & Withdraw state
  const [isEditingProposal, setIsEditingProposal] = useState(false);
  const [isUpdatingProposal, setIsUpdatingProposal] = useState(false);
  const [editAmount, setEditAmount] = useState<string>("");
  const [editRateType, setEditRateType] = useState<RateType>("FIXED");
  const [editDuration, setEditDuration] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const handleOpenEdit = () => {
    if (!existingQuotation) return;
    setEditAmount(String(existingQuotation.proposedAmount));
    setEditRateType(existingQuotation.rateType);
    setEditDuration(existingQuotation.estimatedDuration || "");
    setEditMessage(existingQuotation.message || "");
    setIsEditingProposal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!existingQuotation) return;

    const amountNum = Number(editAmount);
    if (!editAmount || Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid quotation amount in GH₵");
      return;
    }

    if (!editMessage.trim() || editMessage.trim().length < 10) {
      toast.error("Please enter a proposal message of at least 10 characters");
      return;
    }

    setIsUpdatingProposal(true);
    try {
      const res = await updateQuotationAction(
        existingQuotation._id,
        {
          proposedAmount: amountNum,
          rateType: editRateType,
          estimatedDuration: editDuration.trim() || undefined,
          message: editMessage.trim(),
        },
        job._id,
      );

      if (res.success) {
        toast.success("Proposal updated successfully! 🎉");
        setIsEditingProposal(false);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update proposal");
      }
    } catch {
      toast.error("An error occurred while updating proposal");
    } finally {
      setIsUpdatingProposal(false);
    }
  };

  const handleStartWork = async (bookingId: string) => {
    setIsStartingWork(true);
    try {
      const res = await startBookingWorkAction(bookingId);
      if (res.success) {
        toast.success("Work started! Status updated to IN_PROGRESS 🔨");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to start work");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsStartingWork(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* TOP NAV */}
      <div className="border-b border-line/70 pb-4">
        <Link
          href="/pro/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-primary transition-colors"
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
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {serviceName}
                </span>
              ) : null}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-title tracking-tight">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-muted border-t border-line/70 pt-3">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
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

              <div
                onClick={() => setIsJobLightboxOpen(true)}
                className="group relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-line cursor-pointer"
                title="Click to view full screen"
              >
                <Image
                  src={
                    getImageUrl(
                      job.images[selectedImageIndex] || job.images[0],
                    ) || ""
                  }
                  alt="Job photo"
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <div className="flex items-center gap-1.5 bg-black/60 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-xs shadow-md">
                    <Maximize2 className="h-4 w-4" />
                    <span>View Fullscreen</span>
                  </div>
                </div>
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
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={getImageUrl(img) || ""}
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
              <div className="flex items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>You are Hired for this Job!</span>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    booking.status === "AWAITING_PAYMENT"
                      ? "bg-amber-100 text-amber-800"
                      : booking.status === "CONFIRMED"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "IN_PROGRESS"
                          ? "bg-indigo-100 text-indigo-800"
                          : booking.status === "DELIVERED"
                            ? "bg-purple-100 text-purple-800"
                            : booking.status === "REVISION_REQUESTED"
                              ? "bg-amber-100 text-amber-800"
                              : booking.status === "DISPUTED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {booking.status === "AWAITING_PAYMENT"
                    ? "Deposit Pending"
                    : booking.status.replace(/_/g, " ")}
                </span>
              </div>

              {/* FINANCIAL BREAKDOWN & STATUTORY DEDUCTION SUMMARY */}
              {(() => {
                const bookingGross = booking.totalAmount || 0;
                const bookingFees = calculateFeeBreakdown(bookingGross);
                const vatAmount = booking.vatAmount ?? bookingFees.vatAmount;
                const nhilAmount = booking.nhilAmount ?? bookingFees.nhilAmount;
                const getFundAmount = booking.getFundLevyAmount ?? bookingFees.getFundLevyAmount;
                const totalDeductions = booking.platformFee ?? bookingFees.totalDeductions;
                const netPayout = booking.artisanPayoutAmount ?? bookingFees.netPayoutAmount;

                return (
                  <div className="rounded-2xl bg-white p-4 border border-emerald-200/60 text-xs space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-line/60">
                      <span className="font-bold text-title uppercase tracking-wider text-[11px]">
                        Financial Summary & Escrow
                      </span>
                      <span className="font-semibold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {booking.paymentStatus === "ESCROW_HELD" ? "Escrow Protected 🔒" : booking.paymentStatus || "UNPAID"}
                      </span>
                    </div>

                    {/* Transparent Breakdown Table */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-copy">
                        <span className="text-muted">Gross Booking Amount:</span>
                        <strong className="font-display text-sm text-primary">
                          GH₵{bookingGross.toFixed(2)}
                        </strong>
                      </div>
                      <div className="flex justify-between text-muted text-[11px]">
                        <span>VAT (15%):</span>
                        <span className="text-rose-600 font-medium">-GH₵{vatAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted text-[11px]">
                        <span>NHIL (2.5%):</span>
                        <span className="text-rose-600 font-medium">-GH₵{nhilAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted text-[11px]">
                        <span>GETFund Levy (2.5%):</span>
                        <span className="text-rose-600 font-medium">-GH₵{getFundAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-copy pt-1 border-t border-dashed border-line/70 font-semibold text-[11px]">
                        <span>Total Deductions (20%):</span>
                        <span className="text-rose-600 font-bold">-GH₵{totalDeductions.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-line/60 bg-emerald-50/70 -mx-4 -mb-1 px-4 py-2 rounded-xl">
                        <span className="text-emerald-950 font-bold">Net Artisan Payout (80%):</span>
                        <strong className="font-display text-sm text-emerald-700 font-black">
                          GH₵{netPayout.toFixed(2)}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-line/60 flex justify-between text-muted text-[11px]">
                      <span>Booking Reference:</span>
                      <span className="font-mono font-semibold text-title">
                        #{booking.bookingNumber || booking._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* ESCROW STAGE NOTICE & INTERACTIVE ACTIONS */}
              {booking.status === "AWAITING_PAYMENT" ? (
                <div className="rounded-2xl bg-amber-50 p-3.5 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <Lock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Awaiting Client Escrow Deposit:</strong> The client
                    has accepted your quote. Please wait until they complete the
                    deposit on Stripe before beginning work.
                  </p>
                </div>
              ) : booking.status === "CONFIRMED" ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-blue-50 p-3.5 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Escrow Deposit Secured!</strong> Funds are held in
                      platform escrow. You may now commence work on site.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isStartingWork}
                    onClick={() => handleStartWork(booking._id)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                  >
                    {isStartingWork ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Starting Work...</span>
                      </>
                    ) : (
                      <span>Start Work (Begin Execution)</span>
                    )}
                  </button>
                </div>
              ) : booking.status === "IN_PROGRESS" ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-indigo-50 p-3.5 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
                    <Wrench className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Job in Progress:</strong> You have active
                      execution underway. When finished, submit your delivery
                      notes and photo proof.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDeliverModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <PackageCheck className="h-4 w-4" />
                    <span>Deliver Completed Work</span>
                  </button>
                </div>
              ) : booking.status === "DELIVERED" ? (
                <div className="rounded-2xl bg-purple-50 p-3.5 border border-purple-200 text-xs text-purple-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <PackageCheck className="h-4 w-4 text-purple-600" />
                    <span>Work Delivered!</span>
                  </div>
                  <p className="leading-relaxed text-slate-600">
                    Your delivery notes have been submitted. The client has been
                    prompted to inspect the work and approve escrow
                    disbursement.
                  </p>
                  {booking.deliveryNotes && (
                    <div className="rounded-xl bg-white p-2.5 text-xs text-copy italic border border-purple-100">
                      &ldquo;{booking.deliveryNotes}&rdquo;
                    </div>
                  )}
                  {booking.deliveryProof &&
                    booking.deliveryProof.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-purple-200/60">
                        <span className="text-[10px] font-bold uppercase text-purple-900 block tracking-wider">
                          Submitted Proof Photos ({booking.deliveryProof.length}
                          )
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {booking.deliveryProof.map((img, idx) => (
                            <button
                              key={img}
                              type="button"
                              onClick={() => {
                                setDeliveryLightboxIndex(idx);
                                setIsDeliveryLightboxOpen(true);
                              }}
                              className="relative h-14 w-18 rounded-xl overflow-hidden border border-purple-200 bg-white group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                </div>
              ) : booking.status === "REVISION_REQUESTED" ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-950 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <span>Revisions Requested by Client</span>
                    </div>
                    <p className="leading-relaxed">
                      The homeowner reviewed your delivery and requested the
                      following modifications before releasing funds:
                    </p>
                    {booking.revisionNotes && (
                      <div className="rounded-xl bg-white p-3 text-xs text-copy italic border border-amber-200 whitespace-pre-line">
                        &ldquo;{booking.revisionNotes}&rdquo;
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDeliverModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white py-3 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <PackageCheck className="h-4 w-4" />
                    <span>Submit Updated / Revised Delivery</span>
                  </button>
                </div>
              ) : booking.status === "DISPUTED" ? (
                <div className="rounded-2xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-rose-900">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span>Dispute Under Admin Review</span>
                  </div>
                  <p className="leading-relaxed">
                    A formal dispute has been logged for this contract. Platform
                    escrow funds are frozen while mediation reviews the case.
                  </p>
                  {booking.disputeReason && (
                    <div className="rounded-xl bg-white p-3 text-xs text-copy border border-rose-200 whitespace-pre-line">
                      <strong>Reported Reason:</strong> &ldquo;
                      {booking.disputeReason}&rdquo;
                    </div>
                  )}
                </div>
              ) : booking.status === "COMPLETED" ? (
                <div className="rounded-2xl bg-emerald-50 p-3.5 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Contract Completed & Approved!</span>
                  </div>
                  <p className="leading-relaxed text-slate-600">
                    Payout Status:{" "}
                    <strong className="uppercase">
                      {booking.payoutStatus || "PENDING"}
                    </strong>
                    . Net funds of GH₵
                    {booking.artisanPayoutAmount?.toLocaleString()} are queued
                    for transfer.
                  </p>
                  {booking.customerRating && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-muted font-medium">
                        Client Rating:
                      </span>
                      <span className="font-bold text-amber-600">
                        ★ {booking.customerRating}/5
                      </span>
                    </div>
                  )}
                  {booking.customerFeedback && (
                    <div className="rounded-xl bg-white p-2.5 text-xs text-copy italic border border-emerald-100">
                      &ldquo;{booking.customerFeedback}&rdquo;
                    </div>
                  )}
                </div>
              ) : null}

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
                      className="hover:text-primary"
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
                      className="hover:text-primary"
                    >
                      {booking.customer.email}
                    </a>
                  </div>
                ) : null}
              </div>

              {/* DELIVER WORK MODAL */}
              <DeliverWorkModal
                bookingId={booking._id}
                isOpen={isDeliverModalOpen}
                onClose={() => setIsDeliverModalOpen(false)}
                onSuccess={() => router.refresh()}
              />
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

              {isEditingProposal ? (
                /* INLINE EDIT PROPOSAL FORM */
                <form onSubmit={handleSaveEdit} className="space-y-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-title mb-1">
                      Proposed Price (GH₵){" "}
                      <span className="text-rose-500">*</span>
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
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full rounded-xl border border-line bg-white pl-12 pr-3 py-2 text-xs sm:text-sm font-bold text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-title mb-1">
                      Rate Type
                    </label>
                    <select
                      value={editRateType}
                      onChange={(e) =>
                        setEditRateType(e.target.value as RateType)
                      }
                      className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      placeholder="e.g. 2 days, 4 hours"
                      className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-title mb-1">
                      Proposal Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      className="w-full rounded-xl border border-line bg-white p-3 text-xs text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      disabled={isUpdatingProposal}
                      onClick={() => setIsEditingProposal(false)}
                      className="rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold text-muted hover:text-title cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProposal}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2 text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingProposal ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* READ-ONLY DISPLAY WITH EDIT & WITHDRAW BUTTONS */
                <>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted block">
                      Proposed Amount
                    </span>
                    <div className="font-display text-2xl font-bold text-primary mt-0.5">
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
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleOpenEdit}
                        className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-line bg-white hover:bg-slate-50 py-2.5 text-xs font-semibold text-title transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-muted" />
                        <span>Edit Offer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 py-2.5 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Withdraw Offer</span>
                      </button>
                    </div>
                  ) : null}
                </>
              )}

              {/* WITHDRAW CONFIRMATION MODAL */}
              <WithdrawProposalModal
                quotationId={existingQuotation._id}
                jobId={job._id}
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onSuccess={() => router.refresh()}
              />
            </div>
          ) : null}

          {/* NEW PROPOSAL FORM (IF NO PROPOSAL YET & JOB IS OPEN) */}
          {!existingQuotation && !booking && job.status === "OPEN" ? (
            <div className="rounded-3xl border border-line bg-white p-6 sm:p-7 shadow-lg space-y-4">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-muted">
                  Client Target Budget
                </span>
                <div className="font-display text-3xl font-black text-primary mt-0.5">
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
                    <span className="text-rose-500">*</span>
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
                      className="w-full rounded-xl border border-line bg-white pl-12 pr-3 py-2 text-xs sm:text-sm font-bold text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* LIVE STATUTORY BREAKDOWN & TAKE-HOME CALCULATOR */}
                {Number(proposedAmount) > 0 && (() => {
                  const fees = calculateFeeBreakdown(proposedAmount);
                  return (
                    <div className="rounded-2xl bg-smoke/70 p-3.5 sm:p-4 border border-line text-xs space-y-2.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-line/70">
                        <span className="font-bold text-title flex items-center gap-1.5">
                          <span>Estimated Earnings Breakdown</span>
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                          Ghana Tax Compliant
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-copy">
                          <span>Proposed Total:</span>
                          <span className="font-semibold text-title">
                            GH₵ {fees.grossAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted text-[11px]">
                          <span>VAT ({TAX_RATES.VAT}%):</span>
                          <span className="text-rose-600 font-medium">
                            -GH₵ {fees.vatAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted text-[11px]">
                          <span>NHIL ({TAX_RATES.NHIL}%):</span>
                          <span className="text-rose-600 font-medium">
                            -GH₵ {fees.nhilAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-muted text-[11px]">
                          <span>GETFund Levy ({TAX_RATES.GET_FUND_LEVY}%):</span>
                          <span className="text-rose-600 font-medium">
                            -GH₵ {fees.getFundLevyAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-copy pt-1 border-t border-dashed border-line font-medium">
                          <span>Total Deductions (20%):</span>
                          <span className="text-rose-600 font-bold">
                            -GH₵ {fees.totalDeductions.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-line font-bold text-title bg-emerald-50/80 -mx-3.5 sm:-mx-4 -mb-3.5 sm:-mb-4 p-3 rounded-b-2xl border-emerald-100">
                        <span className="text-emerald-950 font-display text-xs">Your Estimated Net Payout (80%):</span>
                        <span className="text-emerald-700 font-display text-sm sm:text-base font-black">
                          GH₵ {fees.netPayoutAmount.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-[10px] text-muted leading-relaxed pt-3">
                        ℹ️ Platform deductions cover statutory Ghana taxes & escrow protection (VAT 15%, NHIL 2.5%, GETFund 2.5%).
                      </p>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-xs font-semibold text-title mb-1">
                    Pricing Rate Type
                  </label>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as RateType)}
                    className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs text-title focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                    className="w-full rounded-xl border border-line bg-white px-3 py-2 text-xs text-title placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-title mb-1">
                    Proposal Pitch & Details{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Explain your approach, tools included, and relevant experience..."
                    className="w-full rounded-xl border border-line bg-white p-3 text-xs text-title placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-hover text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
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
              <span>Nutsumo Escrow & Payout Protection</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your payment is 100% held in secure platform escrow before you
              begin work. Upon customer completion sign-off, net funds are
              immediately disbursed to your account.
            </p>
          </div>
        </div>
      </div>

      {/* JOB PHOTOS LIGHTBOX */}
      {job.images && job.images.length > 0 && (
        <ImageLightboxModal
          images={job.images}
          initialIndex={selectedImageIndex}
          isOpen={isJobLightboxOpen}
          onClose={() => setIsJobLightboxOpen(false)}
          title={`Job Attachments · ${job.title}`}
        />
      )}

      {/* DELIVERY PROOF LIGHTBOX */}
      {booking?.deliveryProof && booking.deliveryProof.length > 0 && (
        <ImageLightboxModal
          images={booking.deliveryProof}
          initialIndex={deliveryLightboxIndex}
          isOpen={isDeliveryLightboxOpen}
          onClose={() => setIsDeliveryLightboxOpen(false)}
          title={`Delivered Proof · Booking #${booking.bookingNumber || ""}`}
        />
      )}
    </div>
  );
}

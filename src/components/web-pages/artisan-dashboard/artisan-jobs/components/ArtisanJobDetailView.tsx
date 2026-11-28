"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Send,
  ShieldCheck,
  Tag,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Loader2,
  Trash2,
  PackageCheck,
  Lock,
  Edit3,
  Maximize2,
  MessageSquare,
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
import {
  ARTISAN_NET_PAYOUT_PERCENTAGE,
  calculateFeeBreakdown,
  TAX_RATES,
  TOTAL_DEDUCTION_PERCENTAGE,
} from "@/lib/taxCalculator";
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
  const customerId =
    job.customer?._id ||
    (typeof existingQuotation?.customer === "object" ? existingQuotation.customer?._id : existingQuotation?.customer) ||
    undefined;

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

  const statusLabel: Record<string, string> = {
    OPEN: "Open for proposals",
    BOOKED: "Booked",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  const bookingStatusLabel: Record<string, string> = {
    AWAITING_PAYMENT: "Awaiting deposit",
    CONFIRMED: "Deposit secured",
    IN_PROGRESS: "In progress",
    DELIVERED: "Delivered",
    REVISION_REQUESTED: "Revision requested",
    DISPUTED: "In dispute",
    COMPLETED: "Completed",
  };
  const bookingStatusTone: Record<string, string> = {
    AWAITING_PAYMENT: "bg-amber-50 text-amber-700 ring-amber-200",
    CONFIRMED: "bg-blue-50 text-blue-700 ring-blue-200",
    IN_PROGRESS: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    DELIVERED: "bg-purple-50 text-purple-700 ring-purple-200",
    REVISION_REQUESTED: "bg-amber-50 text-amber-700 ring-amber-200",
    DISPUTED: "bg-rose-50 text-rose-700 ring-rose-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };
  const inputClass =
    "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-title placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";
  const labelClass = "mb-1.5 block text-sm font-medium text-title";

  return (
    <div className="space-y-6">
      {/* TOP BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/pro/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Jobs & Proposals</span>
        </Link>
        {/* Chat opens once the pro has quoted (the backend enforces the same rule). */}
        {customerId && (existingQuotation || booking) ? (
          <Link
            href={`/pro/messages?to=${customerId}&job=${job._id}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-title shadow-2xs transition-colors hover:border-primary/50 hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Message client</span>
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* LEFT: JOB DETAILS */}
        <div className="min-w-0 space-y-6">
          {/* HEADER CARD */}
          <section className="rounded-3xl border border-line bg-white p-6 shadow-2xs sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                  job.status === "OPEN"
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : job.status === "BOOKED" || job.status === "IN_PROGRESS"
                      ? "bg-blue-50 text-blue-700 ring-blue-200"
                      : "bg-slate-100 text-slate-700 ring-slate-200"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {statusLabel[job.status] || job.status}
              </span>
              {categoryName ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  <Tag className="h-3 w-3 text-slate-500" />
                  {categoryName}
                </span>
              ) : null}
              {serviceName ? (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {serviceName}
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold leading-tight text-title sm:text-[32px]">
              {job.title}
            </h1>

            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <InfoTile icon={<MapPin className="h-4 w-4" />} label="Location">
                {job.location}
                {job.postCode ? <span className="text-muted"> · {job.postCode}</span> : null}
              </InfoTile>
              <InfoTile icon={<Calendar className="h-4 w-4" />} label="Needed by">
                {formattedDate}
              </InfoTile>
              <InfoTile icon={<Clock className="h-4 w-4" />} label="Posted">
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
                  : "—"}
              </InfoTile>
            </dl>

            {booking ? <JobProgress status={booking.status} /> : null}
          </section>

          {/* PHOTOS */}
          {job.images && job.images.length > 0 ? (
            <section className="rounded-3xl border border-line bg-white p-6 shadow-2xs sm:p-8">
              <h2 className="font-display text-lg font-semibold text-title">
                Photos <span className="font-normal text-muted">({job.images.length})</span>
              </h2>

              <button
                type="button"
                onClick={() => setIsJobLightboxOpen(true)}
                className="group relative mt-4 block aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 cursor-pointer"
                title="Click to view full screen"
              >
                <Image
                  src={getImageUrl(job.images[selectedImageIndex] || job.images[0]) || ""}
                  alt="Job photo"
                  fill
                  sizes="(min-width: 1280px) 720px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
                  <Maximize2 className="h-3.5 w-3.5" />
                  View full screen
                </span>
              </button>

              {job.images.length > 1 ? (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {job.images.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-primary"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image src={getImageUrl(img) || ""} alt={`Thumbnail ${idx + 1}`} fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {/* DESCRIPTION */}
          <section className="rounded-3xl border border-line bg-white p-6 shadow-2xs sm:p-8">
            <h2 className="font-display text-lg font-semibold text-title">What the client needs</h2>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-copy">
              {job.description}
            </p>
          </section>
        </div>

        {/* RIGHT: BOOKING / PROPOSAL */}
        <aside className="space-y-5 self-start">
          {booking ? (
            <>
              {/* HIRED + PAYOUT CARD */}
              <section className="overflow-hidden rounded-3xl border border-line bg-white shadow-2xs">
                <div className="flex items-start gap-3 bg-linear-to-br from-emerald-50 to-white px-6 pb-5 pt-6">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold text-title">You&apos;re hired!</p>
                    <p className="text-xs text-muted">
                      Booking #{booking.bookingNumber || booking._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                      bookingStatusTone[booking.status] || "bg-slate-100 text-slate-700 ring-slate-200"
                    }`}
                  >
                    {bookingStatusLabel[booking.status] || booking.status.replace(/_/g, " ")}
                  </span>
                </div>

                {(() => {
                  const bookingGross = booking.totalAmount || 0;
                  const bookingFees = calculateFeeBreakdown(bookingGross);
                  const vatAmount = booking.vatAmount ?? bookingFees.vatAmount;
                  const nhilAmount = booking.nhilAmount ?? bookingFees.nhilAmount;
                  const getFundAmount = booking.getFundLevyAmount ?? bookingFees.getFundLevyAmount;
                  const serviceFee = booking.platformServiceFeeAmount ?? 0;
                  const totalDeductions = booking.platformFee ?? bookingFees.totalDeductions;
                  const deductionRate = booking.platformCommissionRate ?? TOTAL_DEDUCTION_PERCENTAGE;
                  const netRate = Number((100 - deductionRate).toFixed(1));
                  const netPayout = booking.artisanPayoutAmount ?? bookingFees.netPayoutAmount;
                  const escrowHeld = booking.paymentStatus === "ESCROW_HELD";

                  return (
                    <div className="px-6 pb-6">
                      <div className="rounded-2xl bg-slate-50 p-5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-muted">Your payout ({netRate}%)</span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              escrowHeld ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-600 ring-1 ring-slate-200"
                            }`}
                          >
                            {escrowHeld ? <Lock className="h-3 w-3" /> : null}
                            {escrowHeld ? "Held in escrow" : (booking.paymentStatus || "Unpaid").replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                          </span>
                        </div>
                        <p className="mt-1 font-display text-[32px] font-bold leading-none tracking-tight text-emerald-700 tabular-nums">
                          GH₵{netPayout.toFixed(2)}
                        </p>
                        <p className="mt-1.5 text-xs text-muted">
                          from a GH₵{bookingGross.toFixed(2)} job, after {deductionRate}% taxes &amp; fees
                        </p>
                      </div>

                      <dl className="mt-4 space-y-2 text-sm">
                        <FeeRow label="Job total" value={`GH₵${bookingGross.toFixed(2)}`} strong />
                        <FeeRow label="VAT (15%)" value={`−GH₵${vatAmount.toFixed(2)}`} />
                        <FeeRow label="NHIL (2.5%)" value={`−GH₵${nhilAmount.toFixed(2)}`} />
                        <FeeRow label="GETFund levy (2.5%)" value={`−GH₵${getFundAmount.toFixed(2)}`} />
                        {serviceFee > 0 ? (
                          <FeeRow label="Platform fee (2.5%)" value={`−GH₵${serviceFee.toFixed(2)}`} />
                        ) : null}
                        <div className="border-t border-dashed border-line pt-2">
                          <FeeRow label={`Total deductions (${deductionRate}%)`} value={`−GH₵${totalDeductions.toFixed(2)}`} strong />
                        </div>
                      </dl>
                    </div>
                  );
                })()}
              </section>

              {/* STAGE: WHAT HAPPENS NOW */}
              {booking.status === "AWAITING_PAYMENT" ? (
                <StageNotice tone="amber" icon={<Lock className="h-4 w-4" />} title="Waiting for the client's deposit">
                  The client accepted your quote. Please wait until they pay the escrow deposit before you start work.
                </StageNotice>
              ) : booking.status === "CONFIRMED" ? (
                <div className="space-y-3">
                  <StageNotice tone="blue" icon={<ShieldCheck className="h-4 w-4" />} title="Deposit secured">
                    The funds are held in escrow. You can start the job now.
                  </StageNotice>
                  <button
                    type="button"
                    disabled={isStartingWork}
                    onClick={() => handleStartWork(booking._id)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
                  >
                    {isStartingWork ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Starting work…</span>
                      </>
                    ) : (
                      <span>Start work</span>
                    )}
                  </button>
                </div>
              ) : booking.status === "IN_PROGRESS" ? (
                <div className="space-y-3">
                  <StageNotice tone="indigo" icon={<Wrench className="h-4 w-4" />} title="Job in progress">
                    When you&apos;re done, submit your delivery notes and photo proof so the client can approve.
                  </StageNotice>
                  <button
                    type="button"
                    onClick={() => setIsDeliverModalOpen(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 cursor-pointer"
                  >
                    <PackageCheck className="h-4 w-4" />
                    <span>Deliver completed work</span>
                  </button>
                </div>
              ) : booking.status === "DELIVERED" ? (
                <StageNotice tone="purple" icon={<PackageCheck className="h-4 w-4" />} title="Work delivered">
                  <p>The client has been asked to inspect the work and release the escrow payment.</p>
                  {booking.deliveryNotes ? (
                    <p className="mt-3 rounded-xl bg-white p-3 italic text-copy ring-1 ring-purple-100">
                      &ldquo;{booking.deliveryNotes}&rdquo;
                    </p>
                  ) : null}
                  {booking.deliveryProof && booking.deliveryProof.length > 0 ? (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-semibold text-purple-900">
                        Proof photos ({booking.deliveryProof.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {booking.deliveryProof.map((img, idx) => (
                          <button
                            key={img}
                            type="button"
                            onClick={() => {
                              setDeliveryLightboxIndex(idx);
                              setIsDeliveryLightboxOpen(true);
                            }}
                            className="group relative h-14 w-18 overflow-hidden rounded-lg ring-1 ring-purple-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
                            title="Click to view full screen"
                          >
                            <Image src={getImageUrl(img) || img} alt={`Proof ${idx + 1}`} fill sizes="72px" className="object-cover" />
                            <span className="absolute inset-0 grid place-items-center bg-black/25 text-white opacity-0 transition-opacity group-hover:opacity-100">
                              <Maximize2 className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </StageNotice>
              ) : booking.status === "REVISION_REQUESTED" ? (
                <div className="space-y-3">
                  <StageNotice tone="amber" icon={<AlertCircle className="h-4 w-4" />} title="The client asked for changes">
                    <p>Make these changes, then submit the delivery again:</p>
                    {booking.revisionNotes ? (
                      <p className="mt-3 whitespace-pre-line rounded-xl bg-white p-3 italic text-copy ring-1 ring-amber-200">
                        &ldquo;{booking.revisionNotes}&rdquo;
                      </p>
                    ) : null}
                  </StageNotice>
                  <button
                    type="button"
                    onClick={() => setIsDeliverModalOpen(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 cursor-pointer"
                  >
                    <PackageCheck className="h-4 w-4" />
                    <span>Submit revised delivery</span>
                  </button>
                </div>
              ) : booking.status === "DISPUTED" ? (
                <StageNotice tone="rose" icon={<AlertCircle className="h-4 w-4" />} title="Dispute under review">
                  <p>Escrow funds are frozen while Nutsumo reviews the case.</p>
                  {booking.disputeReason ? (
                    <p className="mt-3 whitespace-pre-line rounded-xl bg-white p-3 text-copy ring-1 ring-rose-200">
                      <strong>Reason:</strong> &ldquo;{booking.disputeReason}&rdquo;
                    </p>
                  ) : null}
                </StageNotice>
              ) : booking.status === "COMPLETED" ? (
                <StageNotice tone="emerald" icon={<CheckCircle2 className="h-4 w-4" />} title="Job completed and approved">
                  <p>
                    Payout <strong>{(booking.payoutStatus || "PENDING").toLowerCase()}</strong>: GH₵
                    {booking.artisanPayoutAmount?.toLocaleString()}{" "}
                    {booking.payoutStatus === "RELEASED"
                      ? "is in your Nutsumo balance. Withdraw it from Overview."
                      : "is waiting for Nutsumo to release it into your balance."}
                  </p>
                  {booking.customerRating ? (
                    <p className="mt-2 font-semibold text-amber-600">★ {booking.customerRating}/5 from the client</p>
                  ) : null}
                  {booking.customerFeedback ? (
                    <p className="mt-2 rounded-xl bg-white p-3 italic text-copy ring-1 ring-emerald-100">
                      &ldquo;{booking.customerFeedback}&rdquo;
                    </p>
                  ) : null}
                </StageNotice>
              ) : null}

              {/* CLIENT */}
              <section className="rounded-3xl border border-line bg-white p-6 shadow-2xs">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Client</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-base font-semibold text-primary">
                    {(booking.customer?.name || "C").charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-title">{booking.customer?.name || "Client"}</p>
                    <p className="text-xs text-muted">Hired you for this job</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  {booking.customer?.phone ? (
                    <a href={`tel:${booking.customer.phone}`} className="flex items-center gap-2.5 text-copy hover:text-primary">
                      <Phone className="h-4 w-4 text-muted" />
                      {booking.customer.phone}
                    </a>
                  ) : null}
                  {booking.customer?.email ? (
                    <a href={`mailto:${booking.customer.email}`} className="flex min-w-0 items-center gap-2.5 text-copy hover:text-primary">
                      <Mail className="h-4 w-4 shrink-0 text-muted" />
                      <span className="truncate">{booking.customer.email}</span>
                    </a>
                  ) : null}
                </div>
                {customerId ? (
                  <Link
                    href={`/pro/messages?to=${customerId}&job=${job._id}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-semibold text-title transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message client
                  </Link>
                ) : null}
              </section>

              <DeliverWorkModal
                bookingId={booking._id}
                isOpen={isDeliverModalOpen}
                onClose={() => setIsDeliverModalOpen(false)}
                onSuccess={() => router.refresh()}
              />
            </>
          ) : null}

          {/* YOUR PROPOSAL */}
          {existingQuotation ? (
            <section className="rounded-3xl border border-line bg-white p-6 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-base font-semibold text-title">Your proposal</h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${
                    existingQuotation.status === "ACCEPTED"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : existingQuotation.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 ring-amber-200"
                        : "bg-rose-50 text-rose-700 ring-rose-200"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {existingQuotation.status.charAt(0) + existingQuotation.status.slice(1).toLowerCase()}
                </span>
              </div>

              {isEditingProposal ? (
                <form onSubmit={handleSaveEdit} className="mt-5 space-y-4">
                  <div>
                    <label className={labelClass}>
                      Proposed price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">GH₵</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className={`${inputClass} pl-12 font-semibold`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Rate type</label>
                      <select value={editRateType} onChange={(e) => setEditRateType(e.target.value as RateType)} className={inputClass}>
                        <option value="FIXED">Fixed price</option>
                        <option value="HOURLY">Hourly</option>
                        <option value="DAILY">Daily</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Duration</label>
                      <input
                        type="text"
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        placeholder="e.g. 2 days"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={isUpdatingProposal}
                      onClick={() => setIsEditingProposal(false)}
                      className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-muted hover:text-title cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdatingProposal}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
                    >
                      {isUpdatingProposal ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Saving…</span>
                        </>
                      ) : (
                        <span>Save changes</span>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="mt-4 font-display text-3xl font-bold tracking-tight text-title tabular-nums">
                    GH₵{existingQuotation.proposedAmount?.toLocaleString()}
                    <span className="ml-1.5 text-sm font-medium text-muted">
                      {existingQuotation.rateType === "FIXED" ? "fixed" : existingQuotation.rateType === "HOURLY" ? "/ hour" : "/ day"}
                    </span>
                  </p>
                  {existingQuotation.estimatedDuration ? (
                    <p className="mt-2 flex items-center gap-2 text-sm text-copy">
                      <Clock className="h-4 w-4 text-muted" />
                      Turnaround: <strong className="font-semibold text-title">{existingQuotation.estimatedDuration}</strong>
                    </p>
                  ) : null}
                  <p className="mt-4 whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-copy">
                    {existingQuotation.message}
                  </p>

                  {existingQuotation.status === "PENDING" ? (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleOpenEdit}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white py-2.5 text-sm font-semibold text-title transition-colors hover:bg-slate-50 cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4 text-muted" />
                        Edit offer
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWithdrawModalOpen(true)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white py-2.5 text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Withdraw
                      </button>
                    </div>
                  ) : null}
                </>
              )}

              <WithdrawProposalModal
                quotationId={existingQuotation._id}
                jobId={job._id}
                isOpen={isWithdrawModalOpen}
                onClose={() => setIsWithdrawModalOpen(false)}
                onSuccess={() => router.refresh()}
              />
            </section>
          ) : null}

          {/* SEND A PROPOSAL */}
          {!existingQuotation && !booking && job.status === "OPEN" ? (
            <section className="rounded-3xl border border-line bg-white p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Client&apos;s budget</p>
              <p className="mt-1 font-display text-3xl font-bold tracking-tight text-title tabular-nums">
                {job.budget ? `GH₵${job.budget.toLocaleString()}` : "Open to quotes"}
              </p>

              <form onSubmit={handleSubmitProposal} className="mt-5 space-y-4 border-t border-line pt-5">
                <div>
                  <label className={labelClass}>
                    Your price <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">GH₵</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={proposedAmount}
                      onChange={(e) => setProposedAmount(e.target.value)}
                      placeholder="e.g. 150"
                      className={`${inputClass} pl-12 font-semibold`}
                    />
                  </div>
                </div>

                {/* LIVE TAKE-HOME CALCULATOR */}
                {Number(proposedAmount) > 0 &&
                  (() => {
                    const fees = calculateFeeBreakdown(proposedAmount);
                    return (
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xs font-medium text-muted">
                            You&apos;ll receive ({ARTISAN_NET_PAYOUT_PERCENTAGE}%)
                          </span>
                          <span className="font-display text-xl font-bold text-emerald-700 tabular-nums">
                            GH₵{fees.netPayoutAmount.toFixed(2)}
                          </span>
                        </div>
                        <dl className="mt-3 space-y-1.5 border-t border-line pt-3 text-xs">
                          <FeeRow label={`VAT (${TAX_RATES.VAT}%)`} value={`−GH₵${fees.vatAmount.toFixed(2)}`} />
                          <FeeRow label={`NHIL (${TAX_RATES.NHIL}%)`} value={`−GH₵${fees.nhilAmount.toFixed(2)}`} />
                          <FeeRow label={`GETFund levy (${TAX_RATES.GET_FUND_LEVY}%)`} value={`−GH₵${fees.getFundLevyAmount.toFixed(2)}`} />
                          <FeeRow label={`Platform fee (${TAX_RATES.PLATFORM}%)`} value={`−GH₵${fees.platformServiceFeeAmount.toFixed(2)}`} />
                          <div className="border-t border-dashed border-line pt-1.5">
                            <FeeRow label={`Total deductions (${TOTAL_DEDUCTION_PERCENTAGE}%)`} value={`−GH₵${fees.totalDeductions.toFixed(2)}`} strong />
                          </div>
                        </dl>
                      </div>
                    );
                  })()}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Rate type</label>
                    <select value={rateType} onChange={(e) => setRateType(e.target.value as RateType)} className={inputClass}>
                      <option value="FIXED">Fixed price</option>
                      <option value="HOURLY">Hourly</option>
                      <option value="DAILY">Daily</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Duration</label>
                    <input
                      type="text"
                      value={estimatedDuration}
                      onChange={(e) => setEstimatedDuration(e.target.value)}
                      placeholder="e.g. 1 day"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Your pitch <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How you'll do the job, what's included, and your relevant experience…"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send proposal</span>
                    </>
                  )}
                </button>
              </form>
            </section>
          ) : null}

          {/* ESCROW NOTE */}
          <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-xs leading-relaxed text-muted">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
            <p>
              <span className="font-semibold text-title">Escrow-protected.</span> The client&apos;s payment is held
              securely before you start, and released to you once they approve the work.
            </p>
          </div>
        </aside>
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

/* ----------------------------------------------------------- small pieces */

function InfoTile({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-semibold leading-snug text-title">{children}</dd>
      </div>
    </div>
  );
}

function FeeRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className={strong ? "font-medium text-title" : "text-muted"}>{label}</dt>
      <dd className={`tabular-nums ${strong ? "font-semibold text-title" : "text-copy"}`}>{value}</dd>
    </div>
  );
}

const STAGE_TONES = {
  amber: { box: "bg-amber-50 text-amber-900 ring-amber-200", icon: "text-amber-600" },
  blue: { box: "bg-blue-50 text-blue-950 ring-blue-200", icon: "text-blue-600" },
  indigo: { box: "bg-indigo-50 text-indigo-950 ring-indigo-200", icon: "text-indigo-600" },
  purple: { box: "bg-purple-50 text-purple-950 ring-purple-200", icon: "text-purple-600" },
  rose: { box: "bg-rose-50 text-rose-950 ring-rose-200", icon: "text-rose-600" },
  emerald: { box: "bg-emerald-50 text-emerald-950 ring-emerald-200", icon: "text-emerald-600" },
} as const;

function StageNotice({
  tone,
  icon,
  title,
  children,
}: {
  tone: keyof typeof STAGE_TONES;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl p-5 text-sm ring-1 ring-inset ${STAGE_TONES[tone].box}`}>
      <p className="flex items-center gap-2 font-semibold">
        <span className={STAGE_TONES[tone].icon}>{icon}</span>
        {title}
      </p>
      <div className="mt-2 leading-relaxed opacity-90">{children}</div>
    </div>
  );
}

const PROGRESS_STEPS = ["Hired", "Deposit", "In progress", "Delivered", "Completed"];
const PROGRESS_INDEX: Record<string, number> = {
  AWAITING_PAYMENT: 1,
  CONFIRMED: 2,
  IN_PROGRESS: 2,
  DELIVERED: 3,
  REVISION_REQUESTED: 2,
  DISPUTED: 3,
  COMPLETED: 5,
};

/** Booking journey: steps before `current` are done, `current` is highlighted. */
function JobProgress({ status }: { status: string }) {
  const current = PROGRESS_INDEX[status] ?? 0;
  return (
    <ol className="mt-6 flex items-center gap-2 border-t border-line pt-6" aria-label="Job progress">
      {PROGRESS_STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 rounded ${index === 0 ? "opacity-0" : done || active ? "bg-emerald-500" : "bg-slate-200"}`} />
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-white text-primary ring-2 ring-primary"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </span>
              <span className={`h-0.5 flex-1 rounded ${index === PROGRESS_STEPS.length - 1 ? "opacity-0" : done ? "bg-emerald-500" : "bg-slate-200"}`} />
            </div>
            <span className={`truncate text-[11px] font-medium sm:text-xs ${done || active ? "text-title" : "text-muted"}`}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

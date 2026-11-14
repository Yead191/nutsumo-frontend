"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Trash2,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Receipt,
  User,
  Briefcase,
} from "lucide-react";
import { WithdrawProposalModal } from "./WithdrawProposalModal";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  ARTISAN_NET_PAYOUT_PERCENTAGE,
  calculateFeeBreakdown,
  TOTAL_DEDUCTION_PERCENTAGE,
} from "@/lib/taxCalculator";
import type { IQuotationItem, IBookingItem } from "../types";

interface ArtisanProposalsListProps {
  quotations: IQuotationItem[];
  bookings?: IBookingItem[];
  onViewContract?: () => void;
}

type ProposalSubFilter =
  | "ALL"
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

interface ProposalStatusDescriptor {
  badgeLabel: string;
  badgeClass: string;
  dotClass: string;
  infoBanner?: {
    type: "warning" | "success" | "active" | "danger" | "neutral";
    title: string;
    description: string;
  };
  matchingBooking?: IBookingItem;
  isActionableAsContract: boolean;
}

function resolveProposalStatus(
  quotation: IQuotationItem,
  bookings: IBookingItem[] = [],
): ProposalStatusDescriptor {
  const jobObj =
    typeof quotation.job === "object" && quotation.job ? quotation.job : null;
  const jobId = jobObj?._id || String(quotation.job);

  // Match corresponding booking if accepted
  const matchingBooking = bookings.find((b) => {
    const bQuotId =
      typeof b.quotation === "object" ? b.quotation?._id : b.quotation;
    const bJobId = typeof b.job === "object" ? b.job?._id : b.job;
    return bQuotId === quotation._id || bJobId === jobId;
  });

  // 1. ACCEPTED (Hired / Contract Created)
  if (quotation.status === "ACCEPTED") {
    if (matchingBooking) {
      if (matchingBooking.status === "AWAITING_PAYMENT") {
        return {
          badgeLabel: "Offer Accepted · Awaiting Escrow Payment",
          badgeClass: "bg-amber-50 text-amber-800 border border-amber-200/80",
          dotClass: "bg-amber-500 animate-pulse",
          infoBanner: {
            type: "warning",
            title: "Client Escrow Deposit Pending",
            description:
              "The client accepted your proposal. Nutsumo will secure funds in Escrow before you begin work to ensure full payment protection.",
          },
          matchingBooking,
          isActionableAsContract: true,
        };
      }

      if (matchingBooking.status === "CONFIRMED") {
        return {
          badgeLabel: "Contract Active · Escrow Funded",
          badgeClass: "bg-blue-50 text-blue-800 border border-blue-200/80",
          dotClass: "bg-blue-600 animate-pulse",
          infoBanner: {
            type: "active",
            title: "Contract Active & Escrow Secured",
            description: `Escrow deposit of GH₵${matchingBooking.totalAmount?.toLocaleString()} is securely held. You are protected to begin work.`,
          },
          matchingBooking,
          isActionableAsContract: true,
        };
      }

      if (matchingBooking.status === "IN_PROGRESS") {
        return {
          badgeLabel: "Work In Progress",
          badgeClass: "bg-indigo-50 text-indigo-800 border border-indigo-200/80",
          dotClass: "bg-indigo-600 animate-pulse",
          matchingBooking,
          isActionableAsContract: true,
        };
      }

      if (matchingBooking.status === "DELIVERED") {
        return {
          badgeLabel: "Work Delivered · In Client Review",
          badgeClass:
            "bg-purple-50 text-purple-800 border border-purple-200/80",
          dotClass: "bg-purple-600",
          matchingBooking,
          isActionableAsContract: true,
        };
      }

      if (matchingBooking.status === "COMPLETED") {
        return {
          badgeLabel: "Contract Completed · Released",
          badgeClass:
            "bg-emerald-50 text-emerald-900 border border-emerald-300",
          dotClass: "bg-emerald-600",
          infoBanner: {
            type: "success",
            title: "Contract Completed Successfully",
            description:
              "Client confirmed work completion. Your net payout has been approved and released.",
          },
          matchingBooking,
          isActionableAsContract: true,
        };
      }
    }

    // Default Accepted fallback if booking is still populating
    return {
      badgeLabel: "Offer Accepted · Contract Created",
      badgeClass: "bg-blue-50 text-blue-800 border border-blue-200/80",
      dotClass: "bg-blue-600 animate-pulse",
      infoBanner: {
        type: "active",
        title: "Proposal Accepted",
        description:
          "The client selected your quotation. Your contract and escrow are being synchronized.",
      },
      matchingBooking,
      isActionableAsContract: true,
    };
  }

  // 2. WITHDRAWN
  if (quotation.status === "WITHDRAWN") {
    return {
      badgeLabel: "Withdrawn by You",
      badgeClass: "bg-zinc-100 text-zinc-600 border border-zinc-200",
      dotClass: "bg-zinc-400",
      isActionableAsContract: false,
    };
  }

  // 3. REJECTED
  if (quotation.status === "REJECTED") {
    const isAnotherArtisanHired =
      quotation.rejectReason?.toLowerCase().includes("another") ||
      jobObj?.status === "BOOKED" ||
      jobObj?.status === "IN_PROGRESS";

    return {
      badgeLabel: isAnotherArtisanHired
        ? "Job Awarded to Another Provider"
        : "Proposal Declined",
      badgeClass: isAnotherArtisanHired
        ? "bg-slate-100 text-slate-700 border border-slate-200"
        : "bg-rose-50 text-rose-700 border border-rose-200",
      dotClass: isAnotherArtisanHired ? "bg-slate-400" : "bg-rose-500",
      infoBanner: {
        type: isAnotherArtisanHired ? "neutral" : "danger",
        title: isAnotherArtisanHired ? "Job Filled" : "Client Feedback",
        description:
          quotation.rejectReason ||
          (isAnotherArtisanHired
            ? "The homeowner awarded this job to another verified artisan."
            : "The client decided not to proceed with this proposal."),
      },
      isActionableAsContract: false,
    };
  }

  // 4. PENDING (Under review or Job Cancelled)
  if (jobObj?.status === "CANCELLED") {
    return {
      badgeLabel: "Job Cancelled by Client",
      badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
      dotClass: "bg-slate-400",
      infoBanner: {
        type: "neutral",
        title: "Job Cancelled",
        description:
          "The client cancelled this job request. Your proposal is no longer active.",
      },
      isActionableAsContract: false,
    };
  }

  return {
    badgeLabel: "Under Client Review",
    badgeClass: "bg-orange-50 text-orange-800 border border-orange-200/80",
    dotClass: "bg-orange-500 animate-pulse",
    isActionableAsContract: false,
  };
}

export function ArtisanProposalsList({
  quotations = [],
  bookings = [],
  onViewContract,
}: ArtisanProposalsListProps) {
  const router = useRouter();
  const [subFilter, setSubFilter] = useState<ProposalSubFilter>("ALL");
  const [expandedMessages, setExpandedMessages] = useState<
    Record<string, boolean>
  >({});
  const [withdrawingData, setWithdrawingData] = useState<{
    quotationId: string;
    jobId: string;
  } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMessages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter counts
  const pendingCount = quotations.filter((q) => q.status === "PENDING").length;
  const acceptedCount = quotations.filter(
    (q) => q.status === "ACCEPTED",
  ).length;
  const rejectedCount = quotations.filter(
    (q) => q.status === "REJECTED",
  ).length;
  const withdrawnCount = quotations.filter(
    (q) => q.status === "WITHDRAWN",
  ).length;

  const filteredQuotations = quotations.filter((q) => {
    if (subFilter === "ALL") return true;
    return q.status === subFilter;
  });

  if (quotations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-smoke/40 p-10 sm:p-14 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary mb-4">
          <FileText className="h-7 w-7" />
        </div>
        <h3 className="font-display text-lg font-bold text-title">
          No Proposals Submitted Yet
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted max-w-md mx-auto">
          You haven&apos;t submitted any quotations yet. Browse verified customer
          job requests and submit competitive bids with Nutsumo Escrow protection!
        </p>
        <Link
          href="/jobs"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary-hover text-white px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-[1.02]"
        >
          <Sparkles className="h-4 w-4" />
          <span>Browse Available Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 1. SUB-FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: "ALL", label: `All Proposals (${quotations.length})` },
            { id: "PENDING", label: `Under Review (${pendingCount})` },
            { id: "ACCEPTED", label: `Hired & Contracts (${acceptedCount})` },
            { id: "REJECTED", label: `Declined / Filled (${rejectedCount})` },
            { id: "WITHDRAWN", label: `Withdrawn (${withdrawnCount})` },
          ] as const
        ).map((tab) => {
          const isActive = subFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubFilter(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-title text-white shadow-xs"
                  : "border border-line bg-white text-muted hover:text-title hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. PROPOSALS LIST */}
      {filteredQuotations.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-10 text-center text-xs text-muted">
          No proposals match the &quot;{subFilter.toLowerCase()}&quot; filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotations.map((quotation) => {
            const jobObj =
              typeof quotation.job === "object" && quotation.job
                ? quotation.job
                : null;
            const jobId = jobObj?._id || String(quotation.job);
            const jobTitle = jobObj?.title || "Contract Service Request";
            const clientTargetBudget = jobObj?.budget ?? null;
            const jobLocation = jobObj?.location || "Accra, Ghana";

            const customerObj =
              typeof quotation.customer === "object" && quotation.customer
                ? quotation.customer
                : null;
            const customerName = customerObj?.name || "Client";
            const customerImage = customerObj?.image;

            const statusInfo = resolveProposalStatus(quotation, bookings);
            const matchingBooking = statusInfo.matchingBooking;

            const proposedAmount = quotation.proposedAmount || 0;
            const feeBreakdown = calculateFeeBreakdown(proposedAmount);

            const isMessageLong = (quotation.message || "").length > 180;
            const isExpanded = Boolean(expandedMessages[quotation._id]);

            return (
              <div
                key={quotation._id}
                className="rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* CARD HEADER: STATUS BADGE & TIMELINE */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-3.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Status Pill */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusInfo.badgeClass}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusInfo.dotClass}`}
                      />
                      <span>{statusInfo.badgeLabel}</span>
                    </span>

                    {/* Booking Reference Pill if Contract Created */}
                    {matchingBooking?.bookingNumber && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        <Receipt className="h-3 w-3 text-muted" />
                        #{matchingBooking.bookingNumber}
                      </span>
                    )}

                    {/* Submission / Status Date */}
                    <span className="text-[11px] text-muted">
                      Submitted{" "}
                      {new Date(quotation.createdAt).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>

                  {/* Pricing Overview (Gross & Rate Type) */}
                  <div className="sm:text-right">
                    <span className="block text-[10px] uppercase font-bold text-muted tracking-wider">
                      Proposed Price ({quotation.rateType || "FIXED"})
                    </span>
                    <span className="font-display text-lg sm:text-xl font-bold text-title">
                      GH₵{proposedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* JOB TITLE & CONTEXT TAGS */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/pro/jobs/${jobId}`}
                        className="font-display text-base sm:text-lg font-bold text-title hover:text-primary transition-colors"
                      >
                        {jobTitle}
                      </Link>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-1">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted" />
                          {jobLocation}
                        </span>

                        {clientTargetBudget != null && (
                          <span className="inline-flex items-center gap-1">
                            <span className="font-medium text-slate-700">
                              Client Budget:
                            </span>{" "}
                            GH₵{clientTargetBudget.toLocaleString()}
                          </span>
                        )}

                        {quotation.estimatedDuration && (
                          <span className="inline-flex items-center gap-1 text-slate-700">
                            <Clock className="h-3.5 w-3.5 text-muted" />
                            Turnaround:{" "}
                            <strong>{quotation.estimatedDuration}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Customer mini info badge if available */}
                    {customerName && customerName !== "Client" && (
                      <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 border border-line/60 px-2.5 py-1 text-xs shrink-0 self-start">
                        <div className="h-5 w-5 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
                          {customerImage ? (
                            <Image
                              src={getImageUrl(customerImage) || customerImage}
                              alt={customerName}
                              width={20}
                              height={20}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-3 w-3 m-1 text-muted" />
                          )}
                        </div>
                        <span className="font-medium text-title text-[11px]">
                          {customerName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* TAKE-HOME EARNINGS BREAKDOWN STRIP (20% STATUTORY BREAKDOWN & 80% NET) */}
                <div className="rounded-2xl border border-line/70 bg-smoke/40 p-3 sm:p-3.5 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="block text-[10px] text-muted font-medium uppercase">
                        Total Bid Price
                      </span>
                      <span className="font-semibold text-title">
                        GH₵{feeBreakdown.grossAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-x border-line/70">
                      <span className="block text-[10px] text-muted font-medium uppercase" title="VAT 15%, NHIL 2.5%, GETFund 2.5%, platform fee 2.5%">
                        Deductions ({TOTAL_DEDUCTION_PERCENTAGE}%)
                      </span>
                      <span className="font-semibold text-rose-600">
                        -GH₵{feeBreakdown.totalDeductions.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-emerald-700 font-semibold uppercase">
                        Net Take-Home ({ARTISAN_NET_PAYOUT_PERCENTAGE}%)
                      </span>
                      <span className="font-bold text-emerald-700">
                        GH₵{feeBreakdown.netPayoutAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted text-center pt-1.5 border-t border-line/40 flex items-center justify-center gap-2 flex-wrap font-medium">
                    <span>VAT 15%: -GH₵{feeBreakdown.vatAmount.toFixed(2)}</span>
                    <span className="text-line">•</span>
                    <span>NHIL 2.5%: -GH₵{feeBreakdown.nhilAmount.toFixed(2)}</span>
                    <span className="text-line">•</span>
                    <span>GETFund 2.5%: -GH₵{feeBreakdown.getFundLevyAmount.toFixed(2)}</span>
                    <span className="text-line">•</span>
                    <span>Platform 2.5%: -GH₵{feeBreakdown.platformServiceFeeAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* CONTEXTUAL ESCROW / FEEDBACK ALERT BANNER */}
                {statusInfo.infoBanner && (
                  <div
                    className={`rounded-2xl p-3.5 sm:p-4 text-xs flex items-start gap-3 border ${
                      statusInfo.infoBanner.type === "active"
                        ? "bg-blue-50/80 border-blue-200 text-blue-950"
                        : statusInfo.infoBanner.type === "success"
                          ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                          : statusInfo.infoBanner.type === "warning"
                            ? "bg-amber-50/80 border-amber-200 text-amber-950"
                            : statusInfo.infoBanner.type === "danger"
                              ? "bg-rose-50/80 border-rose-200 text-rose-950"
                              : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    {statusInfo.infoBanner.type === "active" && (
                      <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    )}
                    {statusInfo.infoBanner.type === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    {statusInfo.infoBanner.type === "warning" && (
                      <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    {statusInfo.infoBanner.type === "danger" && (
                      <Info className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    {statusInfo.infoBanner.type === "neutral" && (
                      <Info className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                    )}

                    <div className="space-y-0.5">
                      <p className="font-bold text-xs">
                        {statusInfo.infoBanner.title}
                      </p>
                      <p className="text-[11px] leading-relaxed opacity-90">
                        {statusInfo.infoBanner.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* SUBMITTED MESSAGE / COVER LETTER */}
                {quotation.message && (
                  <div className="rounded-2xl bg-white p-3.5 border border-line/70 text-xs text-copy space-y-1.5">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                      Your Proposal Message:
                    </span>
                    <p className="leading-relaxed whitespace-pre-line font-sans text-title/90">
                      {isMessageLong && !isExpanded
                        ? `${quotation.message.slice(0, 180)}...`
                        : quotation.message}
                    </p>
                    {isMessageLong && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(quotation._id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer pt-0.5"
                      >
                        {isExpanded ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <span>Read full message</span>
                            <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* CARD FOOTER ACTIONS */}
                <div className="pt-3 border-t border-line/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  {/* Left Side Action */}
                  <div>
                    {quotation.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() =>
                          setWithdrawingData({
                            quotationId: quotation._id,
                            jobId,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Withdraw Proposal</span>
                      </button>
                    )}

                    {statusInfo.isActionableAsContract && (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-xs">
                        {matchingBooking?.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Completed Contract</span>
                          </span>
                        ) : matchingBooking?.status === "CONFIRMED" ? (
                          <span className="inline-flex items-center gap-1 text-blue-700">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Active Contract</span>
                          </span>
                        ) : matchingBooking?.status === "IN_PROGRESS" ? (
                          <span className="inline-flex items-center gap-1 text-indigo-700">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>In Progress</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Awarded Contract</span>
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Right Side Primary CTA */}
                  <div className="flex items-center gap-2">
                    {statusInfo.isActionableAsContract ? (
                      <div className="flex items-center gap-2">
                        {onViewContract && (
                          <button
                            type="button"
                            onClick={onViewContract}
                            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-muted hover:text-title hover:underline py-1 transition-colors cursor-pointer"
                          >
                            <span>Contracts tab</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}

                        <Link
                          href={`/pro/jobs/${jobId}`}
                          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-bold text-xs shadow-xs transition-all hover:scale-[1.02] text-white ${
                            matchingBooking?.status === "COMPLETED"
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : matchingBooking?.status === "CONFIRMED"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : matchingBooking?.status === "IN_PROGRESS"
                                  ? "bg-indigo-600 hover:bg-indigo-700"
                                  : "bg-amber-600 hover:bg-amber-700"
                          }`}
                        >
                        {matchingBooking?.status === "COMPLETED" ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>View Completed Contract</span>
                          </>
                        ) : matchingBooking?.status === "CONFIRMED" ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>Manage Active Contract</span>
                          </>
                        ) : matchingBooking?.status === "IN_PROGRESS" ? (
                          <>
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>Deliver Work / Update</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3.5 w-3.5" />
                            <span>Open Contract</span>
                          </>
                        )}
                        <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                      </Link>
                    </div>
                  ) : (
                      <Link
                        href={`/pro/jobs/${jobId}`}
                        className="inline-flex items-center gap-1.5 font-bold text-title hover:text-primary transition-colors py-1"
                      >
                        <span>View Job Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {withdrawingData && (
        <WithdrawProposalModal
          isOpen={Boolean(withdrawingData)}
          quotationId={withdrawingData.quotationId}
          jobId={withdrawingData.jobId}
          onClose={() => setWithdrawingData(null)}
          onSuccess={() => {
            setWithdrawingData(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

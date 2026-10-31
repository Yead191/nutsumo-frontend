"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FileText,
  DollarSign,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { withdrawQuotationAction } from "@/helpers/next-fetch/apiActions/quotationActions";
import type { IQuotationItem } from "../types";

interface ArtisanProposalsListProps {
  quotations: IQuotationItem[];
}

export function ArtisanProposalsList({ quotations }: ArtisanProposalsListProps) {
  const router = useRouter();
  const [subFilter, setSubFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const filteredQuotations = quotations.filter((q) => {
    if (subFilter === "ALL") return true;
    return q.status === subFilter;
  });

  const handleWithdraw = async (quotationId: string, jobId?: string) => {
    if (!confirm("Are you sure you want to withdraw this proposal?")) return;

    setWithdrawingId(quotationId);
    try {
      const res = await withdrawQuotationAction(quotationId, jobId);
      if (res.success) {
        toast.success("Proposal withdrawn successfully.");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to withdraw proposal.");
      }
    } catch {
      toast.error("An error occurred while withdrawing proposal.");
    } finally {
      setWithdrawingId(null);
    }
  };

  if (quotations.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line bg-smoke/40 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
          <FileText className="h-7 w-7" />
        </div>
        <h3 className="font-display text-lg font-bold text-title">
          No proposals submitted yet
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-muted max-w-md mx-auto">
          You haven't submitted any quotations yet. Browse live requests posted by clients in Ghana and submit your first quote to win work!
        </p>
        <Link
          href="/jobs"
          className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#FE375D] hover:bg-[#e0284e] text-white px-5 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-[1.02]"
        >
          <span>Find Jobs to Quote &rarr;</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* SUB-FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: "ALL", label: `All Proposals (${quotations.length})` },
            {
              id: "PENDING",
              label: `Pending (${quotations.filter((q) => q.status === "PENDING").length})`,
            },
            {
              id: "ACCEPTED",
              label: `Accepted (${quotations.filter((q) => q.status === "ACCEPTED").length})`,
            },
            {
              id: "REJECTED",
              label: `Declined (${quotations.filter((q) => q.status === "REJECTED").length})`,
            },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubFilter(tab.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              subFilter === tab.id
                ? "bg-[#FE375D] text-white shadow-xs"
                : "border border-line bg-white text-muted hover:text-title hover:border-title"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredQuotations.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-8 text-center text-xs text-muted">
          No proposals match the "{subFilter.toLowerCase()}" filter.
        </div>
      ) : (
        filteredQuotations.map((quotation) => {
          const jobId =
            typeof quotation.job === "object" && quotation.job
              ? quotation.job._id
              : String(quotation.job);

          const jobTitle =
            typeof quotation.job === "object" && quotation.job?.title
              ? quotation.job.title
              : "Job Request";

          const clientTargetBudget =
            typeof quotation.job === "object" && quotation.job?.budget
              ? quotation.job.budget
              : null;

          const isWithdrawing = withdrawingId === quotation._id;

          return (
            <div
              key={quotation._id}
              className="rounded-3xl border border-line bg-white p-5 sm:p-6 shadow-xs hover:border-[#FE375D]/40 transition-all space-y-4"
            >
              {/* TOP HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      quotation.status === "ACCEPTED"
                        ? "bg-emerald-50 text-emerald-700"
                        : quotation.status === "PENDING"
                          ? "bg-amber-50 text-amber-700"
                          : quotation.status === "REJECTED"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    <span>
                      {quotation.status === "ACCEPTED"
                        ? "Hired / Accepted"
                        : quotation.status === "PENDING"
                          ? "Under Client Review"
                          : quotation.status === "REJECTED"
                            ? "Declined"
                            : quotation.status}
                    </span>
                  </span>

                  <span className="text-[11px] text-muted">
                    Submitted{" "}
                    {new Date(quotation.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-muted">
                    Your Proposed Price
                  </span>
                  <div className="font-display text-lg font-bold text-[#FE375D]">
                    GH₵{quotation.proposedAmount?.toLocaleString()}
                    <span className="text-xs font-normal text-muted ml-1">
                      ({quotation.rateType || "FIXED"})
                    </span>
                  </div>
                </div>
              </div>

              {/* JOB INFO & MESSAGE */}
              <div>
                <Link
                  href={`/pro/jobs/${jobId}`}
                  className="font-display text-base font-bold text-title hover:text-[#FE375D] transition-colors"
                >
                  {jobTitle}
                </Link>

                {clientTargetBudget ? (
                  <p className="text-xs text-muted mt-0.5">
                    Client's Target: GH₵{clientTargetBudget.toLocaleString()}
                  </p>
                ) : null}

                {quotation.estimatedDuration ? (
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 mt-2">
                    <Clock className="h-3.5 w-3.5 text-muted" />
                    <span>Estimated Turnaround: <strong>{quotation.estimatedDuration}</strong></span>
                  </div>
                ) : null}

                <div className="mt-3 rounded-2xl bg-smoke/60 p-3.5 border border-line/60 text-xs text-copy leading-relaxed whitespace-pre-line">
                  {quotation.message}
                </div>

                {quotation.status === "REJECTED" && quotation.rejectReason ? (
                  <div className="mt-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-100">
                    <strong>Client Feedback:</strong> {quotation.rejectReason}
                  </div>
                ) : null}
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                {quotation.status === "PENDING" ? (
                  <button
                    type="button"
                    disabled={isWithdrawing}
                    onClick={() => handleWithdraw(quotation._id, jobId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {isWithdrawing ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Withdrawing...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Withdraw Proposal</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div />
                )}

                <Link
                  href={`/pro/jobs/${jobId}`}
                  className="inline-flex items-center gap-1 font-bold text-title hover:text-[#FE375D] transition-colors"
                >
                  <span>View Job Request</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

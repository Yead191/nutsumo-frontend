"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RequestDetail } from "@/components/web-pages/request-detail";
import { ProQuoteForm } from "@/components/web-pages/pro-quote-form";
import { Button } from "@/components/ui/button";
import { selectJob, selectQuotesForJob } from "@/lib/marketplace";
import { useRoleAccess } from "@/hooks/use-role-access";
import { cn } from "@/lib/cn";

export function ProJobLead({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { access } = useRoleAccess();
  const job = selectJob(undefined, jobId);
  const [leadAction, setLeadActionState] = useState<"open" | "accepted" | "declined">("open");
  const hiredQuoteId = null;
  const quotes = selectQuotesForJob(undefined, jobId);
  const myQuote = quotes.find((quote) => quote.proId === "pro-1");
  const alreadyQuoted = Boolean(myQuote);
  const forSomeoneElse = Boolean(job?.requestedProId && job.requestedProId !== "pro-1");
  const hiredElsewhere = false;
  const accepted = leadAction === "accepted" || alreadyQuoted;
  const passed = leadAction === "declined";

  function accept() {
    setLeadActionState("accepted");
  }

  function pass() {
    setLeadActionState("declined");
    router.push("/pro/jobs");
  }

  return (
    <div className="w-full max-w-5xl space-y-5">
      <RequestDetail
        id={jobId}
        backHref="/pro/jobs"
        backLabel="Available jobs"
        inboxHref="/pro/messages"
        viewer="pro"
      />

      {forSomeoneElse ? (
        <div className="rounded-xl border border-line/80 bg-white px-6 py-4">
          <p className="text-sm text-muted">This quote request was sent to another professional.</p>
        </div>
      ) : hiredElsewhere ? (
        <div className="rounded-xl border border-line/80 bg-white px-6 py-4">
          <p className="text-sm text-muted">The homeowner already accepted another quotation for this job.</p>
        </div>
      ) : !access.canSubmitQuote ? (
        <div className="rounded-xl border border-line/80 bg-white px-6 py-4">
          <p className="text-sm text-muted">
            {access.blockedReason ?? "An active professional subscription is required to send quotations."}
          </p>
          <Button href="/pro/pricing" size="sm" className="mt-3">
            Membership
          </Button>
        </div>
      ) : passed ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line/80 bg-white p-5 shadow-xs">
          <p className="text-sm text-muted">You passed on this request.</p>
          <Button type="button" size="sm" variant="ghost" onClick={accept} className="rounded-full">
            Undo
          </Button>
        </div>
      ) : alreadyQuoted && myQuote ? (
        <div className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-title">
                  Your Submitted Quotation
                </h3>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                    myQuote.status === "accepted" || hiredQuoteId === myQuote.id
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : myQuote.status === "rejected"
                      ? "bg-smoke text-muted border border-line"
                      : "bg-blue-50 text-primary border border-blue-200",
                  )}
                >
                  {myQuote.status === "accepted" || hiredQuoteId === myQuote.id
                    ? "✓ Accepted by Homeowner"
                    : myQuote.status === "rejected"
                    ? "Declined"
                    : "Sent · Awaiting Homeowner Review"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                Sent to {job?.homeownerName ?? "Homeowner"} · Direct payment upon completion ($0 HomeFix fee)
              </p>
            </div>

            <div className="text-right">
              <span className="font-display text-2xl font-bold text-title">
                ${myQuote.amount}
              </span>
              <span className="text-xs text-muted block capitalize">
                {myQuote.priceType === "hourly" ? "/hr" : myQuote.priceType}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted">Scope of Work</h4>
              <p className="mt-1 text-xs sm:text-sm text-copy leading-relaxed">{myQuote.scope}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-line/60 text-xs">
              {myQuote.proposedSchedule || myQuote.availability ? (
                <div>
                  <span className="text-muted font-medium">Proposed Schedule: </span>
                  <strong className="text-title font-semibold">{myQuote.proposedSchedule || myQuote.availability}</strong>
                </div>
              ) : null}
              {myQuote.estimatedDuration ? (
                <div>
                  <span className="text-muted font-medium">Duration: </span>
                  <strong className="text-title font-semibold">{myQuote.estimatedDuration}</strong>
                </div>
              ) : null}
              {myQuote.materialsIncluded != null ? (
                <div>
                  <span className="text-muted font-medium">Parts &amp; Materials: </span>
                  <strong className="text-title font-semibold">
                    {myQuote.materialsIncluded ? "All parts & fittings included" : "Labor only (parts extra)"}
                  </strong>
                </div>
              ) : null}
              {myQuote.warranty ? (
                <div>
                  <span className="text-muted font-medium">Warranty: </span>
                  <strong className="text-title font-semibold">{myQuote.warranty}</strong>
                </div>
              ) : null}
              {myQuote.expiresAt ? (
                <div>
                  <span className="text-muted font-medium">Valid Until: </span>
                  <strong className="text-title font-semibold">{myQuote.expiresAt}</strong>
                </div>
              ) : null}
              {myQuote.exclusions ? (
                <div>
                  <span className="text-muted font-medium">Exclusions: </span>
                  <strong className="text-title font-semibold">{myQuote.exclusions}</strong>
                </div>
              ) : null}
            </div>

            {myQuote.paymentTerms ? (
              <div className="rounded-xl bg-smoke/40 p-3 border border-line/60 text-xs text-copy">
                <span className="font-semibold text-title">Payment Terms: </span>
                <span>{myQuote.paymentTerms}</span>
              </div>
            ) : null}

            {myQuote.notes ? (
              <div className="rounded-xl bg-smoke/40 p-3 border border-line/60 text-xs text-copy">
                <span className="font-semibold text-title">Contractor Notes: </span>
                <span>{myQuote.notes}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <ProQuoteForm jobId={jobId} onPass={pass} />
      )}
    </div>
  );
}

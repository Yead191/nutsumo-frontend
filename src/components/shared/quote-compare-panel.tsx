"use client";

import { X, Star, ShieldCheck, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";
import { getPro } from "@/Mockdata";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectQuotesForJob } from "@/lib/marketplace";
import { hireQuote } from "@/redux/slices/marketplaceSlice";
import { addNotification, setJobStatus } from "@/redux/slices/featuresSlice";
import type { Quote } from "@/types";

const priceLabel = { fixed: "Fixed", estimate: "Estimate", hourly: "Hourly", time_and_materials: "T&M" } as const;

function ExpiryChip({ expiresAt }: { expiresAt?: string }) {
  if (!expiresAt) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
      <Clock className="h-3 w-3" /> {expiresAt}
    </span>
  );
}

function ProRatingRow({ rating, reviewCount }: { rating?: number; reviewCount?: number }) {
  // ponytail: collapses to nothing when 0 reviews � no "0 reviews" shown publicly
  if (!reviewCount) return null;
  return (
    <span className="flex items-center gap-1 text-sm font-semibold text-title">
      <Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden />
      <span>{rating?.toFixed(1)}</span>
      <span className="font-normal text-muted">({reviewCount})</span>
    </span>
  );
}

export function QuoteComparePanel({
  quotes,
  jobId,
  onClose,
}: {
  quotes: Quote[];
  jobId: string;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const siblingIds = useAppSelector((state) => selectQuotesForJob(state, jobId).map((item) => item.id));
  const homeownerName = useAppSelector((state) => state.auth.user?.name);

  function accept(quote: Quote) {
    const pro = getPro(quote.proId);
    dispatch(
      hireQuote({
        jobId,
        quoteId: quote.id,
        proId: quote.proId,
        agreedPrice: quote.amount,
        scopeSnapshot: quote.scope,
        homeownerName,
        paymentTerms: quote.paymentTerms,
        siblingQuoteIds: siblingIds,
      }),
    );
    dispatch(setJobStatus({ jobId, status: "hired" }));
    dispatch(addNotification({
      title: "Quotation accepted",
      body: `You selected ${pro?.name ?? "the professional"}. Confirm schedule and payment method on the job.`,
      href: `/account/jobs/${jobId}`,
      createdAt: "Just now",
      role: "homeowner",
    }));
    dispatch(addNotification({
      title: "You were hired",
      body: `A homeowner accepted your $${quote.amount} quotation.`,
      href: `/pro/jobs/${jobId}`,
      createdAt: "Just now",
      role: "pro",
    }));
    onClose();
  }

  if (!quotes.length) return null;

  return (
    /* Mobile: bottom sheet | Desktop: centered modal */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compare quotes"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl max-h-[90dvh] overflow-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-title">Compare quotes</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close comparison"
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable comparison table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px]">
            <thead>
              <tr>
                <th className="w-28 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted" scope="col">
                  Detail
                </th>
                {quotes.map((q) => {
                  const pro = getPro(q.proId);
                  return (
                    <th key={q.id} className="px-4 py-4 text-left" scope="col">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-title leading-tight">
                          {pro?.name ?? "Pro"}
                        </p>
                        <p className="text-xs text-muted">{pro?.trade}</p>
                        {pro?.clearance === "cleared" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            <ShieldCheck className="h-3 w-3" aria-hidden /> Verified
                          </span>
                        )}
                        <ProRatingRow rating={pro?.rating} reviewCount={pro?.reviewCount} />
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-line">
              {/* Price row � visually prominent */}
              <tr className="bg-smoke/50">
                <td className="px-5 py-3 text-xs text-muted">Price</td>
                {quotes.map((q) => (
                  <td key={q.id} className="px-4 py-3">
                    <p className="font-display text-xl font-bold text-title">
                      {q.priceMax != null ? `$${q.amount}�$${q.priceMax}` : `$${q.amount}${q.priceType === "hourly" ? "/hr" : ""}`}
                    </p>
                    <span className="text-xs text-muted">{priceLabel[q.priceType]}</span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-5 py-3 text-xs text-muted">Timeline</td>
                {quotes.map((q) => (
                  <td key={q.id} className="px-4 py-3 text-sm">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-muted" aria-hidden />
                      {q.estimatedDuration ?? "�"}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-5 py-3 text-xs text-muted">Availability</td>
                {quotes.map((q) => (
                  <td key={q.id} className="px-4 py-3 text-sm">{q.availability ?? "�"}</td>
                ))}
              </tr>

              <tr>
                <td className="px-5 py-3 text-xs text-muted">Materials</td>
                {quotes.map((q) => (
                  <td key={q.id} className="px-4 py-3 text-sm">
                    {q.materialsIncluded == null ? "�" : q.materialsIncluded ? "Included" : "Not included"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-5 py-3 text-xs text-muted">Offer expires</td>
                {quotes.map((q) => (
                  <td key={q.id} className="px-4 py-3">
                    <ExpiryChip expiresAt={q.expiresAt} />
                    {!q.expiresAt && <span className="text-sm text-muted">�</span>}
                  </td>
                ))}
              </tr>

              {/* Scope row */}
              <tr>
                <td className="px-5 py-3 text-xs text-muted">Scope</td>
                {quotes.map((q) => (
                  <td key={q.id} className="px-4 py-3 text-sm text-copy leading-5 max-w-[180px]">
                    {q.scope}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-5 py-3 text-xs text-muted">Not included</td>
                {quotes.map((q) => (
                  <td key={q.id} className="px-4 py-3 text-sm text-copy leading-5 max-w-[180px]">
                    {q.exclusions || "—"}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-5 py-3 text-xs text-muted">Payment terms</td>
                {quotes.map((q) => (
                  <td key={q.id} className="px-4 py-3 text-sm text-copy leading-5 max-w-[180px]">
                    {q.paymentTerms || "Pay the professional directly"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA row � sticky at bottom */}
        <div className="sticky bottom-0 border-t border-line bg-white px-5 py-4">
          <div className="grid gap-3" style={{ gridTemplateColumns: `7rem repeat(${quotes.length}, 1fr)` }}>
            <span className="text-xs text-muted self-center">Actions</span>
            {quotes.map((q) => {
              const expired = q.status === "expired" || q.status === "rejected" || q.status === "withdrawn";
              const pro = getPro(q.proId);
              return (
                <div key={q.id} className="flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={expired}
                    onClick={() => accept(q)}
                    className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary transition-all active:scale-[0.99]"
                  >
                    {expired ? "Expired" : "Accept ↗"}
                  </button>
                  {pro && (
                    <Link
                      href={`/browse-pros/${pro.id}`}
                      className="block text-center text-xs font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-full py-1"
                    >
                      View profile ↗
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

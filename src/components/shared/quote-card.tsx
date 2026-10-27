"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Clock, ShieldCheck, Star } from "lucide-react";
import { getPro, offerStatusLabels } from "@/Mockdata";
import type { Quote } from "@/types";
import { cn } from "@/lib/cn";

function quotePrice(quote: Quote) {
  if (quote.priceMax != null) return `$${quote.amount}–$${quote.priceMax}`;
  return `$${quote.amount}${quote.priceType === "hourly" ? "/hr" : ""}`;
}

export function QuoteCard({
  quote,
  href,
}: {
  quote: Quote;
  href: string;
}) {
  const pro = getPro(quote.proId);
  const hired = quote.status === "accepted";
  const closed = quote.status === "rejected" || quote.status === "withdrawn" || quote.status === "expired";
  const status = hired
    ? "Hired"
    : quote.status === "rejected"
      ? "Declined"
      : offerStatusLabels[quote.status] ?? quote.status;
  const when = quote.proposedSchedule || quote.availability;
  const duration = quote.estimatedDuration;

  return (
    <Link
      href={href}
      aria-label={`View ${pro?.name ?? "professional"} quotation`}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-line/80 bg-white px-3.5 py-3 transition hover:border-primary/40 hover:shadow-sm",
        hired && "border-success/40 bg-success/[0.02]",
        closed && !hired && "opacity-70",
      )}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-title text-sm font-semibold text-white">
        {(pro?.name ?? "P").charAt(0)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-display text-sm font-semibold text-title">
          <span className="truncate">{pro?.name ?? "Professional"}</span>
          {pro?.clearance === "cleared" ? (
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
          ) : null}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
          {pro?.rating ? (
            <span className="inline-flex items-center gap-1 font-medium text-title">
              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
              {pro.rating.toFixed(1)}
            </span>
          ) : null}
          {pro?.trade ? <span>{pro.trade}</span> : null}
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              hired
                ? "bg-success/10 text-success"
                : closed
                  ? "bg-smoke text-muted"
                  : "bg-amber-50 text-amber-700",
            )}
          >
            {status}
          </span>
        </p>
      </div>
      <div className="hidden shrink-0 text-right sm:block">
        <p className="font-display text-base font-bold text-title">{quotePrice(quote)}</p>
        {when || duration ? (
          <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-muted">
            {when ? <Calendar className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            <span className="max-w-[10rem] truncate">{when || duration}</span>
          </p>
        ) : null}
      </div>
      <p className="shrink-0 font-display text-base font-bold text-title sm:hidden">{quotePrice(quote)}</p>
      <ChevronRight className="hidden h-4 w-4 shrink-0 text-muted sm:block" aria-hidden />
    </Link>
  );
}

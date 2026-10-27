"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Ban,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  MapPin,
  MessageCircle,
  Package,
  ShieldCheck,
  Star,
  UserRound,
  Wallet,
  X,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, NativeSelect, TextField } from "@/components/ui/field";
import { getPro, offerStatusLabels, demoHomeowner } from "@/Mockdata";
import { paymentMethodLabels, selectJob, selectQuotesForJob } from "@/lib/marketplace";
import type { DirectPaymentMethod } from "@/types";

const priceLabels: Record<string, string> = {
  fixed: "Fixed Price",
  estimate: "Estimate",
  hourly: "Hourly",
  time_and_materials: "Time & Materials",
};

function SpecBlockItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-4 w-4 shrink-0 text-title mt-0.5" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-title">{value}</p>
      </div>
    </div>
  );
}

export function QuoteDetail({
  jobId,
  quoteId,
  canHire = false,
}: {
  jobId: string;
  quoteId: string;
  canHire?: boolean;
}) {
  const job = selectJob(undefined, jobId);
  const quotes = selectQuotesForJob(undefined, jobId);
  const quote = quotes.find((item) => item.id === quoteId);
  const [hiredId, setHiredId] = useState<string | null>(quote?.status === "accepted" ? quoteId : null);
  const [booking, setBooking] = useState<any>(null);
  const homeownerName = demoHomeowner.name;
  const [bookDate, setBookDate] = useState("");
  const [arrivalWindow, setArrivalWindow] = useState("10:00 AM – 12:00 PM (Late Morning)");
  const [payMethod, setPayMethod] = useState<DirectPaymentMethod>("cash");
  const [msg, setMsg] = useState("");

  if (!quote || !job) {
    return (
      <div className="rounded-[16px] border border-line bg-white p-6">
        <p className="text-sm text-muted">Quotation not found.</p>
        <Link href={`/account/jobs/${jobId}`} className="mt-3 inline-flex text-sm font-semibold text-primary">
          ← Back to request
        </Link>
      </div>
    );
  }

  const pro = getPro(quote.proId);
  const hired = hiredId === quote.id;
  const closed = quote.status === "rejected" || quote.status === "withdrawn" || quote.status === "expired";
  const jobClosed = job.status === "cancelled" || job.status === "disputed";
  const price =
    quote.priceMax != null
      ? `$${quote.amount}–$${quote.priceMax}`
      : `$${quote.amount}${quote.priceType === "hourly" ? "/hr" : ""}`;

  function accept() {
    if (!quote) return;
    setHiredId(quote.id);
    setMsg("Quotation accepted. Agree a schedule and payment method to confirm the booking.");
  }

  function decline() {
    if (!quote) return;
    setMsg("Quote declined.");
  }

  function lockBooking() {
    if (!quote) return;
    if (!bookDate) {
      setMsg("Please choose an appointment date.");
      return;
    }
    setBooking({
      jobId,
      quoteId: quote.id,
      proId: quote.proId,
      agreedPrice: quote.amount,
      scheduledDate: bookDate,
      scheduledTime: arrivalWindow,
      arrivalWindow,
      scopeSnapshot: quote.scope,
      paymentArrangement: payMethod,
      paymentTerms: quote.paymentTerms,
    });
    setMsg("Booking confirmed. Pay the professional directly using the agreed method.");
  }

  return (
    <div className="space-y-4">
      <Link
        href={`/account/jobs/${jobId}`}
        className="inline-flex items-center gap-1 font-display text-sm font-semibold text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to request
      </Link>

      <article className="overflow-hidden rounded-[16px] border border-line/80 bg-white shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line/70 px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-title text-base font-semibold text-white">
              {(pro?.name ?? "P").charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-display text-lg font-semibold text-title">
                {pro?.name ?? "Professional"}
                {pro?.clearance === "cleared" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                ) : null}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                {pro?.rating ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-title">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                    {pro.rating.toFixed(1)}
                    {pro.reviewCount ? <span className="font-normal text-muted">({pro.reviewCount})</span> : null}
                  </span>
                ) : null}
                {pro?.trade ? <span>{pro.trade}</span> : null}
                {pro?.city ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {pro.city}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="rounded-full border border-line bg-smoke px-2.5 py-1 text-xs font-medium text-copy">
              {priceLabels[quote.priceType] ?? "Fixed Price"}
            </span>
            <Badge tone={hired ? "green" : quote.status === "rejected" ? "slate" : "amber"}>
              {hired ? "Hired" : quote.status === "rejected" ? "Declined" : offerStatusLabels[quote.status] ?? quote.status}
            </Badge>
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Quoted price</p>
              <p className="mt-0.5 font-display text-3xl font-bold tracking-tight text-title">{price}</p>
            </div>
            {quote.materialsIncluded != null ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                <Package className="h-3.5 w-3.5" />
                {quote.materialsIncluded ? "Parts included" : "Parts extra"}
              </span>
            ) : null}
          </div>
          {quote.scope ? (
            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Scope of Work</p>
              <p className="mt-1 text-sm leading-relaxed text-copy">{quote.scope}</p>
            </div>
          ) : null}

          <div className="mt-4 grid gap-x-6 gap-y-4 border-t border-line/70 pt-4 sm:grid-cols-2">
            {quote.estimatedDuration ? (
              <SpecBlockItem icon={Clock} label="Estimated Duration" value={quote.estimatedDuration} />
            ) : null}
            {quote.proposedSchedule || quote.availability ? (
              <SpecBlockItem
                icon={Calendar}
                label="Availability & Arrival"
                value={quote.proposedSchedule || quote.availability}
              />
            ) : null}
            {quote.warranty ? <SpecBlockItem icon={ShieldCheck} label="Warranty Guarantee" value={quote.warranty} /> : null}
            {quote.paymentTerms ? <SpecBlockItem icon={Wallet} label="Direct Payment" value={quote.paymentTerms} /> : null}
            {quote.exclusions ? <SpecBlockItem icon={Ban} label="Not Included" value={quote.exclusions} /> : null}
            {quote.expiresAt ? <SpecBlockItem icon={Clock} label="Quote Valid Until" value={quote.expiresAt} /> : null}
          </div>

          {quote.notes ? (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-line bg-smoke/40 p-3.5 text-xs text-copy">
              <FileText className="h-4 w-4 shrink-0 text-title mt-0.5" />
              <div className="min-w-0">
                <p className="font-semibold uppercase tracking-wider text-[10px] text-muted">
                  Contractor Notes &amp; Site Prep
                </p>
                <p className="mt-0.5 leading-relaxed text-title font-medium">{quote.notes}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line/70 px-5 py-4 sm:px-6">
          <Button href={`/account/messages?dm=${quote.proId}`} size="sm" variant="ghost">
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
          {pro ? (
            <Button href={`/browse-pros/${pro.id}`} size="sm" variant="ghost">
              <UserRound className="h-4 w-4" />
              View profile
            </Button>
          ) : null}
          {canHire && !hiredId && !closed && !jobClosed ? (
            <>
              <Button type="button" size="sm" variant="ghost" onClick={decline} className="sm:ml-auto">
                <X className="h-4 w-4" />
                Decline
              </Button>
              <Button type="button" size="sm" onClick={accept}>
                <Check className="h-4 w-4" />
                Accept quote
              </Button>
            </>
          ) : null}
        </div>

        {canHire && hired && !booking?.scheduledDate ? (
          <div className="mx-5 mb-5 space-y-3 rounded-2xl border border-primary/30 bg-smoke/80 p-4 sm:mx-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-title">
              <Calendar className="h-4 w-4 text-primary" />
              Confirm appointment
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Date">
                <TextField type="date" value={bookDate} onChange={(e) => setBookDate(e.target.value)} />
              </Field>
              <Field label="How you will pay the pro">
                <NativeSelect
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as DirectPaymentMethod)}
                >
                  {Object.entries(paymentMethodLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="Arrival window">
                <NativeSelect value={arrivalWindow} onChange={(e) => setArrivalWindow(e.target.value)}>
                  <option value="8:00 AM – 10:00 AM (Early Morning)">8:00 AM – 10:00 AM</option>
                  <option value="10:00 AM – 12:00 PM (Late Morning)">10:00 AM – 12:00 PM</option>
                  <option value="1:00 PM – 3:00 PM (Early Afternoon)">1:00 PM – 3:00 PM</option>
                  <option value="3:00 PM – 5:00 PM (Late Afternoon)">3:00 PM – 5:00 PM</option>
                  <option value="Flexible (Anytime during business hours)">Flexible</option>
                </NativeSelect>
              </Field>
            </div>
            <Button type="button" size="sm" onClick={lockBooking}>
              Confirm booking
            </Button>
          </div>
        ) : null}

        {hired && booking?.scheduledDate ? (
          <div className="mx-5 mb-5 rounded-xl border border-success/30 bg-success/[0.05] p-4 sm:mx-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" />
              Booked for {booking.scheduledDate} · {booking.scheduledTime}
            </p>
          </div>
        ) : null}

        {msg ? <p className="px-5 pb-4 text-xs font-medium text-primary sm:px-6">{msg}</p> : null}
      </article>
    </div>
  );
}

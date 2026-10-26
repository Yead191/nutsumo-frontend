"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  Layers,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { QuoteCard } from "@/components/shared/quote-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { WorkOrderReceipt } from "@/components/shared/work-order-receipt";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import {
  jobCardSummary,
  jobRequestFacts,
  paymentMethodLabels,
  selectBooking,
  selectChangeRequests,
  selectCompletion,
  selectJob,
  selectQuotesForJob,
} from "@/lib/marketplace";
import {
  getCategory,
  getPro,
  urgencyLabels,
} from "@/Mockdata";
import {
  acknowledgeChangeRequest,
  addChangeRequest,
  confirmBooking,
  homeownerConfirmComplete,
  proMarkComplete,
  requestReschedule,
  resolveChangeRequest,
  setPaymentArrangement,
} from "@/redux/slices/marketplaceSlice";
import {
  addNotification,
  addReview,
  updateReview,
  replyToReview,
  setJobStatus,
} from "@/redux/slices/featuresSlice";
import type { DirectPaymentMethod } from "@/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function RequestDetail({
  id,
  backHref,
  backLabel,
  inboxHref,
  canHire = false,
  viewer = "homeowner",
}: {
  id: string;
  backHref: string;
  backLabel: string;
  inboxHref?: string;
  canHire?: boolean;
  viewer?: "homeowner" | "pro";
}) {
  const dispatch = useAppDispatch();
  const job = useAppSelector((state) => selectJob(state, id));
  const quotes = useAppSelector((state) => selectQuotesForJob(state, id));
  const booking = useAppSelector((state) => selectBooking(state, id));
  const changeRequests = useAppSelector((state) => selectChangeRequests(state, id));
  const completion = useAppSelector((state) => selectCompletion(state, id));
  const storedPhotos = useAppSelector((state) => state.features.jobPhotos[id] ?? []);
  const isProView = viewer === "pro";
  const marketplaceReady = useAppSelector((state) => state.marketplace.hydrated);
  const hiredQuoteId = useAppSelector((state) => state.marketplace.hiredByJob[id]);
  const hiredQuote = quotes.find((quote) => quote.id === hiredQuoteId);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewBody, setReviewBody] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleWindow, setRescheduleWindow] = useState("10:00 AM – 12:00 PM (Late Morning)");
  const [changeAmount, setChangeAmount] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showProCompleteModal, setShowProCompleteModal] = useState(false);
  const [proCompletionNote, setProCompletionNote] = useState("");
  const [settlePaymentMethod, setSettlePaymentMethod] = useState<DirectPaymentMethod>("cash");
  const [settlePaid, setSettlePaid] = useState(false);
  const [settleInspected, setSettleInspected] = useState(true);
  const [arrangePay, setArrangePay] = useState<DirectPaymentMethod>("cash");
  const [selectedReviewTags, setSelectedReviewTags] = useState<string[]>([]);
  const [wouldRecommend, setWouldRecommend] = useState<"yes" | "neutral" | "no">("yes");
  const existingReview = useAppSelector((state) =>
    state.features.reviews.find((item) => item.jobId === id)
  );
  const [proReplyDraft, setProReplyDraft] = useState("");

  const currentDisplayRating = hoverRating || reviewRating;
  const activeSentiment = useMemo(() => {
    switch (currentDisplayRating) {
      case 5:
        return {
          title: "★★★★★ 5.0 — Outstanding!",
          desc: "Exceeded all expectations, highly recommend!",
          badgeClass: "bg-amber-50 text-amber-900 border-amber-300",
        };
      case 4:
        return {
          title: "★★★★☆ 4.0 — Very Good!",
          desc: "Quality craftsmanship & satisfied.",
          badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
        };
      case 3:
        return {
          title: "★★★☆☆ 3.0 — Satisfactory",
          desc: "Met basic job expectations.",
          badgeClass: "bg-blue-50 text-blue-800 border-blue-300",
        };
      case 2:
        return {
          title: "★★☆☆☆ 2.0 — Below Expectations",
          desc: "Issues with communication or work quality.",
          badgeClass: "bg-orange-50 text-orange-800 border-orange-300",
        };
      case 1:
      default:
        return {
          title: "★☆☆☆☆ 1.0 — Poor Experience",
          desc: "Unsatisfactory experience or unresolved issue.",
          badgeClass: "bg-rose-50 text-rose-800 border-rose-300",
        };
    }
  }, [currentDisplayRating]);

  function handleSaveReview() {
    const cleanBody =
      reviewBody.trim() ||
      (selectedReviewTags.length
        ? selectedReviewTags.join(" · ")
        : "Great service, arrived on time and completed the work cleanly.");

    if (existingReview) {
      dispatch(
        updateReview({
          id: existingReview.id,
          rating: reviewRating,
          body: cleanBody,
        }),
      );
      setSavedMsg("Verified review updated successfully!");
    } else {
      dispatch(
        addReview({
          jobId: id,
          proId: hiredQuote?.proId ?? "pro-1",
          author: job?.homeownerName ?? "Homeowner",
          rating: reviewRating,
          body: cleanBody || "Excellent professional service.",
          createdAt: "Just now",
        }),
      );
      dispatch(
        addNotification({
          title: `New ${reviewRating}-star verified review`,
          body: `${job?.homeownerName ?? "Homeowner"} submitted a review for ${job?.title ?? "your service"}. It is now visible on your public profile.`,
          href: `/pro/reviews`,
          createdAt: "Just now",
          role: "pro",
        }),
      );
      setSavedMsg("Review published on contractor's profile!");
    }

    setShowReviewModal(false);
  }

  const sortedQuotes = useMemo(
    () =>
      [...quotes].sort((a, b) => {
        const rank = (s: string) =>
          s === "accepted" ? 0 : s === "pending" ? 1 : 2;
        return rank(a.status) - rank(b.status) || a.amount - b.amount;
      }),
    [quotes],
  );

  if (!marketplaceReady) {
    return (
      <div className="rounded-[16px] border border-line bg-white p-6">
        <p className="text-sm text-muted">Loading request…</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-4">
        <Link href={backHref} className="inline-flex font-display text-sm font-semibold text-primary">
          ← {backLabel}
        </Link>
        <div className="rounded-[16px] border border-line bg-white p-6 md:p-8">
          <h1 className="text-[28px]">Request not found</h1>
          <p className="mt-2 text-[16px] leading-7 text-copy">
            This job is missing or was cleared from this browser. Posted requests stay on this device only in the demo.
          </p>
          <div className="mt-5">
            <Button href={backHref} size="sm">
              {backLabel}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const photosForJob = storedPhotos.length ? storedPhotos : job.photos ?? [];
  const category = getCategory(job.categorySlug);
  const hiredPro = hiredQuote ? getPro(hiredQuote.proId) : null;
  const meta = [
    category?.name,
    `${job.city}, ${job.state} ${job.zip}`,
    urgencyLabels[job.urgency],
    isProView ? `Client: ${job.homeownerName}` : null,
  ].filter(Boolean);

  const workActive =
    job.status === "hired" ||
    job.status === "scheduled" ||
    job.status === "en_route" ||
    job.status === "in_progress" ||
    job.status === "awaiting_confirm";

  const arrivalWindowsList = [
    "8:00 AM – 10:00 AM (Early Morning)",
    "10:00 AM – 12:00 PM (Late Morning)",
    "1:00 PM – 3:00 PM (Early Afternoon)",
    "3:00 PM – 5:00 PM (Late Afternoon)",
    "Flexible (Anytime during business hours)",
  ];

  const requestedPro = job.requestedProId ? getPro(job.requestedProId) : null;
  const requestFacts = jobRequestFacts(job);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={backHref} className="inline-flex font-display text-sm font-semibold text-primary">
          ← {backLabel}
        </Link>
        {isProView ? (
          <Button
            href={`/pro/messages?dm=${job.id}`}
            size="sm"
            variant="ghost"
            className="rounded-full text-xs font-semibold border border-line"
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1 text-primary" />
            Message {job.homeownerName}
          </Button>
        ) : null}
      </div>

      <div className="rounded-[16px] border border-line/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-muted">
              {job.visibility === "direct" || job.requestedProId ? (
                <span className="font-medium text-title">
                  Direct request {requestedPro ? `to ${requestedPro.name}` : ""}
                </span>
              ) : (
                <span className="font-medium text-muted">Marketplace Request</span>
              )}
              {job.urgency === "asap" ? (
                <span className="text-error font-medium">· Urgent</span>
              ) : null}
            </div>
            <h1 className="font-display text-xl font-semibold text-title sm:text-2xl">{job.title}</h1>
            <p className="mt-1 text-xs text-muted">{meta.join(" · ")}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>

        {/* Full Detailed Description Input -> Output */}
        {job.description ? (
          <div className="mt-3.5 rounded-xl border border-line/70 bg-smoke/40 p-3.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted">
              Project Description
            </h2>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-copy whitespace-pre-line">
              {job.description}
            </p>
          </div>
        ) : null}

        {/* Request Facts (Property, Budget, Materials, Timing) */}
        {requestFacts.length ? (
          <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted border-t border-line/60 pt-3">
            {requestFacts.map((fact) => (
              <span key={fact.label} className="inline-flex items-center gap-1.5">
                <span className="text-muted font-medium">{fact.label}:</span>
                <strong className="text-title font-semibold">{fact.value}</strong>
              </span>
            ))}
          </div>
        ) : null}

        {/* Attached Photos */}
        {photosForJob.length ? (
          <div className="mt-4 border-t border-line/60 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
              Attached Photos ({photosForJob.length})
            </p>
            <div className="flex flex-wrap gap-2.5">
              {photosForJob.map((src, idx) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={idx}
                  src={src}
                  alt={`Job photo ${idx + 1}`}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl border border-line object-cover shadow-2xs hover:opacity-95 transition"
                />
              ))}
            </div>
          </div>
        ) : null}

        {canHire && job.status !== "cancelled" && job.status !== "completed" && job.status !== "disputed" ? (
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line/70 pt-3">
            <button
              type="button"
              className="text-xs font-semibold text-muted hover:text-title"
              onClick={() => {
                dispatch(setJobStatus({ jobId: id, status: "cancelled" }));
                setSavedMsg("Request closed.");
              }}
            >
              Cancel
            </button>
            {!hiredQuoteId ? (
              <button
                type="button"
                className="text-xs font-semibold text-muted hover:text-title"
                onClick={() => {
                  dispatch(setJobStatus({ jobId: id, status: "getting_quotes" }));
                  setSavedMsg("Reposted.");
                }}
              >
                Repost
              </button>
            ) : null}
          </div>
        ) : null}
        {savedMsg ? <p className="mt-2 text-xs font-medium text-success">{savedMsg}</p> : null}
      </div>

      {/* LIVE OPERATIONAL STATUS CARDS */}
      {job.status === "en_route" ? (
        <div className="rounded-[20px] border border-primary/40 bg-gradient-to-r from-primary/10 via-blue-50/60 to-white p-5 shadow-xs flex items-start gap-4 animate-in fade-in">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-xs">
            <Truck className="h-5 w-5 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-title">
                {hiredPro?.name ?? hiredPro?.businessName ?? "Contractor"} is on the way (En Route)
              </h3>
              <span className="rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                Live Tracking
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-copy leading-relaxed">
              Your contractor has departed and is en route to your service address. Scheduled arrival window: <strong>{booking?.arrivalWindow || booking?.scheduledTime}</strong>. Please ensure the work area is clear.
            </p>
          </div>
        </div>
      ) : null}

      {job.status === "in_progress" ? (
        <div className="rounded-[20px] border border-amber-300 bg-amber-50/70 p-5 shadow-xs flex items-start gap-4 animate-in fade-in">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-600 text-white shadow-xs">
            <Wrench className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-base font-bold text-title">
                Work in progress on-site
              </h3>
              <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                Active Diagnostic &amp; Service
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-copy leading-relaxed">
              Contractor is currently executing the agreed project scope. If any unexpected issues or replacement parts are discovered, the pro will submit an in-app Change Request below for your explicit approval before doing extra work.
            </p>
          </div>
        </div>
      ) : null}

      {job.status === "awaiting_confirm" ? (
        <div className="rounded-[20px] border border-emerald-300 bg-emerald-50/90 p-5 sm:p-6 shadow-sm animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-bold text-title">
                    Contractor marked work 100% completed!
                  </h3>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                    Action Required
                  </span>
                </div>
                <p className="mt-1 text-xs sm:text-sm text-copy leading-relaxed">
                  Please inspect the completed work and test any fixtures/repairs. Once you are 100% satisfied, confirm completion to settle directly with zero platform markup.
                </p>
                {completion?.completionNotes ? (
                  <p className="mt-2 text-xs text-stone-700 italic border-l-2 border-emerald-500 pl-3">
                    Pro note: &ldquo;{completion.completionNotes}&rdquo;
                  </p>
                ) : null}
              </div>
            </div>
            {canHire ? (
              <Button
                type="button"
                size="md"
                onClick={() => setShowSettleModal(true)}
                className="shrink-0 rounded-full font-semibold shadow-xs"
              >
                Confirm &amp; Settle Direct ↗
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Booking panel */}
      {booking && (workActive || job.status === "completed") ? (
        <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
            <h2 className="font-display text-base sm:text-lg font-bold text-title">Appointment &amp; Booking</h2>
            {job.status === "completed" ? (
              <span className="text-xs text-muted font-medium flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-primary" />
                Completed &amp; Settled
              </span>
            ) : (
              <span className="text-xs text-muted font-medium">Direct pay</span>
            )}
          </div>

          <dl className="mt-4 grid gap-3 text-sm text-copy sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted font-medium">Assigned Contractor</dt>
              <dd className="font-semibold text-title flex items-center gap-1.5 mt-0.5">
                <span>{hiredPro?.name ?? "Professional"}</span>
                {hiredPro?.clearance === "cleared" ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted font-medium">Client / Homeowner</dt>
              <dd className="font-semibold text-title flex items-center gap-1.5 mt-0.5">
                <span>{job.homeownerName}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted font-medium">Agreed Total Price</dt>
              <dd className="font-display text-lg font-bold text-title mt-0.5">${booking.agreedPrice}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted font-medium">Service Location</dt>
              <dd className="font-semibold text-title mt-0.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{job.city}, {job.state} {job.zip}</span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted font-medium">Appointment &amp; Arrival Window</dt>
              <dd className="font-semibold text-title mt-0.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {booking.scheduledDate
                  ? `${booking.scheduledDate} · ${booking.arrivalWindow || booking.scheduledTime}`
                  : "Schedule not confirmed yet"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted font-medium">Agreed payment method</dt>
              <dd className="text-xs text-muted mt-0.5">
                {booking.paidAt ? (
                  <span className="font-semibold text-title">
                    Paid directly via {paymentMethodLabels[booking.paymentMethod ?? booking.paymentArrangement ?? ""] ?? booking.paymentMethod}
                  </span>
                ) : booking.paymentArrangement || booking.paymentMethod ? (
                  <span className="font-semibold text-title">
                    {paymentMethodLabels[booking.paymentArrangement ?? booking.paymentMethod ?? ""] ?? booking.paymentArrangement} · pay the professional directly
                  </span>
                ) : (
                  "Agree how you will pay the professional directly."
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-4 pt-3.5 border-t border-line/60">
            <p className="text-xs font-semibold text-title">Agreed Scope:</p>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted">{booking.scopeSnapshot}</p>
            {booking.acceptedAt ? (
              <p className="mt-1 text-[11px] text-muted">Accepted {booking.acceptedAt.slice(0, 10)}</p>
            ) : null}
          </div>

          {hiredQuote?.notes ? (
            <div className="mt-2 text-xs text-muted leading-relaxed">
              <span className="font-semibold text-title">Site Notes:</span> {hiredQuote.notes}
            </div>
          ) : null}

          {job.status === "completed" ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line/60 pt-3.5">
              <p className="text-xs text-muted">
                Receipt #{booking?.paymentReceiptNumber || completion?.receiptNumber || "LHF-REC-842911"}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowReceiptModal(true)}
                  className="rounded-full text-xs font-semibold border border-line hover:border-primary/40 hover:text-primary"
                >
                  <FileCheck2 className="h-3.5 w-3.5 text-primary mr-1.5" />
                  View Itemized Receipt &amp; PDF
                </Button>
                {!existingReview && canHire ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowReviewModal(true)}
                    className="rounded-full text-xs font-semibold"
                  >
                    Rate &amp; Review Pro
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          {booking.priceHistory && booking.priceHistory.length > 1 ? (
            <ul className="mt-4 space-y-1 text-xs text-muted">
              {booking.priceHistory.map((row) => (
                <li key={row.id}>
                  ${row.previousAmount} → ${row.newAmount} · {row.reason}
                </li>
              ))}
            </ul>
          ) : null}

          {(canHire || isProView) &&
          job.status !== "en_route" &&
          job.status !== "in_progress" &&
          job.status !== "awaiting_confirm" &&
          job.status !== "completed" ? (
            <div className="mt-5 border-t border-line/60 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                {booking.scheduledDate ? "Change appointment time" : "Confirm appointment to lock the booking"}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Field label={booking.scheduledDate ? "New Date" : "Appointment date"}>
                  <TextField
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </Field>
                <Field label="2-hour arrival window">
                  <NativeSelect
                    value={rescheduleWindow}
                    onChange={(e) => setRescheduleWindow(e.target.value)}
                  >
                    {arrivalWindowsList.map((win) => (
                      <option key={win} value={win}>
                        {win}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                {!booking.paidAt ? (
                  <Field label="Agreed payment method">
                    <NativeSelect
                      value={booking.paymentArrangement ?? arrangePay}
                      onChange={(e) => setArrangePay(e.target.value as DirectPaymentMethod)}
                    >
                      {Object.entries(paymentMethodLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                ) : null}
              </div>
              <div className="mt-3 flex items-center justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant={booking.scheduledDate ? "ghost" : undefined}
                  disabled={!rescheduleDate}
                  onClick={() => {
                    const chosenPay = booking.paymentArrangement ?? arrangePay;
                    if (!booking.scheduledDate && hiredQuote) {
                      dispatch(
                        confirmBooking({
                          jobId: id,
                          quoteId: hiredQuote.id,
                          proId: hiredQuote.proId,
                          agreedPrice: hiredQuote.amount,
                          scheduledDate: rescheduleDate,
                          scheduledTime: rescheduleWindow,
                          arrivalWindow: rescheduleWindow,
                          scopeSnapshot: hiredQuote.scope,
                          paymentArrangement: chosenPay,
                        }),
                      );
                      dispatch(setJobStatus({ jobId: id, status: "scheduled" }));
                      dispatch(
                        addNotification({
                          title: "Booking confirmed",
                          body: `${rescheduleDate} · pay the professional directly. HomeFix does not collect this.`,
                          href: `/account/jobs/${id}`,
                          createdAt: "Just now",
                          role: "homeowner",
                        }),
                      );
                      dispatch(
                        addNotification({
                          title: "Booking confirmed",
                          body: `Schedule locked for ${rescheduleDate}.`,
                          href: `/pro/jobs/${id}`,
                          createdAt: "Just now",
                          role: "pro",
                        }),
                      );
                      setSavedMsg("Booking confirmed. Pay the professional directly.");
                      return;
                    }
                    dispatch(
                      requestReschedule({
                        jobId: id,
                        scheduledDate: rescheduleDate,
                        scheduledTime: rescheduleWindow,
                        arrivalWindow: rescheduleWindow,
                      }),
                    );
                    if (chosenPay !== booking.paymentArrangement) {
                      dispatch(
                        setPaymentArrangement({
                          jobId: id,
                          paymentArrangement: chosenPay,
                        }),
                      );
                    }
                    setSavedMsg("Appointment rescheduled successfully.");
                  }}
                  className="rounded-full border border-line"
                >
                  {booking.scheduledDate ? "Update Schedule" : "Confirm Appointment & Schedule"}
                </Button>
              </div>
            </div>
          ) : null}

          {/* Pro & Customer Action Buttons */}
          <div className="mt-5 flex flex-wrap gap-2.5 border-t border-line/60 pt-4">
            {/* Pro Operational Actions */}
            {isProView && job.status === "scheduled" ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    dispatch(setJobStatus({ jobId: id, status: "en_route" }));
                    dispatch(
                      addNotification({
                        title: "Contractor en route",
                        body: `${hiredPro?.name ?? "Your contractor"} has departed and is en route to your service location.`,
                        href: `/account/jobs/${id}`,
                        createdAt: "Just now",
                        role: "homeowner",
                      }),
                    );
                    setSavedMsg("Status updated: En Route. Homeowner notified.");
                  }}
                  className="rounded-full gap-1.5"
                >
                  <Truck className="h-4 w-4" />
                  On the way (En Route)
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    dispatch(setJobStatus({ jobId: id, status: "in_progress" }));
                    dispatch(
                      addNotification({
                        title: "Work started on-site",
                        body: `${hiredPro?.name ?? "Your contractor"} has arrived on-site and started the diagnostic/repair.`,
                        href: `/account/jobs/${id}`,
                        createdAt: "Just now",
                        role: "homeowner",
                      }),
                    );
                    setSavedMsg("Marked in progress.");
                  }}
                  className="rounded-full gap-1.5 border border-line"
                >
                  <Wrench className="h-4 w-4" />
                  Start work directly
                </Button>
              </>
            ) : null}

            {isProView && job.status === "en_route" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(setJobStatus({ jobId: id, status: "in_progress" }));
                  dispatch(
                    addNotification({
                      title: "Contractor arrived on-site",
                      body: `${hiredPro?.name ?? "Your contractor"} arrived and started working.`,
                      href: `/account/jobs/${id}`,
                      createdAt: "Just now",
                      role: "homeowner",
                    }),
                  );
                  setSavedMsg("Marked in progress.");
                }}
                className="rounded-full gap-1.5"
              >
                <Wrench className="h-4 w-4" />
                Arrived on-site (Start Work)
              </Button>
            ) : null}

            {isProView && (job.status === "in_progress" || job.status === "en_route" || job.status === "scheduled") && !completion?.proMarkedAt ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowProCompleteModal(true)}
                className="rounded-full gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark work complete
              </Button>
            ) : null}

            {/* Homeowner Completion Action */}
            {canHire && job.status === "awaiting_confirm" ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowSettleModal(true)}
                className="rounded-full gap-1.5 font-semibold"
              >
                <CheckCircle2 className="h-4 w-4" />
                Inspect &amp; Confirm Completion
              </Button>
            ) : null}
          </div>

          {completion?.proMarkedAt && !completion.homeownerConfirmedAt ? (
            <p className="mt-3 text-xs font-medium text-amber-800">
              Pro marked complete. Homeowner inspection &amp; confirmation unlocks the review and receipt.
            </p>
          ) : null}
        </Card>
      ) : null}

      {/* Change requests */}
      {(isProView || canHire) && hiredQuoteId && workActive ? (
        <Card>
          <h2 className="text-lg">Change requests</h2>
          <p className="mt-1 text-sm text-copy">
            Extra work or price changes need both parties to acknowledge before the agreed job value updates.
          </p>
          {isProView || canHire ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr_auto]">
              <Field label="Extra ($)">
                <TextField
                  type="number"
                  min={1}
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(e.target.value)}
                  placeholder="75"
                />
              </Field>
              <Field label="Why">
                <TextField
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Corroded shutoff valve needs replace"
                />
              </Field>
              <div className="flex items-end">
                <Button
                  type="button"
                  size="sm"
                  disabled={!changeAmount || changeReason.trim().length < 6}
                  onClick={() => {
                    dispatch(
                      addChangeRequest({
                        jobId: id,
                        amount: Number(changeAmount),
                        reason: changeReason.trim(),
                        proposedBy: isProView ? "pro" : "homeowner",
                      }),
                    );
                    dispatch(
                      addNotification({
                        title: "Price change proposed",
                        body: `+$${changeAmount} needs both parties to acknowledge before the agreed job value updates.`,
                        href: isProView ? `/account/jobs/${id}` : `/pro/jobs/${id}`,
                        createdAt: "Just now",
                        role: isProView ? "homeowner" : "pro",
                      }),
                    );
                    setChangeAmount("");
                    setChangeReason("");
                    setSavedMsg("Change request sent.");
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          ) : null}
          <ul className="mt-4 space-y-2">
            {changeRequests.length === 0 ? (
              <li className="text-sm text-muted">No change requests yet.</li>
            ) : (
              changeRequests.map((cr) => (
                <li
                  key={cr.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-line px-3 py-2 text-sm"
                >
                  <span>
                    <span className="font-semibold text-title">+${cr.amount}</span> — {cr.reason}
                    <span className="ml-2 text-muted">({cr.status})</span>
                    {cr.status === "pending" ? (
                      <span className="ml-2 text-xs text-muted">
                        {cr.homeownerAcknowledged ? "Homeowner acknowledged" : "Needs homeowner"}
                        {" · "}
                        {cr.proAcknowledged ? "Pro acknowledged" : "Needs pro"}
                      </span>
                    ) : null}
                  </span>
                  {canHire && cr.status === "pending" && !cr.homeownerAcknowledged ? (
                    <span className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => {
                          dispatch(acknowledgeChangeRequest({ id: cr.id, party: "homeowner" }));
                          setSavedMsg(
                            cr.proAcknowledged
                              ? "Both parties acknowledged — agreed price updated."
                              : "Your acknowledgment recorded. Waiting on the professional.",
                          );
                        }}
                      >
                        Acknowledge
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => dispatch(resolveChangeRequest({ id: cr.id, status: "rejected" }))}
                      >
                        Reject
                      </Button>
                    </span>
                  ) : isProView && cr.status === "pending" && !cr.proAcknowledged ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        dispatch(acknowledgeChangeRequest({ id: cr.id, party: "pro" }));
                        setSavedMsg(
                          cr.homeownerAcknowledged
                            ? "Both parties acknowledged — agreed price updated."
                            : "Your acknowledgment recorded. Waiting on the homeowner.",
                        );
                      }}
                    >
                      Acknowledge
                    </Button>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </Card>
      ) : null}

      {!isProView ? (
        <>
          <Card className="rounded-[16px] p-4 sm:p-5 hover:shadow-xs">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-sm font-semibold text-title">Quotations</h2>
                <p className="mt-0.5 text-xs text-muted">
                  {hiredQuoteId
                    ? "You confirmed one quotation."
                    : "Open a quote to review it, then accept one pro."}
                </p>
              </div>
              {sortedQuotes.length ? (
                <span className="text-xs text-muted">{sortedQuotes.length}</span>
              ) : null}
            </div>
            {sortedQuotes.length === 0 ? (
              requestedPro ? (
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line/80 px-3.5 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-title text-sm font-semibold text-white">
                    {initials(requestedPro.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-semibold text-title">{requestedPro.name}</p>
                    <p className="text-xs text-muted">Waiting for a quote</p>
                  </div>
                  {inboxHref ? (
                    <Link href={inboxHref} className="text-xs font-semibold text-primary hover:underline">
                      Message
                    </Link>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">Quotes from matched pros will show here.</p>
              )
            ) : (
              <div className="mt-3 space-y-2">
                {sortedQuotes.map((quote) => (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    href={`/account/jobs/${id}/quotes/${quote.id}`}
                  />
                ))}
              </div>
            )}
          </Card>
        </>
      ) : null}

      {/* COMPLETED STATUS: HOMEOWNER & PRO VERIFIED REVIEW REFLECTION */}
      {job.status === "completed" ? (
        canHire ? (
          existingReview ? (
            <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-base sm:text-lg font-bold text-title">
                      Your Verified Review
                    </h2>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      Published
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Submitted for {hiredPro?.name ?? "your contractor"} · {existingReview.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(existingReview.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-500" />
                    ))}
                    <span className="ml-1 text-xs font-bold text-title">
                      {existingReview.rating}.0 / 5.0
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setReviewRating(existingReview.rating);
                      setReviewBody(existingReview.body);
                      setShowReviewModal(true);
                    }}
                    className="rounded-full text-xs font-semibold border border-line hover:border-primary/40 hover:text-primary"
                  >
                    Edit Review
                  </Button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <p className="font-sans text-sm leading-relaxed text-copy">
                  {existingReview.body}
                </p>

                {existingReview.reply ? (
                  <div className="mt-3.5 pt-3 border-t border-line/60 pl-3 border-l-2 border-primary/50 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xs font-bold text-title">
                        Response from {hiredPro?.name ?? "Contractor"}
                      </span>
                      <span className="text-[11px] text-muted font-medium">Verified Pro</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">
                      {existingReview.reply}
                    </p>
                  </div>
                ) : null}
              </div>
            </Card>
          ) : (
            <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3.5">
                <div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-title">
                    Rate &amp; Review {hiredPro?.name ?? "Your Contractor"}
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Share your experience to help local homeowners and update public scores.
                  </p>
                </div>
                <span className="text-xs text-muted font-medium flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  Verified Hire
                </span>
              </div>

              <div className="mt-5 py-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isLit = currentDisplayRating >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => {
                          setReviewRating(starVal);
                          setShowReviewModal(true);
                        }}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform duration-150 hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                        title={`Rate ${starVal} Star${starVal > 1 ? "s" : ""}`}
                      >
                        <Star
                          className={`h-8 w-8 sm:h-9 sm:w-9 transition-colors ${
                            isLit ? "fill-amber-400 text-amber-500" : "fill-gray-100 text-gray-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-muted font-medium">
                  {activeSentiment.title} · Click a star to leave feedback
                </p>
              </div>
            </Card>
          )
        ) : isProView ? (
          existingReview ? (
            <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-7 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold text-title">
                      Client Review Received
                    </h2>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Verified Client
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    From {existingReview.author} · {existingReview.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(existingReview.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-500" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-title">
                    {existingReview.rating}.0 / 5.0
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <p className="font-sans text-sm leading-relaxed text-copy">
                  {existingReview.body}
                </p>

                {existingReview.reply ? (
                  <div className="rounded-xl border border-line border-l-4 border-l-primary bg-smoke/60 p-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xs font-bold text-title">
                        Your Public Response
                      </span>
                      <span className="text-[11px] text-muted">· Visible on your profile</span>
                    </div>
                    <p className="text-xs text-copy/90 leading-relaxed">
                      {existingReview.reply}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-line/80 bg-smoke/40 p-4 space-y-3">
                    <p className="font-display text-xs font-semibold uppercase tracking-wider text-muted">
                      Respond to {existingReview.author} (Public Response)
                    </p>
                    <TextArea
                      value={proReplyDraft}
                      onChange={(e) => setProReplyDraft(e.target.value)}
                      placeholder="Thank the client for their business and review…"
                      rows={2}
                    />
                    <Button
                      type="button"
                      size="sm"
                      disabled={proReplyDraft.trim().length < 3}
                      onClick={() => {
                        dispatch(
                          replyToReview({
                            id: existingReview.id,
                            reply: proReplyDraft.trim(),
                          }),
                        );
                        dispatch(
                          addNotification({
                            title: "Contractor replied to your review",
                            body: `${hiredPro?.name ?? "Your contractor"} replied to your review for ${job.title}.`,
                            href: `/account/jobs/${id}`,
                            createdAt: "Just now",
                            role: "homeowner",
                          }),
                        );
                        setProReplyDraft("");
                        setSavedMsg("Public response published to your profile!");
                      }}
                      className="rounded-full"
                    >
                      Post Response
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="rounded-[20px] border border-line/80 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-title">
                    Awaiting Homeowner Review
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    You have marked work complete and settled payment off-platform ($0 fee). Once {job.homeownerName} submits their review, it will be posted here and on your public profile.
                  </p>
                </div>
              </div>
            </Card>
          )
        ) : null
      ) : null}

      {/* MODAL 1: WORK ORDER & RECEIPT MODAL */}
      {showReceiptModal ? (
        <WorkOrderReceipt
          job={job}
          booking={booking}
          pro={hiredPro}
          completion={completion}
          changeRequests={changeRequests}
          onClose={() => setShowReceiptModal(false)}
        />
      ) : null}

      {/* MODAL 2: HOMEOWNER DIRECT SETTLEMENT MODAL */}
      {showSettleModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSettleModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-smoke text-muted hover:text-title"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-title">Confirm Work Completion</h2>
                <p className="text-xs text-muted">Confirm the work. HomeFix does not collect or refund the repair payment.</p>
              </div>
            </div>

            <div className="mt-4 rounded-[14px] bg-smoke/80 p-4 border border-line/60 space-y-2 text-xs">
              <div className="flex justify-between items-center text-title">
                <span className="text-muted font-medium">Total direct settlement:</span>
                <span className="font-display text-lg font-bold text-title">${booking?.agreedPrice}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Assigned Contractor:</span>
                <span className="font-semibold text-title">{hiredPro?.name ?? "Professional"}</span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Field label="Direct Payment Method Used">
                <NativeSelect
                  value={settlePaymentMethod}
                  onChange={(e) =>
                    setSettlePaymentMethod(
                      e.target.value as "zelle" | "card" | "cash" | "check" | "bank_transfer",
                    )
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank transfer</option>
                  <option value="mobile_banking">Mobile banking</option>
                  <option value="zelle">Zelle / instant transfer</option>
                  <option value="card">Card paid to the professional</option>
                  <option value="check">Check</option>
                  <option value="other">Other agreed method</option>
                </NativeSelect>
              </Field>
              <label className="flex items-start gap-2.5 text-xs text-copy cursor-pointer">
                <input
                  type="checkbox"
                  checked={settlePaid}
                  onChange={(e) => setSettlePaid(e.target.checked)}
                  className="mt-0.5 rounded border-line text-primary focus:ring-primary"
                />
                <span>
                  I paid the professional directly using this method. Leave unchecked if payment has not happened yet.
                </span>
              </label>

              <label className="flex items-start gap-2.5 pt-1 text-xs text-copy cursor-pointer">
                <input
                  type="checkbox"
                  checked={settleInspected}
                  onChange={(e) => setSettleInspected(e.target.checked)}
                  className="mt-0.5 rounded border-line text-primary focus:ring-primary"
                />
                <span>
                  I have inspected the finished work, tested all repaired fixtures, and confirm 100% satisfaction under the LocalHomeFix Workmanship Guarantee.
                </span>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-line/60 pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowSettleModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!settleInspected}
                onClick={() => {
                  dispatch(
                    homeownerConfirmComplete({
                      jobId: id,
                      paymentMethod: settlePaymentMethod,
                      markPaid: settlePaid,
                    }),
                  );
                  dispatch(setJobStatus({ jobId: id, status: "completed" }));
                  dispatch(
                    addNotification({
                      title: "Job completed & settled",
                      body: `${job.homeownerName} confirmed the work${settlePaid ? ` and recorded a direct ${settlePaymentMethod.replace("_", " ")} payment` : ""}. HomeFix did not collect funds.`,
                      href: `/pro/jobs/${id}`,
                      createdAt: "Just now",
                      role: "pro",
                    }),
                  );
                  setShowSettleModal(false);
                  setShowReceiptModal(true);
                  setSavedMsg("Completion confirmed! Your official receipt is ready.");
                }}
                className="rounded-full font-semibold"
              >
                Confirm &amp; Generate Receipt
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL 3: PRO COMPLETION SUMMARY MODAL */}
      {showProCompleteModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-[24px] border border-line bg-white p-6 sm:p-7 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowProCompleteModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-smoke text-muted hover:text-title"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-title">Mark Work Complete</h2>
                <p className="text-xs text-muted">Notify homeowner to inspect and confirm direct settlement</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <Field
                label="Completion Summary &amp; Notes (optional)"
                hint="Describe what was executed, tested, and cleaned"
              >
                <TextArea
                  value={proCompletionNote}
                  onChange={(e) => setProCompletionNote(e.target.value)}
                  placeholder="e.g. Replaced shutoff valve, tested supply line under full pressure for 15 mins, zero leaks detected. Cleaned and swept workspace."
                  rows={3}
                />
              </Field>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-line/60 pt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowProCompleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  dispatch(
                    proMarkComplete({
                      jobId: id,
                      completionNotes: proCompletionNote.trim() || undefined,
                    }),
                  );
                  dispatch(setJobStatus({ jobId: id, status: "awaiting_confirm" }));
                  dispatch(
                    addNotification({
                      title: "Work marked complete",
                      body: `${hiredPro?.name ?? "Contractor"} finished the job. Inspect and confirm completion to settle.`,
                      href: `/account/jobs/${id}`,
                      createdAt: "Just now",
                      role: "homeowner",
                    }),
                  );
                  setShowProCompleteModal(false);
                  setSavedMsg("Work marked complete. Waiting for homeowner inspection & confirmation.");
                }}
                className="rounded-full font-semibold"
              >
                Send Completion Notice
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODAL 4: COMPACT STANDARD REVIEW MODAL */}
      {showReviewModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-2xl border border-line bg-white shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div>
                <h2 className="font-display text-base font-bold text-title">
                  {existingReview ? "Edit Review" : `Review ${hiredPro?.name ?? "Contractor"}`}
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Verified hire · {job.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="rounded-full p-1 text-muted hover:bg-smoke hover:text-title transition"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Stars Section (Clean, centered, no outer box) */}
            <div className="text-center py-1 space-y-2">
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isLit = currentDisplayRating >= starVal;
                  return (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setReviewRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform duration-150 hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                      aria-label={`Rate ${starVal} Star${starVal > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          isLit ? "fill-amber-400 text-amber-500" : "fill-gray-100 text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-medium text-title">
                {activeSentiment.title}
              </p>
            </div>

            {/* Highlight tags */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted">What stood out?</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Punctual",
                  "Clean work",
                  "Fair price",
                  "Great quality",
                  "Friendly",
                ].map((tag) => {
                  const active = selectedReviewTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setSelectedReviewTags((prev) =>
                          active ? prev.filter((t) => t !== tag) : [...prev, tag],
                        )
                      }
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                        active
                          ? "bg-title text-white"
                          : "bg-smoke text-muted hover:text-title"
                      }`}
                    >
                      {active ? "✓ " : ""}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Written review field */}
            <div className="space-y-1">
              <TextArea
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Write a brief review (optional)..."
                rows={3}
                className="text-xs sm:text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-line/60">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowReviewModal(false)}
                className="rounded-full text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveReview}
                className="rounded-full text-xs font-semibold"
              >
                {existingReview ? "Save Changes" : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

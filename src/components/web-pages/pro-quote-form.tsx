"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, NativeSelect, TextArea, TextField } from "@/components/ui/field";
import { useRoleAccess } from "@/hooks/use-role-access";
import { addQuote, acceptCounter, setOfferStatus } from "@/redux/slices/marketplaceSlice";
import { addNotification, setJobStatus } from "@/redux/slices/featuresSlice";
import { selectJob, selectQuotesForJob } from "@/lib/marketplace";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { cn } from "@/lib/cn";
import type { QuotePriceType } from "@/types";

function getISODatePlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatDisplayDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const PAYMENT_METHOD_OPTIONS = [
  { id: "cash", label: "Cash" },
  { id: "zelle", label: "Zelle" },
  { id: "card", label: "Card / Tap to Pay" },
  { id: "bank_transfer", label: "Bank Transfer" },
  { id: "check", label: "Check" },
  { id: "mobile_pay", label: "Venmo / Mobile" },
] as const;

const PAYMENT_SCHEDULE_OPTIONS = [
  "100% Upon Satisfactory Completion (Zero platform fee)",
  "50% Upfront Deposit / 50% Upon Completion",
  "Diagnostic Visit Fee upfront + Balance Upon Completion",
  "Net 15 Invoiced After Work Completion",
];

const NOTE_SUGGESTIONS = [
  "Clear 3ft workspace around repair area",
  "Brief water main shutoff required (~15 min)",
  "Please secure pets before arrival",
  "No advance deposit required",
];

export function ProQuoteForm({
  jobId,
  onPass,
}: {
  jobId: string;
  onPass?: () => void;
}) {
  const dispatch = useAppDispatch();
  const { access } = useRoleAccess();
  const job = useAppSelector((state) => selectJob(state, jobId));
  const hiredQuoteId = useAppSelector((state) => state.marketplace.hiredByJob[jobId]);
  const quotes = useAppSelector((state) => selectQuotesForJob(state, jobId));
  const myQuote = quotes.find((q) => q.proId === "pro-1");
  const myCounters = quotes.filter((q) => q.proId === "pro-1" && q.status === "countered");
  const jobClosed = Boolean(hiredQuoteId) || ["hired", "scheduled", "cancelled", "completed", "disputed"].includes(job?.status ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => getISODatePlus(1));
  const [selectedWindow, setSelectedWindow] = useState("10:00 AM – 12:00 PM (Late Morning)");
  const [duration, setDuration] = useState("1–2 hours");
  const [acceptedMethods, setAcceptedMethods] = useState<string[]>(["cash", "zelle", "card"]);
  const [paymentSchedule, setPaymentSchedule] = useState("100% Upon Satisfactory Completion (Zero platform fee)");
  const [paymentNote, setPaymentNote] = useState("");
  const [contractorNotes, setContractorNotes] = useState("");
  const locked = !access.canSubmitQuote;

  function toggleMethod(id: string) {
    setAcceptedMethods((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((m) => m !== id)
          : prev
        : [...prev, id],
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) {
      setError(access.blockedReason ?? "Membership required to quote.");
      return;
    }
    const data = new FormData(event.currentTarget);
    const amount = Number(data.get("amount"));
    const scope = String(data.get("scope") ?? "").trim();
    const availability = String(data.get("availability") ?? "").trim();
    const exclusions = String(data.get("exclusions") ?? "").trim();
    const estimatedDuration = String(data.get("duration") ?? "").trim();
    const proposedSchedule = String(data.get("schedule") ?? "").trim();
    const expiresAt = String(data.get("expires") ?? "").trim();
    const materialsIncluded = data.get("materials") === "yes";

    const methodLabels = acceptedMethods.map((m) => {
      const found = PAYMENT_METHOD_OPTIONS.find((opt) => opt.id === m);
      return found ? found.label : m;
    });
    const compiledPaymentTerms = `${paymentSchedule} · Accepts: ${methodLabels.join(", ")}${
      paymentNote.trim() ? ` · Note: ${paymentNote.trim()}` : ""
    }`;

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (scope.length < 8) {
      setError("Describe what the quote covers.");
      return;
    }
    if (!availability) {
      setError("Add your availability.");
      return;
    }
    setError("");
    dispatch(
      addQuote({
        jobId,
        proId: "pro-1",
        priceType: String(data.get("priceType") ?? "estimate") as QuotePriceType,
        amount,
        scope,
        exclusions: exclusions || undefined,
        availability,
        materialsIncluded,
        estimatedDuration: estimatedDuration || undefined,
        proposedSchedule: proposedSchedule || undefined,
        expiresAt: expiresAt || undefined,
        paymentTerms: compiledPaymentTerms,
        notes: contractorNotes.trim() || undefined,
        warranty: String(data.get("warranty") ?? "").trim() || undefined,
      }),
    );
    dispatch(setJobStatus({ jobId, status: "quotes_in" }));
    dispatch(
      addNotification({
        title: "New offer",
        body: "A professional sent a quote on your request.",
        href: `/account/jobs/${jobId}`,
        createdAt: "Just now",
        role: "homeowner",
      }),
    );
    setSaved(true);
    event.currentTarget.reset();
  }

  return (
    <div className="space-y-4">
      {myCounters.map((quote) => (
        <Card key={quote.id}>
          <h2 className="text-lg">Homeowner counter</h2>
          <p className="mt-2 text-sm text-copy">
            They proposed <span className="font-semibold text-title">${quote.counterAmount}</span>
            {quote.counterNote ? ` — “${quote.counterNote}”` : ""}. Your original was ${quote.amount}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                dispatch(acceptCounter({ quoteId: quote.id, jobId }));
                dispatch(setJobStatus({ jobId, status: "hired" }));
                dispatch(
                  addNotification({
                    title: "Counter accepted",
                    body: "Confirm a schedule on the job to finish booking.",
                    href: `/account/jobs/${jobId}`,
                    createdAt: "Just now",
                    role: "homeowner",
                  }),
                );
              }}
            >
              Accept counter
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => dispatch(setOfferStatus({ quoteId: quote.id, status: "rejected" }))}
            >
              Decline
            </Button>
          </div>
        </Card>
      ))}

      <Card>
        <h2 className="text-xl">Send a quotation</h2>
        {myQuote ? (
          <p className="mt-2 text-sm text-copy">
            Your quotation (${myQuote.amount}) is attached to this job. The homeowner must accept it before a booking is confirmed.
          </p>
        ) : jobClosed ? (
          <p className="mt-2 text-sm text-copy">This job is no longer open for new quotations.</p>
        ) : locked ? (
          <p className="mt-2 text-sm text-copy">
            {access.blockedReason}{" "}
            <Link href="/pro/pricing" className="font-semibold text-primary">
              Membership
            </Link>
          </p>
        ) : (
          <p className="mt-2 text-sm text-copy">
            Price this request from their answers above. Homeowner pays you directly if they hire.
          </p>
        )}
        {myQuote || jobClosed ? null : (
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Price type">
              <NativeSelect name="priceType" defaultValue="estimate" disabled={locked}>
                <option value="estimate">Estimate</option>
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
                <option value="time_and_materials">Time & materials</option>
              </NativeSelect>
            </Field>
            <Field label="Total / rate ($)">
              <TextField name="amount" type="number" min={1} step={1} placeholder="180" required disabled={locked} />
            </Field>
          </div>
          <Field label="Work scope">
            <TextArea name="scope" placeholder="What you will do on site." required disabled={locked} />
          </Field>
          <Field label="Exclusions (optional)">
            <TextField name="exclusions" placeholder="What is not included" disabled={locked} />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Materials included?">
              <NativeSelect name="materials" defaultValue="yes" disabled={locked}>
                <option value="yes">Yes — all parts &amp; fittings included</option>
                <option value="no">No — labor only (materials billed separately)</option>
              </NativeSelect>
            </Field>
            <div>
              <Field label="Estimated duration">
                <TextField
                  name="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="1–2 hours"
                  disabled={locked}
                  className="rounded-xl font-medium"
                />
              </Field>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {["1–2 hours", "Half day (2–4 hrs)", "Full day (6–8 hrs)"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all cursor-pointer",
                      duration === d
                        ? "border-primary bg-primary text-white"
                        : "border-line/70 bg-white text-muted hover:border-primary/50",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Dynamic Calendar & Clock Arrival Window Module */}
          <div className="rounded-2xl border border-line/80 bg-smoke/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-title flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Proposed Arrival Schedule
              </span>
              <span className="text-[11px] text-muted">Pick earliest date &amp; 2-hr window</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Earliest Available Date">
                <TextField
                  type="date"
                  min={getISODatePlus(0)}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  disabled={locked}
                  className="rounded-xl font-medium"
                />
              </Field>

              <Field label="Arrival Time Window">
                <NativeSelect
                  value={selectedWindow}
                  onChange={(e) => setSelectedWindow(e.target.value)}
                  disabled={locked}
                  className="rounded-xl font-medium"
                >
                  <option value="8:00 AM – 10:00 AM (Early Morning)">8:00 AM – 10:00 AM (Early Morning)</option>
                  <option value="10:00 AM – 12:00 PM (Late Morning)">10:00 AM – 12:00 PM (Late Morning)</option>
                  <option value="12:00 PM – 2:00 PM (Early Afternoon)">12:00 PM – 2:00 PM (Early Afternoon)</option>
                  <option value="2:00 PM – 4:00 PM (Late Afternoon)">2:00 PM – 4:00 PM (Late Afternoon)</option>
                  <option value="4:00 PM – 6:00 PM (Evening)">4:00 PM – 6:00 PM (Evening)</option>
                  <option value="Flexible All-Day (8:00 AM – 5:00 PM)">Flexible All-Day (8:00 AM – 5:00 PM)</option>
                </NativeSelect>
              </Field>
            </div>

            {/* Quick Date Shortcut Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-muted mr-1">Quick Dates:</span>
              {[
                { label: "Tomorrow", days: 1 },
                { label: "In 2 Days", days: 2 },
                { label: "In 3 Days", days: 3 },
                { label: "Next Week", days: 7 },
              ].map((chip) => {
                const chipDate = getISODatePlus(chip.days);
                const active = selectedDate === chipDate;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setSelectedDate(chipDate)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer",
                      active
                        ? "border-primary bg-primary text-white shadow-2xs"
                        : "border-line/80 bg-white text-muted hover:border-primary/50 hover:text-title",
                    )}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Live Schedule Confirmation Badge */}
            {selectedDate && (
              <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/[0.04] p-2.5 text-xs">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted">
                  Proposed Arrival:{" "}
                  <strong className="text-title font-semibold">
                    {formatDisplayDate(selectedDate)}
                  </strong>{" "}
                  between <strong className="text-primary font-semibold">{selectedWindow}</strong>
                </span>
              </div>
            )}

            {/* Hidden inputs to feed standard form data pipeline */}
            <input type="hidden" name="availability" value={`${formatDisplayDate(selectedDate)} · ${selectedWindow}`} />
            <input type="hidden" name="schedule" value={`${selectedDate} ${selectedWindow}`} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Offer expires">
              <TextField
                name="expires"
                type="date"
                min={getISODatePlus(1)}
                defaultValue={getISODatePlus(7)}
                disabled={locked}
              />
            </Field>
            <Field label="Warranty (optional)">
              <TextField name="warranty" placeholder="90-day workmanship" disabled={locked} />
            </Field>
          </div>
          {/* Direct Off-Platform Payment Terms */}
          <div className="space-y-3 rounded-2xl border border-line/80 bg-smoke/40 p-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-title">
                Accepted Payment Methods (0% HomeFix Fee)
              </p>
              <p className="mt-0.5 text-xs text-muted">
                HomeFix is 100% commission-free. Choose which off-platform direct methods you accept from the homeowner.
              </p>
            </div>

            {/* Multi-select chips */}
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHOD_OPTIONS.map((method) => {
                const isSelected = acceptedMethods.includes(method.id);
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => toggleMethod(method.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs"
                        : "border-line/80 bg-white text-muted hover:border-line hover:text-title",
                    )}
                  >
                    <span>{isSelected ? "✓" : "+"}</span>
                    {method.label}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <Field label="Payment Schedule">
                <NativeSelect
                  value={paymentSchedule}
                  onChange={(e) => setPaymentSchedule(e.target.value)}
                >
                  {PAYMENT_SCHEDULE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </NativeSelect>
              </Field>

              <Field label="Payment Details / Handle (Optional)">
                <TextField
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="e.g. Zelle: (512) 555-0199 or Cash on-site"
                />
              </Field>
            </div>
          </div>

          {/* Additional Contractor Notes & Site Prep */}
          <div className="space-y-2">
            <Field label="Additional Contractor Notes & Site Access (Optional)">
              <TextArea
                rows={2}
                value={contractorNotes}
                onChange={(e) => setContractorNotes(e.target.value)}
                placeholder="e.g. Please clear workspace around the repair area. Main water line shutoff will be needed for approx 15 minutes."
              />
            </Field>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-muted">Suggestions:</span>
              {NOTE_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setContractorNotes((prev) =>
                      prev ? `${prev}. ${suggestion}.` : `${suggestion}.`,
                    );
                  }}
                  className="rounded-full border border-line/70 bg-white px-2.5 py-0.5 text-[11px] font-medium text-muted hover:border-primary/50 hover:text-title transition-colors cursor-pointer"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          {saved ? <p className="text-sm text-success">Quote sent.</p> : null}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" disabled={locked}>
              {locked ? "Locked" : "Send quotation"}
            </Button>
            {onPass && !saved && (
              <Button type="button" variant="ghost" onClick={onPass} className="text-muted hover:text-title">
                Pass on this request
              </Button>
            )}
          </div>
        </form>
        )}
      </Card>
    </div>
  );
}

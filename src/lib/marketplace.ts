import { jobs as seedJobs, quotes as seedQuotes } from "@/Mockdata";
import type { Job, JobStatus, Quote } from "@/types";

export const selectAllJobs = (state?: any): Job[] => {
  const extraJobs = state?.marketplace?.extraJobs ?? [];
  const hired = state?.marketplace?.hiredByJob ?? {};
  const overrides = state?.features?.jobStatusOverride ?? {};
  const completions = state?.marketplace?.completions ?? {};
  const bookings = state?.marketplace?.bookings ?? {};

  return [...extraJobs, ...seedJobs].map((job) => {
    let status: JobStatus = overrides[job.id] ?? job.status;

    if (status === "cancelled" || status === "disputed" || status === "completed") {
      return { ...job, status };
    }

    const completion = completions[job.id];
    if (completion?.homeownerConfirmedAt) {
      status = "completed";
    } else if (completion?.proMarkedAt) {
      status = "awaiting_confirm";
    } else if (bookings[job.id]?.status === "confirmed" && hired[job.id]) {
      if (status === "hired" || status === "getting_quotes" || status === "quotes_in" || status === "active") {
        status = "scheduled";
      }
    } else if (hired[job.id]) {
      if (status !== "scheduled" && status !== "in_progress" && status !== "awaiting_confirm") {
        status = "hired";
      }
    }

    return { ...job, status };
  });
};

export function selectJob(state: any, id: string) {
  return selectAllJobs(state).find((job) => job.id === id);
}

export const selectAllQuotes = (state?: any): Quote[] => {
  const extraQuotes: Quote[] = state?.marketplace?.extraQuotes ?? [];
  const overrides: Record<string, Partial<Quote>> = state?.marketplace?.quoteOverrides ?? {};

  const merge = (quote: Quote): Quote => {
    const patch = overrides[quote.id] ?? {};
    return {
      ...quote,
      ...patch,
      status: patch.status ?? quote.status ?? "pending",
    };
  };
  return [...extraQuotes.map(merge), ...seedQuotes.map(merge)];
};

export function selectQuotesForJob(state: any, jobId: string) {
  return selectAllQuotes(state).filter((quote) => quote.jobId === jobId);
}

export function selectJobsForHomeowner(state: any, name: string) {
  if (!name || name === "Homeowner" || name === "Maya Chen") {
    return selectAllJobs(state).filter(
      (job) => job.homeownerName === "Maya Chen" || job.homeownerName === "Homeowner"
    );
  }
  return selectAllJobs(state).filter(
    (job) => job.homeownerName === name || job.homeownerName === "Maya Chen"
  );
}

export function selectBooking(state: any, jobId: string) {
  return state?.marketplace?.bookings?.[jobId];
}

export function selectChangeRequests(state: any, jobId: string) {
  return (state?.marketplace?.changeRequests ?? []).filter((cr: any) => cr.jobId === jobId);
}

export function selectCompletion(state: any, jobId: string) {
  return state?.marketplace?.completions?.[jobId];
}

export function selectHiredQuoteId(state: any, jobId: string) {
  return state?.marketplace?.hiredByJob?.[jobId];
}

const TIMING_TAG = /\[Preferred Timing:\s*([^\]]+)\]/gi;

export function splitJobDescription(description: string) {
  const timing = [...description.matchAll(TIMING_TAG)].at(-1)?.[1]?.trim();
  const text = description.replace(TIMING_TAG, "").replace(/\n{2,}/g, "\n").trim();
  return { text, timing };
}

export function jobCardSummary(job: Job) {
  const { text } = splitJobDescription(job.description);
  if (job.intakeAnswers && job.intakeAnswers.length > 0) {
    const answers = job.intakeAnswers
      .map((a) => a.value)
      .filter((v) => v && v.toLowerCase() !== "flexible" && v.toLowerCase() !== "asap" && v.toLowerCase() !== "pro_bring");
    if (answers.length > 0) {
      return answers.slice(0, 3).join(" · ");
    }
  }
  if (text.includes("?")) {
    const qaRegex = /(?:^|\.\s*)[^?]+\?\s*([^?.]+)/g;
    const matches = [...text.matchAll(qaRegex)].map((m) => m[1]?.trim()).filter(Boolean);
    if (matches.length > 0) {
      return matches.slice(0, 3).join(" · ");
    }
  }
  const firstLabel = job.intakeAnswers?.[0]?.label;
  if (firstLabel && text.includes(firstLabel)) {
    const before = text.split(firstLabel)[0].replace(/[. ]+$/, "").trim();
    if (before) return before;
  }
  return text;
}

export function jobRequestFacts(job: Job) {
  const { timing: taggedTiming } = splitJobDescription(job.description);
  const byId = (id: string) => job.intakeAnswers?.find((item) => item.id === id)?.value;
  const byLabel = (pattern: RegExp) =>
    job.intakeAnswers?.find((item) => pattern.test(item.label))?.value;

  const facts: { label: string; value: string }[] = [];
  const timing = byId("timing") ?? byLabel(/timing/i) ?? taggedTiming;
  const materials = byId("materials") ?? byLabel(/part|material/i);
  if (timing) facts.push({ label: "Timing", value: timing });
  if (materials) facts.push({ label: "Materials", value: materials });
  if (job.propertyType) {
    const labels: Record<string, string> = {
      single_family: "Single-family",
      condo: "Condo",
      townhome: "Townhome",
      apartment: "Apartment",
      commercial: "Commercial",
      other: "Other",
    };
    facts.push({ label: "Property", value: labels[job.propertyType] ?? job.propertyType });
  }
  if (job.budget) facts.push({ label: "Budget", value: job.budget });
  return facts;
}

export const paymentMethodLabels: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank transfer",
  mobile_banking: "Mobile banking",
  zelle: "Zelle / instant transfer",
  card: "Card reader (paid to the pro)",
  check: "Check",
  other: "Other agreed method",
};

export function selectProJobsGrouped(state?: any, proId: string = "pro-1") {
  const allJobs = selectAllJobs(state);
  const hiredByJob = state?.marketplace?.hiredByJob ?? {};
  const bookings = state?.marketplace?.bookings ?? {};
  const quotes = selectAllQuotes(state);
  const invitedPros = state?.features?.invitedPros ?? {};
  const leadActions = state?.features?.leadActions ?? {};

  // 1. Direct 1-on-1 inquiries specifically directed to this pro
  const directInquiries = allJobs.filter((job) => {
    const isDirect =
      job.requestedProId === proId ||
      (job.visibility === "direct" && (job.requestedProId === proId || invitedPros[job.id]?.includes(proId)));
    if (!isDirect) return false;
    const closed = ["completed", "cancelled", "disputed"].includes(job.status);
    if (closed) return false;
    const hiredId = hiredByJob[job.id];
    if (hiredId) {
      const q = quotes.find((item) => item.id === hiredId);
      if (q?.proId === proId) return false;
    }
    return leadActions[job.id] !== "declined";
  });

  // 2. Active & upcoming jobs where this pro is the contracted provider
  const activeJobs = allJobs.filter((job) => {
    const hiredId = hiredByJob[job.id];
    const booking = bookings[job.id];
    const isThisProHired =
      (hiredId && quotes.find((q) => q.id === hiredId)?.proId === proId) ||
      booking?.proId === proId;
    if (!isThisProHired) return false;
    return ["hired", "scheduled", "en_route", "in_progress", "awaiting_confirm"].includes(job.status);
  });

  // 3. Completed jobs where this pro was the provider
  const completedJobs = allJobs.filter((job) => {
    const hiredId = hiredByJob[job.id];
    const booking = bookings[job.id];
    const isThisProHired =
      (hiredId && quotes.find((q) => q.id === hiredId)?.proId === proId) ||
      booking?.proId === proId;
    return isThisProHired && job.status === "completed";
  });

  // 4. Open marketplace leads (not direct) open for proposal
  const marketplaceLeads = allJobs.filter((job) => {
    if (job.visibility === "direct" || job.requestedProId) return false;
    const closed = [
      "completed",
      "cancelled",
      "hired",
      "scheduled",
      "en_route",
      "in_progress",
      "awaiting_confirm",
      "disputed",
      "draft",
    ].includes(job.status);
    if (closed) return false;
    return leadActions[job.id] !== "declined";
  });

  // 5. Jobs where this pro has submitted a quote
  const quotedJobs = allJobs.filter((job) => {
    return quotes.some((q) => q.jobId === job.id && q.proId === proId);
  });

  return {
    directInquiries,
    activeJobs,
    completedJobs,
    marketplaceLeads,
    quotedJobs,
    totalActive: activeJobs.length,
    totalDirect: directInquiries.length,
    totalLeads: marketplaceLeads.length,
    totalCompleted: completedJobs.length,
  };
}

export function selectHomeownerJobsGrouped(state?: any, homeownerName: string = "Maya Chen") {
  const mine = selectJobsForHomeowner(state, homeownerName);
  const active = mine.filter((j) =>
    ["hired", "scheduled", "en_route", "in_progress", "awaiting_confirm"].includes(j.status)
  );
  const awaitingQuotes = mine.filter((j) =>
    ["draft", "active", "getting_quotes", "quotes_in"].includes(j.status)
  );
  const completed = mine.filter((j) => j.status === "completed");
  const cancelled = mine.filter((j) => j.status === "cancelled" || j.status === "disputed");

  return {
    all: mine,
    active,
    awaitingQuotes,
    completed,
    cancelled,
  };
}

export function selectHomeownerBookingsGrouped(state?: any, homeownerName: string = "Maya Chen") {
  const mine = selectJobsForHomeowner(state, homeownerName);
  const booked = mine.filter((j) =>
    ["hired", "scheduled", "en_route", "in_progress", "awaiting_confirm", "completed", "cancelled", "disputed"].includes(j.status)
  );
  const upcoming = booked.filter((j) => ["hired", "scheduled"].includes(j.status));
  const inProgress = booked.filter((j) => ["en_route", "in_progress", "awaiting_confirm"].includes(j.status));
  const history = booked.filter((j) => ["completed", "cancelled", "disputed"].includes(j.status));

  return {
    all: booked,
    upcoming,
    inProgress,
    history,
    totalUpcoming: upcoming.length,
    totalInProgress: inProgress.length,
    totalHistory: history.length,
  };
}

export function selectHomeownerRequests(state?: any, homeownerName: string = "Maya Chen") {
  const mine = selectJobsForHomeowner(state, homeownerName);
  return mine.filter((j) =>
    ["draft", "active", "getting_quotes", "quotes_in"].includes(j.status)
  );
}


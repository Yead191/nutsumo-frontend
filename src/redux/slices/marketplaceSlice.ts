import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Booking,
  ChangeRequest,
  DirectPaymentMethod,
  Job,
  JobCompletion,
  JobVisibility,
  OfferStatus,
  PropertyType,
  Quote,
  QuotePriceType,
  Urgency,
} from "@/types";

export type VerifyKey = "identity" | "screening" | "license" | "insurance";
export type VerifyStatus = "idle" | "started" | "done";

const STORAGE_KEY = "lhf-marketplace-v2";

interface MarketplaceState {
  extraJobs: Job[];
  extraQuotes: Quote[];
  quoteOverrides: Record<string, Partial<Quote>>;
  hiredByJob: Record<string, string>;
  bookings: Record<string, Booking>;
  changeRequests: ChangeRequest[];
  completions: Record<string, JobCompletion>;
  membershipActive: boolean;
  verification: Record<VerifyKey, VerifyStatus>;
  hydrated: boolean;
}

export const defaultSeedHiredByJob: Record<string, string> = {
  "job-6": "quote-6",
  "job-7": "quote-7",
  "job-8": "quote-8",
  "job-9": "quote-9",
  "job-10": "quote-10",
  "job-11": "quote-11",
};

export const defaultSeedBookings: Record<string, Booking> = {
  "job-6": {
    jobId: "job-6",
    quoteId: "quote-6",
    proId: "pro-1",
    agreedPrice: 340,
    scheduledDate: "Tomorrow",
    scheduledTime: "10:00 AM – 12:00 PM (Late Morning)",
    arrivalWindow: "10:00 AM – 12:00 PM (Late Morning)",
    scopeSnapshot: "Disconnect old vanity, install new 36-inch vanity, mount dual-handle chrome faucet, test pop-up drain.",
    acceptedAt: "2026-10-24T14:30:00Z",
    status: "confirmed",
    paymentArrangement: "zelle",
  },
  "job-7": {
    jobId: "job-7",
    quoteId: "quote-7",
    proId: "pro-1",
    agreedPrice: 195,
    scheduledDate: "Today",
    scheduledTime: "8:00 AM – 10:00 AM (Early Morning)",
    arrivalWindow: "8:00 AM – 10:00 AM (Early Morning)",
    scopeSnapshot: "Inspect cracked washer discharge P-trap, replace with schedule 40 PVC, water test under cycle.",
    acceptedAt: "2026-10-25T08:15:00Z",
    status: "confirmed",
    paymentArrangement: "cash",
  },
  "job-8": {
    jobId: "job-8",
    quoteId: "quote-8",
    proId: "pro-1",
    agreedPrice: 260,
    scheduledDate: "Today",
    scheduledTime: "1:00 PM – 3:00 PM (Early Afternoon)",
    arrivalWindow: "1:00 PM – 3:00 PM (Early Afternoon)",
    scopeSnapshot: "Unjam InSinkErator flywheel, replace inner gasket seal, snake drain line 25 ft.",
    acceptedAt: "2026-10-25T11:00:00Z",
    status: "confirmed",
    paymentArrangement: "card",
  },
  "job-9": {
    jobId: "job-9",
    quoteId: "quote-9",
    proId: "pro-1",
    agreedPrice: 220,
    scheduledDate: "Oct 24, 2026",
    scheduledTime: "2:00 PM – 4:00 PM",
    arrivalWindow: "2:00 PM – 4:00 PM",
    scopeSnapshot: "Replace leaking outdoor sillcock with frost-free quarter-turn valve and vacuum breaker.",
    acceptedAt: "2026-10-23T16:00:00Z",
    status: "confirmed",
    paymentArrangement: "check",
  },
  "job-10": {
    jobId: "job-10",
    quoteId: "quote-10",
    proId: "pro-1",
    agreedPrice: 480,
    scheduledDate: "Oct 18, 2026",
    scheduledTime: "9:00 AM – 11:00 AM",
    arrivalWindow: "9:00 AM – 11:00 AM",
    scopeSnapshot: "Excavate access to main line inlet, solder new 1-inch brass PRV, calibrate water pressure to 55 PSI.",
    acceptedAt: "2026-10-17T12:00:00Z",
    status: "confirmed",
    paymentArrangement: "zelle",
    paidAt: "2026-10-18T11:45:00Z",
  },
  "job-11": {
    jobId: "job-11",
    quoteId: "quote-11",
    proId: "pro-1",
    agreedPrice: 215,
    scheduledDate: "Oct 22, 2026",
    scheduledTime: "11:00 AM – 1:00 PM",
    arrivalWindow: "11:00 AM – 1:00 PM",
    scopeSnapshot: "Extract corroded Moen Positemp shower cartridge, clean brass housing, install OEM replacement.",
    acceptedAt: "2026-10-21T10:00:00Z",
    status: "confirmed",
    paymentArrangement: "cash",
    paidAt: "2026-10-22T12:30:00Z",
  },
};

export const defaultSeedCompletions: Record<string, JobCompletion> = {
  "job-9": {
    jobId: "job-9",
    proMarkedAt: "35 minutes ago",
    completionNotes: "Replaced freeze-proof sillcock valve with quarter-turn ball valve and pressure tested at 65 PSI. Area cleaned.",
  },
  "job-10": {
    jobId: "job-10",
    proMarkedAt: "Oct 18, 2026 · 11:30 AM",
    completionNotes: "New brass PRV installed and dialed to 55 PSI static pressure. Soldered connections leak tested.",
    homeownerConfirmedAt: "Oct 18, 2026 · 11:45 AM",
    paymentMethod: "zelle",
    receiptNumber: "REC-2026-JOB10",
  },
  "job-11": {
    jobId: "job-11",
    proMarkedAt: "Oct 22, 2026 · 12:15 PM",
    completionNotes: "Cartridge replaced with OEM Moen 1222. Hot/cold balancing spool verified, zero drip under pressure.",
    homeownerConfirmedAt: "Oct 22, 2026 · 12:30 PM",
    paymentMethod: "cash",
    receiptNumber: "REC-2026-JOB11",
  },
};

export const defaultSeedChangeRequests: ChangeRequest[] = [
  {
    id: "cr-seed-1",
    jobId: "job-8",
    amount: 65,
    reason: "Corroded brass tailpiece fitting cracked during disassembly; needs new heavy-gauge brass slip joint.",
    proposedBy: "pro",
    proAcknowledged: true,
    homeownerAcknowledged: false,
    status: "pending",
    createdAt: "2026-10-25T11:45:00Z",
  },
];

const initialState: MarketplaceState = {
  extraJobs: [],
  extraQuotes: [],
  quoteOverrides: {},
  hiredByJob: defaultSeedHiredByJob,
  bookings: defaultSeedBookings,
  changeRequests: defaultSeedChangeRequests,
  completions: defaultSeedCompletions,
  membershipActive: true,
  verification: {
    identity: "idle",
    screening: "idle",
    license: "idle",
    insurance: "idle",
  },
  hydrated: false,
};

function persist(state: MarketplaceState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        extraJobs: state.extraJobs,
        extraQuotes: state.extraQuotes,
        quoteOverrides: state.quoteOverrides,
        hiredByJob: state.hiredByJob,
        bookings: state.bookings,
        changeRequests: state.changeRequests,
        completions: state.completions,
        membershipActive: state.membershipActive,
        verification: state.verification,
      }),
    );
  } catch {
    /* ignore quota */
  }
}

function patchQuote(state: MarketplaceState, quoteId: string, patch: Partial<Quote>) {
  const local = state.extraQuotes.find((q) => q.id === quoteId);
  if (local) {
    Object.assign(local, patch);
    return;
  }
  state.quoteOverrides[quoteId] = { ...(state.quoteOverrides[quoteId] ?? {}), ...patch };
}

const marketplaceSlice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    hydrateMarketplace(state) {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<MarketplaceState>;
          state.extraJobs = saved.extraJobs ?? [];
          state.extraQuotes = saved.extraQuotes ?? [];
          state.quoteOverrides = saved.quoteOverrides ?? {};
          state.hiredByJob = { ...defaultSeedHiredByJob, ...(saved.hiredByJob ?? {}) };
          state.bookings = { ...defaultSeedBookings, ...(saved.bookings ?? {}) };
          state.changeRequests =
            saved.changeRequests && saved.changeRequests.length
              ? saved.changeRequests
              : defaultSeedChangeRequests;
          state.completions = { ...defaultSeedCompletions, ...(saved.completions ?? {}) };
          state.membershipActive = saved.membershipActive !== undefined ? Boolean(saved.membershipActive) : true;
          state.verification = saved.verification ?? state.verification;
        }
      } catch {
        /* ignore */
      }
      state.hydrated = true;
    },
    addJob(
      state,
      action: PayloadAction<{
        id?: string;
        title: string;
        categorySlug: string;
        description: string;
        zip: string;
        city?: string;
        state?: string;
        urgency: Urgency;
        budget?: string;
        propertyType?: PropertyType | "";
        homeownerName: string;
        asDraft?: boolean;
        intakeAnswers?: Job["intakeAnswers"];
        requestedProId?: string;
        visibility?: JobVisibility;
        photos?: string[];
        matchedProIds?: string[];
      }>,
    ) {
      const payload = action.payload;
      const job: Job = {
        id: payload.id ?? `job-local-${Date.now()}`,
        title: payload.title,
        categorySlug: payload.categorySlug,
        description: payload.description,
        zip: payload.zip,
        city: payload.city || "Local Area",
        state: payload.state || "TX",
        urgency: payload.urgency,
        budget: payload.budget || undefined,
        propertyType: payload.propertyType ? payload.propertyType : undefined,
        status: payload.asDraft ? "draft" : "getting_quotes",
        postedAt: new Date().toISOString().slice(0, 10),
        homeownerName: payload.homeownerName,
        intakeAnswers: payload.intakeAnswers,
        requestedProId: payload.requestedProId,
        visibility: payload.visibility ?? (payload.requestedProId ? "direct" : "open"),
        photos: payload.photos,
        matchedProIds: payload.matchedProIds,
      };
      state.extraJobs.unshift(job);
      persist(state);
    },
    addQuote(
      state,
      action: PayloadAction<{
        jobId: string;
        proId: string;
        priceType: QuotePriceType;
        amount: number;
        priceMax?: number;
        scope: string;
        exclusions?: string;
        availability: string;
        warranty?: string;
        materialsIncluded?: boolean;
        estimatedDuration?: string;
        proposedSchedule?: string;
        expiresAt?: string;
        paymentTerms?: string;
        notes?: string;
      }>,
    ) {
      const payload = action.payload;
      state.extraQuotes.unshift({
        id: `quote-local-${Date.now()}-${state.extraQuotes.length}`,
        jobId: payload.jobId,
        proId: payload.proId,
        priceType: payload.priceType,
        amount: payload.amount,
        priceMax: payload.priceMax,
        scope: payload.scope,
        exclusions: payload.exclusions,
        availability: payload.availability,
        warranty: payload.warranty,
        materialsIncluded: payload.materialsIncluded,
        estimatedDuration: payload.estimatedDuration,
        proposedSchedule: payload.proposedSchedule,
        expiresAt: payload.expiresAt,
        paymentTerms: payload.paymentTerms,
        notes: payload.notes,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      persist(state);
    },
    /**
     * Accept one quotation: record agreed job value, open a single booking,
     * and decline every other open quotation on the same job.
     */
    hireQuote(
      state,
      action: PayloadAction<{
        jobId: string;
        quoteId: string;
        proId?: string;
        agreedPrice?: number;
        scopeSnapshot?: string;
        homeownerName?: string;
        paymentTerms?: string;
        siblingQuoteIds?: string[];
      }>,
    ) {
      const { jobId, quoteId } = action.payload;
      if (state.hiredByJob[jobId] && state.hiredByJob[jobId] !== quoteId) {
        return;
      }

      const local = state.extraQuotes.find((q) => q.id === quoteId);
      const override = state.quoteOverrides[quoteId];
      const proId = action.payload.proId ?? local?.proId ?? "";
      const agreedPrice = action.payload.agreedPrice ?? local?.amount ?? override?.amount ?? 0;
      const scopeSnapshot = action.payload.scopeSnapshot ?? local?.scope ?? override?.scope ?? "";
      const paymentTerms = action.payload.paymentTerms ?? local?.paymentTerms ?? override?.paymentTerms;

      state.hiredByJob[jobId] = quoteId;
      patchQuote(state, quoteId, { status: "accepted" });

      state.extraQuotes.forEach((q) => {
        if (q.jobId === jobId && q.id !== quoteId && (q.status === "pending" || q.status === "countered")) {
          q.status = "rejected";
        }
      });
      (action.payload.siblingQuoteIds ?? []).forEach((id) => {
        if (id === quoteId) return;
        const current = state.quoteOverrides[id]?.status;
        const extra = state.extraQuotes.find((q) => q.id === id);
        if (extra) {
          if (extra.status === "pending" || extra.status === "countered") extra.status = "rejected";
          return;
        }
        if (!current || current === "pending" || current === "countered") {
          patchQuote(state, id, { status: "rejected" });
        }
      });

      const acceptedAt = new Date().toISOString();
      const existing = state.bookings[jobId];
      if (!existing) {
        state.bookings[jobId] = {
          jobId,
          quoteId,
          proId,
          homeownerName: action.payload.homeownerName,
          agreedPrice,
          scheduledDate: "",
          scheduledTime: "",
          scopeSnapshot,
          status: "pending_schedule",
          acceptedAt,
          paymentTerms,
          priceHistory: [
            {
              id: `pv-${Date.now()}`,
              previousAmount: agreedPrice,
              newAmount: agreedPrice,
              reason: "Accepted quotation",
              changedAt: acceptedAt,
              homeownerAcknowledgedAt: acceptedAt,
              proAcknowledgedAt: acceptedAt,
            },
          ],
        };
      }

      persist(state);
    },
    rejectSiblingOffers(
      state,
      action: PayloadAction<{ jobId: string; acceptedQuoteId: string; seedQuoteIds: string[] }>,
    ) {
      const { jobId, acceptedQuoteId, seedQuoteIds } = action.payload;
      state.extraQuotes.forEach((q) => {
        if (q.jobId === jobId && q.id !== acceptedQuoteId && (q.status === "pending" || q.status === "countered")) {
          q.status = "rejected";
        }
      });
      seedQuoteIds.forEach((id) => {
        if (id === acceptedQuoteId) return;
        const current = state.quoteOverrides[id]?.status;
        if (!current || current === "pending" || current === "countered") {
          patchQuote(state, id, { status: "rejected" });
        }
      });
      persist(state);
    },
    setOfferStatus(state, action: PayloadAction<{ quoteId: string; status: OfferStatus }>) {
      patchQuote(state, action.payload.quoteId, { status: action.payload.status });
      persist(state);
    },
    counterOffer(
      state,
      action: PayloadAction<{ quoteId: string; amount: number; note: string }>,
    ) {
      patchQuote(state, action.payload.quoteId, {
        status: "countered",
        counterAmount: action.payload.amount,
        counterNote: action.payload.note,
      });
      persist(state);
    },
    acceptCounter(state, action: PayloadAction<{ quoteId: string; jobId: string }>) {
      const override = state.quoteOverrides[action.payload.quoteId];
      const local = state.extraQuotes.find((q) => q.id === action.payload.quoteId);
      const amount = local?.counterAmount ?? override?.counterAmount;
      if (state.hiredByJob[action.payload.jobId] && state.hiredByJob[action.payload.jobId] !== action.payload.quoteId) {
        return;
      }
      if (amount != null) {
        patchQuote(state, action.payload.quoteId, {
          amount,
          status: "accepted",
          counterAmount: undefined,
          counterNote: undefined,
        });
      } else {
        patchQuote(state, action.payload.quoteId, { status: "accepted" });
      }
      state.hiredByJob[action.payload.jobId] = action.payload.quoteId;

      const agreedPrice = amount ?? local?.amount ?? override?.amount ?? 0;
      const existing = state.bookings[action.payload.jobId];
      if (!existing) {
        const acceptedAt = new Date().toISOString();
        state.bookings[action.payload.jobId] = {
          jobId: action.payload.jobId,
          quoteId: action.payload.quoteId,
          proId: local?.proId ?? "",
          agreedPrice,
          scheduledDate: "",
          scheduledTime: "",
          scopeSnapshot: local?.scope ?? override?.scope ?? "",
          status: "pending_schedule",
          acceptedAt,
          priceHistory: [
            {
              id: `pv-${Date.now()}`,
              previousAmount: agreedPrice,
              newAmount: agreedPrice,
              reason: "Counter accepted",
              changedAt: acceptedAt,
              homeownerAcknowledgedAt: acceptedAt,
              proAcknowledgedAt: acceptedAt,
            },
          ],
        };
      }
      persist(state);
    },
    confirmBooking(
      state,
      action: PayloadAction<{
        jobId: string;
        quoteId: string;
        proId: string;
        agreedPrice: number;
        scheduledDate: string;
        scheduledTime: string;
        arrivalWindow?: string;
        scopeSnapshot: string;
        notes?: string;
        paymentArrangement?: DirectPaymentMethod;
        paymentTerms?: string;
      }>,
    ) {
      const p = action.payload;
      const existing = state.bookings[p.jobId];
      state.bookings[p.jobId] = {
        jobId: p.jobId,
        quoteId: existing?.quoteId ?? p.quoteId,
        proId: existing?.proId || p.proId,
        homeownerName: existing?.homeownerName,
        agreedPrice: existing?.agreedPrice ?? p.agreedPrice,
        scheduledDate: p.scheduledDate,
        scheduledTime: p.scheduledTime,
        arrivalWindow: p.arrivalWindow || (p.scheduledTime.includes("–") ? p.scheduledTime : undefined),
        scopeSnapshot: existing?.scopeSnapshot || p.scopeSnapshot,
        status: "confirmed",
        notes: p.notes ?? existing?.notes,
        acceptedAt: existing?.acceptedAt ?? new Date().toISOString(),
        paymentArrangement: p.paymentArrangement ?? existing?.paymentArrangement,
        paymentTerms: p.paymentTerms ?? existing?.paymentTerms,
        paymentMethod: existing?.paymentMethod,
        paymentReceiptNumber: existing?.paymentReceiptNumber,
        paidAt: existing?.paidAt,
        paymentConfirmedByHomeowner: existing?.paymentConfirmedByHomeowner,
        paymentConfirmedByPro: existing?.paymentConfirmedByPro,
        priceHistory: existing?.priceHistory,
      };
      persist(state);
    },
    setPaymentArrangement(
      state,
      action: PayloadAction<{
        jobId: string;
        paymentArrangement: DirectPaymentMethod;
        paymentTerms?: string;
      }>,
    ) {
      const booking = state.bookings[action.payload.jobId];
      if (!booking) return;
      booking.paymentArrangement = action.payload.paymentArrangement;
      booking.paymentMethod = action.payload.paymentArrangement;
      if (action.payload.paymentTerms !== undefined) {
        booking.paymentTerms = action.payload.paymentTerms;
      }
      persist(state);
    },
    requestReschedule(
      state,
      action: PayloadAction<{
        jobId: string;
        scheduledDate: string;
        scheduledTime: string;
        arrivalWindow?: string;
        notes?: string;
      }>,
    ) {
      const booking = state.bookings[action.payload.jobId];
      if (!booking) return;
      booking.scheduledDate = action.payload.scheduledDate;
      booking.scheduledTime = action.payload.scheduledTime;
      if (action.payload.arrivalWindow) {
        booking.arrivalWindow = action.payload.arrivalWindow;
      }
      booking.notes = action.payload.notes ?? booking.notes;
      booking.status = "confirmed";
      persist(state);
    },
    addChangeRequest(
      state,
      action: PayloadAction<{
        jobId: string;
        amount: number;
        reason: string;
        proposedBy?: "homeowner" | "pro";
      }>,
    ) {
      const booking = state.bookings[action.payload.jobId];
      const previousAmount = booking?.agreedPrice;
      const proposedBy = action.payload.proposedBy ?? "pro";
      state.changeRequests.unshift({
        id: `cr-${Date.now()}`,
        jobId: action.payload.jobId,
        amount: action.payload.amount,
        previousAmount,
        newAmount: previousAmount != null ? previousAmount + action.payload.amount : undefined,
        reason: action.payload.reason,
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
        proposedBy,
        homeownerAcknowledged: proposedBy === "homeowner",
        proAcknowledged: proposedBy === "pro",
      });
      persist(state);
    },
    acknowledgeChangeRequest(
      state,
      action: PayloadAction<{ id: string; party: "homeowner" | "pro" }>,
    ) {
      const item = state.changeRequests.find((cr) => cr.id === action.payload.id);
      if (!item || item.status !== "pending") return;
      if (action.payload.party === "homeowner") item.homeownerAcknowledged = true;
      if (action.payload.party === "pro") item.proAcknowledged = true;
      if (item.homeownerAcknowledged && item.proAcknowledged) {
        item.status = "approved";
        const booking = state.bookings[item.jobId];
        if (booking) {
          const previous = booking.agreedPrice;
          booking.agreedPrice += item.amount;
          booking.priceHistory = [
            ...(booking.priceHistory ?? []),
            {
              id: `pv-${Date.now()}`,
              previousAmount: previous,
              newAmount: booking.agreedPrice,
              reason: item.reason,
              changedAt: new Date().toISOString(),
              homeownerAcknowledgedAt: new Date().toISOString(),
              proAcknowledgedAt: new Date().toISOString(),
            },
          ];
        }
      }
      persist(state);
    },
    resolveChangeRequest(
      state,
      action: PayloadAction<{ id: string; status: "approved" | "rejected" }>,
    ) {
      const item = state.changeRequests.find((cr) => cr.id === action.payload.id);
      if (!item) return;
      if (action.payload.status === "rejected") {
        item.status = "rejected";
        persist(state);
        return;
      }
      item.homeownerAcknowledged = true;
      if (item.proAcknowledged || item.proposedBy === "pro") {
        item.proAcknowledged = true;
        item.status = "approved";
        const booking = state.bookings[item.jobId];
        if (booking) {
          const previous = booking.agreedPrice;
          booking.agreedPrice += item.amount;
          booking.priceHistory = [
            ...(booking.priceHistory ?? []),
            {
              id: `pv-${Date.now()}`,
              previousAmount: previous,
              newAmount: booking.agreedPrice,
              reason: item.reason,
              changedAt: new Date().toISOString(),
              homeownerAcknowledgedAt: new Date().toISOString(),
              proAcknowledgedAt: new Date().toISOString(),
            },
          ];
        }
      }
      persist(state);
    },
    proMarkComplete(
      state,
      action: PayloadAction<{ jobId: string; completionNotes?: string }>,
    ) {
      state.completions[action.payload.jobId] = {
        ...(state.completions[action.payload.jobId] ?? { jobId: action.payload.jobId }),
        jobId: action.payload.jobId,
        proMarkedAt: new Date().toISOString(),
        completionNotes: action.payload.completionNotes,
      };
      persist(state);
    },
    homeownerConfirmComplete(
      state,
      action: PayloadAction<{
        jobId: string;
        paymentMethod?: DirectPaymentMethod;
        receiptNumber?: string;
        markPaid?: boolean;
      }>,
    ) {
      const receiptNo = action.payload.receiptNumber || `LHF-REC-${Math.floor(100000 + Math.random() * 900000)}`;
      const pMethod = action.payload.paymentMethod;
      
      state.completions[action.payload.jobId] = {
        ...(state.completions[action.payload.jobId] ?? { jobId: action.payload.jobId }),
        jobId: action.payload.jobId,
        homeownerConfirmedAt: new Date().toISOString(),
        paymentMethod: pMethod,
        receiptNumber: receiptNo,
      };

      const booking = state.bookings[action.payload.jobId];
      if (booking) {
        if (pMethod) {
          booking.paymentArrangement = booking.paymentArrangement ?? pMethod;
          booking.paymentMethod = pMethod;
        }
        booking.paymentReceiptNumber = receiptNo;
        booking.paymentConfirmedByHomeowner = Boolean(action.payload.markPaid);
        if (action.payload.markPaid) {
          booking.paidAt = new Date().toISOString().slice(0, 10);
        }
      }
      persist(state);
    },
    startMembership(state) {
      state.membershipActive = true;
      persist(state);
    },
    setVerification(state, action: PayloadAction<{ key: VerifyKey; status: VerifyStatus }>) {
      state.verification[action.payload.key] = action.payload.status;
      persist(state);
    },
  },
});

export const {
  hydrateMarketplace,
  addJob,
  addQuote,
  hireQuote,
  rejectSiblingOffers,
  setOfferStatus,
  counterOffer,
  acceptCounter,
  confirmBooking,
  setPaymentArrangement,
  requestReschedule,
  addChangeRequest,
  acknowledgeChangeRequest,
  resolveChangeRequest,
  proMarkComplete,
  homeownerConfirmComplete,
  startMembership,
  setVerification,
} = marketplaceSlice.actions;
export default marketplaceSlice.reducer;

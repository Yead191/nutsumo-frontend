import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  seedActivity,
  seedApplications,
  seedDisputes,
  seedMemberships,
  type AdminActivity,
  type AdminApplication,
  type AdminDispute,
  type ListingVisibility,
} from "@/lib/admin-data";

const STORAGE_KEY = "lhf-admin-ops-v1";

interface AdminState {
  applications: AdminApplication[];
  disputes: AdminDispute[];
  listingStatus: Record<string, ListingVisibility>;
  memberships: typeof seedMemberships;
  activity: AdminActivity[];
  hydrated: boolean;
}

const initialState: AdminState = {
  applications: seedApplications,
  disputes: seedDisputes,
  listingStatus: {},
  memberships: seedMemberships,
  activity: seedActivity,
  hydrated: false,
};

function persist(state: AdminState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        applications: state.applications,
        disputes: state.disputes,
        listingStatus: state.listingStatus,
        memberships: state.memberships,
        activity: state.activity,
      }),
    );
  } catch {
    /* ignore */
  }
}

function stamp() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isoDate() {
  return new Date().toISOString().slice(0, 10);
}

function pushActivity(state: AdminState, title: string, body: string, href?: string) {
  state.activity.unshift({
    id: `act-${Date.now()}`,
    at: stamp(),
    title,
    body,
    href,
  });
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    hydrateAdmin(state) {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<AdminState>;
          if (saved.applications?.length) state.applications = saved.applications;
          if (saved.disputes?.length) state.disputes = saved.disputes;
          state.listingStatus = saved.listingStatus ?? {};
          if (saved.memberships?.length) state.memberships = saved.memberships;
          if (saved.activity?.length) state.activity = saved.activity;
        }
      } catch {
        /* ignore */
      }
      state.hydrated = true;
    },
    decideApplication(
      state,
      action: PayloadAction<{
        id: string;
        status: AdminApplication["status"];
        note?: string;
        by?: string;
      }>,
    ) {
      const app = state.applications.find((item) => item.id === action.payload.id);
      if (!app) return;
      const by = action.payload.by ?? "Avery Cole";
      const note = action.payload.note?.trim();
      app.status = action.payload.status;
      app.reviewerNote = action.payload.status === "cleared" ? undefined : note;
      const verb =
        action.payload.status === "cleared"
          ? "approved"
          : action.payload.status === "needs_info"
            ? "needs_info"
            : "rejected";
      app.history.unshift({
        id: `d-${Date.now()}`,
        at: isoDate(),
        action: verb,
        note,
        by,
      });
      pushActivity(
        state,
        action.payload.status === "cleared"
          ? "Application cleared"
          : action.payload.status === "needs_info"
            ? "More info requested"
            : "Application rejected",
        `${app.businessName} — ${note || action.payload.status}`,
        `/admin/applications/${app.id}`,
      );
      persist(state);
    },
    setListingVisibility(
      state,
      action: PayloadAction<{ proId: string; visibility: ListingVisibility; businessName?: string }>,
    ) {
      state.listingStatus[action.payload.proId] = action.payload.visibility;
      const label =
        action.payload.visibility === "live"
          ? "Listing restored"
          : action.payload.visibility === "suspended"
            ? "Listing suspended"
            : "Listing hidden";
      pushActivity(
        state,
        label,
        action.payload.businessName ?? action.payload.proId,
        "/admin/professionals",
      );
      persist(state);
    },
    openDispute(
      state,
      action: PayloadAction<{
        jobId: string;
        jobTitle: string;
        homeownerName: string;
        proName: string;
        reason: string;
        agreedPrice?: number;
        quoteId?: string;
      }>,
    ) {
      const existing = state.disputes.find(
        (item) => item.jobId === action.payload.jobId && (item.status === "open" || item.status === "in_review"),
      );
      if (existing) {
        existing.reason = action.payload.reason;
        existing.agreedPrice = action.payload.agreedPrice ?? existing.agreedPrice;
        existing.quoteId = action.payload.quoteId ?? existing.quoteId;
        persist(state);
        return;
      }
      const dispute: AdminDispute = {
        id: `dsp-${Date.now()}`,
        jobId: action.payload.jobId,
        jobTitle: action.payload.jobTitle,
        homeownerName: action.payload.homeownerName,
        proName: action.payload.proName,
        reason: action.payload.reason,
        status: "open",
        openedAt: isoDate(),
        agreedPrice: action.payload.agreedPrice,
        quoteId: action.payload.quoteId,
        notes: [],
        history: [{ id: `d-${Date.now()}`, at: isoDate(), action: "submitted", note: action.payload.reason, by: "Homeowner" }],
      };
      state.disputes.unshift(dispute);
      pushActivity(state, "Dispute opened", `${action.payload.jobTitle} — ${action.payload.reason}`, "/admin/disputes");
      persist(state);
    },
    addDisputeNote(
      state,
      action: PayloadAction<{ id: string; body: string; by?: string }>,
    ) {
      const item = state.disputes.find((d) => d.id === action.payload.id);
      if (!item) return;
      item.notes = item.notes ?? [];
      item.notes.unshift({
        id: `dn-${Date.now()}`,
        at: stamp(),
        by: action.payload.by ?? "Avery Cole",
        body: action.payload.body,
      });
      if (item.status === "open") item.status = "in_review";
      pushActivity(state, "Dispute note added", item.jobTitle, `/admin/disputes/${item.id}`);
      persist(state);
    },
    updateDispute(
      state,
      action: PayloadAction<{ id: string; status: AdminDispute["status"]; resolution?: string; by?: string }>,
    ) {
      const item = state.disputes.find((d) => d.id === action.payload.id);
      if (!item) return;
      item.status = action.payload.status;
      if (action.payload.resolution) item.resolution = action.payload.resolution;
      item.history = item.history ?? [];
      item.history.unshift({
        id: `d-${Date.now()}`,
        at: isoDate(),
        action: action.payload.status === "resolved" ? "approved" : action.payload.status === "closed" ? "rejected" : "needs_info",
        note: action.payload.resolution,
        by: action.payload.by ?? "Avery Cole",
      });
      pushActivity(
        state,
        `Dispute ${action.payload.status.replace("_", " ")}`,
        item.jobTitle,
        `/admin/disputes/${item.id}`,
      );
      persist(state);
    },
  },
});

export const {
  hydrateAdmin,
  decideApplication,
  setListingVisibility,
  openDispute,
  addDisputeNote,
  updateDispute,
} = adminSlice.actions;
export default adminSlice.reducer;

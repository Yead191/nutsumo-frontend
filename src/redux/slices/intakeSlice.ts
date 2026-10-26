import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IntakeDraft } from "@/types";

const STORAGE_KEY = "lhf-intake-draft";

const emptyDraft: IntakeDraft = {
  problem: "",
  categorySlug: "",
  zip: "",
  title: "",
  summary: "",
  followUps: [],
};

interface IntakeState {
  draft: IntakeDraft;
  hydrated: boolean;
}

const initialState: IntakeState = {
  draft: emptyDraft,
  hydrated: false,
};

function persist(draft: IntakeDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

const intakeSlice = createSlice({
  name: "intake",
  initialState,
  reducers: {
    hydrateIntake(state) {
      if (typeof window === "undefined") {
        state.hydrated = true;
        return;
      }
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          state.draft = { ...emptyDraft, ...JSON.parse(raw) };
        }
      } catch {
        /* ignore */
      }
      state.hydrated = true;
    },
    saveDraft(state, action: PayloadAction<IntakeDraft>) {
      state.draft = action.payload;
      persist(action.payload);
    },
    clearDraft(state) {
      state.draft = emptyDraft;
      persist(emptyDraft);
    },
  },
});

export const { hydrateIntake, saveDraft, clearDraft } = intakeSlice.actions;
export default intakeSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SortOption =
  | "recommended"
  | "nearest"
  | "rated"
  | "reviews"
  | "jobs"
  | "price_low"
  | "price_high"
  | "response";

interface FilterState {
  query: string;
  category: string;
  zip: string;
  sort: SortOption;
  minPrice: string;
  maxPrice: string;
  budgetTier: string;
  minRating: string;
  availableThisWeek: boolean;
}

const initialState: FilterState = {
  query: "",
  category: "",
  zip: "",
  sort: "rated",
  minPrice: "",
  maxPrice: "",
  budgetTier: "",
  minRating: "",
  availableThisWeek: false,
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setZip(state, action: PayloadAction<string>) {
      state.zip = action.payload;
    },
    setSort(state, action: PayloadAction<FilterState["sort"]>) {
      state.sort = action.payload;
    },
    setMinPrice(state, action: PayloadAction<string>) {
      state.minPrice = action.payload;
    },
    setMaxPrice(state, action: PayloadAction<string>) {
      state.maxPrice = action.payload;
    },
    setBudgetTier(state, action: PayloadAction<string>) {
      state.budgetTier = action.payload;
    },
    setBudget(
      state,
      action: PayloadAction<{ minPrice: string; maxPrice: string; budgetTier: string }>,
    ) {
      state.minPrice = action.payload.minPrice;
      state.maxPrice = action.payload.maxPrice;
      state.budgetTier = action.payload.budgetTier;
    },
    setMinRating(state, action: PayloadAction<string>) {
      state.minRating = action.payload;
    },
    setAvailableThisWeek(state, action: PayloadAction<boolean>) {
      state.availableThisWeek = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setQuery,
  setCategory,
  setZip,
  setSort,
  setMinPrice,
  setMaxPrice,
  setBudgetTier,
  setBudget,
  setMinRating,
  setAvailableThisWeek,
  resetFilters,
} = filterSlice.actions;
export default filterSlice.reducer;

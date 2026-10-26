import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import filterReducer from "@/redux/slices/filterSlice";
import intakeReducer from "@/redux/slices/intakeSlice";
import marketplaceReducer from "@/redux/slices/marketplaceSlice";
import featuresReducer from "@/redux/slices/featuresSlice";
import adminReducer from "@/redux/slices/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filterReducer,
    intake: intakeReducer,
    marketplace: marketplaceReducer,
    features: featuresReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

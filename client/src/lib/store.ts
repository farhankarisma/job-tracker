import { configureStore } from "@reduxjs/toolkit";
import applicationsReducer from "./features/applications/applicationsSlice";
import uiReducer from "./features/ui/uiSlice";
import authReducer from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    application: applicationsReducer,
    ui: uiReducer,
    auth: authReducer,
  }, // We'll add reducers here later
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

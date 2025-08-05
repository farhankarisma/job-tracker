import { configureStore } from "@reduxjs/toolkit";
import applicationsReducer from "./features/applications/applicationsSlice";
import uiReducer from "./features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    application: applicationsReducer,
    ui: uiReducer,
  }, // We'll add reducers here later
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

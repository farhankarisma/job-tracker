import { configureStore } from "@reduxjs/toolkit";
import jobsReducer from "./features/jobs/jobsSlice";
import uiReducer from "./features/ui/uiSlice";
import filesReducer from "./features/file/fileSlice";

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    ui: uiReducer,
    files: filesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

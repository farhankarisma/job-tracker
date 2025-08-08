import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Application } from "@/lib/type";
import { RootState } from "@/lib/store";
import { logout } from "../auth/authSlice";

interface ApplicationsState {
  items: Application[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ApplicationsState = {
  items: [],
  status: "idle",
  error: null,
};

const getToken = (thunkAPI: { getState: () => unknown }) => {
  const state = thunkAPI.getState() as RootState;
  return state.auth.token;
};

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async (_, thunkAPI) => {
    try {
      // --- THE AUTHENTICATION PATTERN ---
      const token = getToken(thunkAPI);
      if (!token) {
        return thunkAPI.rejectWithValue("No token found, please log in.");
      }
      const response = await fetch("http://localhost:3001/api/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // --- END OF PATTERN ---

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(
          data.error || "Failed to fetch applications"
        );
      }
      return (await response.json()) as Application[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addApplication = createAsyncThunk(
  "applications/addApplication",
  async (newApp: Omit<Application, "id">, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue("No token found");

      const response = await fetch("http://localhost:3001/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newApp),
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(
          data.error || "Failed to add application"
        );
      }
      return (await response.json()) as Application;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue("No token found");

      const response = await fetch(
        `http://localhost:3001/api/applications/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(
          data.error || "Failed to update status"
        );
      }
      // Return the data we sent to update the UI instantly
      return { id, status };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",
  async (id: string, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue("No token found");

      const response = await fetch(
        `http://localhost:3001/api/applications/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(
          data.error || "Failed to delete application"
        );
      }
      return id; // Return the ID on success
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editApplication = createAsyncThunk(
  "applications/editApplication",
  async (appData: Partial<Application> & { id: string }, thunkAPI) => {
    try {
      const token = getToken(thunkAPI);
      if (!token) return thunkAPI.rejectWithValue("No token found");

      const { id, ...fieldsToUpdate } = appData;
      const response = await fetch(
        `http://localhost:3001/api/applications/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(fieldsToUpdate),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(
          data.error || "Failed to edit application"
        );
      }
      // Return the data we sent to update the UI instantly
      return appData;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Cases for fetchApplications
      .addCase(fetchApplications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchApplications.fulfilled,
        (state, action: PayloadAction<Application[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Cases for other actions
      .addCase(
        addApplication.fulfilled,
        (state, action: PayloadAction<Application>) => {
          state.items.unshift(action.payload);
        }
      )
      .addCase(
        updateApplicationStatus.fulfilled,
        (state, action: PayloadAction<{ id: string; status: string }>) => {
          const index = state.items.findIndex(
            (app: Application) => app.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index].status = action.payload.status;
          }
        }
      )
      .addCase(
        deleteApplication.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.items = state.items.filter(
            (app: Application) => app.id !== action.payload
          );
        }
      )
      .addCase(
        editApplication.fulfilled,
        (
          state,
          action: PayloadAction<Partial<Application> & { id: string }>
        ) => {
          const index = state.items.findIndex(
            (app: Application) => app.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = { ...state.items[index], ...action.payload };
          }
        }
      )
      .addCase(logout, (state) => {
        state.items = [];
        state.status = "idle";
        state.error = null;
      });
  },
});

export default applicationsSlice.reducer;

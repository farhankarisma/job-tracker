import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  url?: string;
}

interface ApplicationState {
  items: Application[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ApplicationState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchApplications = createAsyncThunk(
  "applications/fetchApplications",
  async () => {
    const response = await fetch("http://localhost:3001/api/applications");
    const data: Application[] = await response.json();
    return data;
  }
);

export const addApplication = createAsyncThunk(
  "applications/addApplication",
  async (newApp: {
    company: string;
    role: string;
    status: string;
    url: string;
  }) => {
    const response = await fetch("http://localhost:3001/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newApp),
    });
    const data = await response.json();
    return data;
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, status }: { id: string; status: string }) => {
    const response = await fetch(
      `http://localhost:3001/api/applications/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );
    const data = await response.json();
    return data;
  }
);

export const deleteApplication = createAsyncThunk(
  "applications/deleteApplication",
  async (id: string) => {
    await fetch(`http://localhost:3001/api/applications/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

export const editApplication = createAsyncThunk(
  "applications/editApplication",
  async (appData: Partial<Application> & { id: string }) => {
    const { id, ...fieldsToUpdate } = appData;
    const response = await fetch(
      `http://localhost:3001/api/applications/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldsToUpdate),
      }
    );
    const data = await response.json();
    return data;
  }
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchApplications.pending, (state) => {
      state.status = "loading"; // We set the status to 'loading'
    });
    builder.addCase(
      fetchApplications.fulfilled,
      (state, action: PayloadAction<Application[]>) => {
        state.status = "succeeded"; // Set status to 'succeeded'
        state.items = action.payload; // Replace our items array with the data from the backend
      }
    );
    builder.addCase(fetchApplications.rejected, (state, action) => {
      state.status = "failed"; // Set status to 'failed'
      state.error = action.error.message || "Something went wrong"; // Store the error message
    });
    builder.addCase(addApplication.fulfilled, (state, action) => {
      // Add the new application to the beginning of the items array
      state.items.unshift(action.payload);
    });
    builder.addCase(updateApplicationStatus.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (app) => app.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(deleteApplication.fulfilled, (state, action) => {
      state.items = state.items.filter((app) => app.id !== action.payload);
    });
    builder.addCase(editApplication.fulfilled, (state, action) => {
      
    })
  },
});

export default applicationsSlice.reducer;

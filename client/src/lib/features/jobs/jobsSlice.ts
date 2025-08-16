import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Job, JobStatus } from "@/lib/type";
import { supabase } from "@/lib/src/supabaseClient";
import { API_BASE_URL } from "@/lib/api-config";

interface JobsState {
  items: Job[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pendingStatusUpdates: { [jobId: string]: JobStatus }; // Track pending status changes
}

const initialState: JobsState = {
  items: [],
  status: "idle",
  error: null,
  pendingStatusUpdates: {},
};

// --- SECURE ASYNC THUNKS ---

export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, thunkAPI) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue("Not authenticated");

      const token = session.access_token;
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || "Failed to fetch jobs");
      }
      return (await response.json()) as Job[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addJob = createAsyncThunk(
  "jobs/addJob",
  async (
    newJobData: Omit<
      Job,
      "id" | "createdAt" | "updatedAt" | "userId" | "appliedAt"
    >,
    thunkAPI
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue("Not authenticated");
      const token = session.access_token;

      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newJobData),
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || "Failed to create job");
      }
      return (await response.json()) as Job;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateJobStatus = createAsyncThunk(
  "jobs/updateStatus",
  async ({ id, status }: { id: string; status: JobStatus }, thunkAPI) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue("Not authenticated");
      const token = session.access_token;

      const response = await fetch(
        `${API_BASE_URL}/api/jobs/${id}/status`,
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
      return { id, status };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editJob = createAsyncThunk(
  "jobs/editJob",
  async (jobData: Partial<Job> & { id: string }, thunkAPI) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue("Not authenticated");
      const token = session.access_token;

      const { id, ...fieldsToUpdate } = jobData;
      const response = await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fieldsToUpdate),
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || "Failed to edit job");
      }
      return (await response.json()) as Job;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId: string, thunkAPI) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue("Not authenticated");
      const token = session.access_token;

      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || "Failed to delete job");
      }
      return jobId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.items.unshift(action.payload);
      })
      // Optimistic update: immediately change the status when the request starts
      .addCase(updateJobStatus.pending, (state, action) => {
        const { id, status } = action.meta.arg;
        const index = state.items.findIndex((job) => job.id === id);
        if (index !== -1) {
          // Store the original status before changing it
          state.pendingStatusUpdates[id] = state.items[index].status;
          // Apply the optimistic update
          state.items[index].status = status;
        }
      })
      .addCase(
        updateJobStatus.fulfilled,
        (state, action: PayloadAction<{ id: string; status: JobStatus }>) => {
          // Remove from pending updates since it succeeded
          delete state.pendingStatusUpdates[action.payload.id];
          // Ensure the status is correct (should already be updated from pending)
          const index = state.items.findIndex(
            (job) => job.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index].status = action.payload.status;
          }
        }
      )
      // Revert optimistic update if the request fails
      .addCase(updateJobStatus.rejected, (state, action) => {
        const { id } = action.meta.arg;
        const originalStatus = state.pendingStatusUpdates[id];
        
        if (originalStatus) {
          // Revert to the original status
          const index = state.items.findIndex((job) => job.id === id);
          if (index !== -1) {
            state.items[index].status = originalStatus;
          }
          // Remove from pending updates
          delete state.pendingStatusUpdates[id];
        }
        
        state.error = action.payload as string;
      })
      .addCase(editJob.fulfilled, (state, action: PayloadAction<Job>) => {
        const index = state.items.findIndex(
          (job) => job.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((job) => job.id !== action.payload);
      });
  },
});

export default jobsSlice.reducer;

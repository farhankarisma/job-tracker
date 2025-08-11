import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Job, JobStatus } from "@/lib/type";
import { supabase } from "@/lib/src/supabaseClient";
import { RootState } from "@/lib/store";

interface JobsState {
  items: Job[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: JobsState = {
  items: [],
  status: "idle",
  error: null,
};

// --- SECURE ASYNC THUNKS ---

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (_, thunkAPI) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue('Not authenticated');
      
      const token = session.access_token;
      const response = await fetch('http://localhost:3001/api/jobs', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || 'Failed to fetch jobs');
      }
      return await response.json() as Job[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addJob = createAsyncThunk(
  'jobs/addJob',
  async (newJobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'appliedAt'>, thunkAPI) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue('Not authenticated');

      const token = session.access_token;
      const response = await fetch('http://localhost:3001/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newJobData),
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || 'Failed to create job');
      }
      return await response.json() as Job;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateJobStatus = createAsyncThunk(
  'jobs/updateStatus',
  async ({ id, status }: { id: string; status: JobStatus }, thunkAPI) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue('Not authenticated');

      const token = session.access_token;
      const response = await fetch(`http://localhost:3001/api/jobs/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || 'Failed to update status');
      }
      return { id, status };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editJob = createAsyncThunk(
  'jobs/editJob',
  async (jobData: Partial<Job> & { id: string }, thunkAPI) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue('Not authenticated');

      const token = session.access_token;
      const { id, ...fieldsToUpdate } = jobData;

      const response = await fetch(`http://localhost:3001/api/jobs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(fieldsToUpdate),
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || 'Failed to edit job');
      }
      return await response.json() as Job;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId: string, thunkAPI) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return thunkAPI.rejectWithValue('Not authenticated');

      const token = session.access_token;
      const response = await fetch(`http://localhost:3001/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return thunkAPI.rejectWithValue(data.error || 'Failed to delete job');
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
      .addCase(fetchJobs.pending, (state) => { state.status = "loading"; })
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
      .addCase(updateJobStatus.fulfilled, (state, action: PayloadAction<{ id: string; status: JobStatus }>) => {
        const index = state.items.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = action.payload.status;
        }
      })
      .addCase(editJob.fulfilled, (state, action: PayloadAction<Job>) => {
        const index = state.items.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(job => job.id !== action.payload);
      });
  },
});

export default jobsSlice.reducer;

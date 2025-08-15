import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface FileItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  category: string;
  description?: string;
  tags?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface FilesState {
  files: FileItem[];
  filteredFiles: FileItem[];
  uploadingFiles: string[];
  filters: {
    category: string;
    searchTerm: string;
  };
  loading: boolean;
  error: string | null;
  uploadProgress: { [fileName: string]: number };
}

const initialState: FilesState = {
  files: [],
  filteredFiles: [],
  uploadingFiles: [],
  filters: {
    category: 'ALL',
    searchTerm: '',
  },
  loading: false,
  error: null,
  uploadProgress: {},
};

// Async thunks
export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async (params: { token: string; category?: string; search?: string }, { rejectWithValue }) => {
    try {
      if (!params.token) {
        return rejectWithValue('No authentication token available');
      }
      
      const queryParams = new URLSearchParams();
      if (params.category && params.category !== 'ALL') {
        queryParams.append('category', params.category);
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }

      const response = await fetch(`http://localhost:3001/api/files?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${params.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch files');
    }
  }
);

export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async (params: { token: string; file: File; category?: string }, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('category', params.category || 'OTHER');

      dispatch(addUploadingFile(params.file.name));

      const response = await fetch('http://localhost:3001/api/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${params.token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Failed to upload ${params.file.name}`);
      }

      dispatch(removeUploadingFile(params.file.name));
      return result;
    } catch (error) {
      dispatch(removeUploadingFile(params.file.name));
      return rejectWithValue(error instanceof Error ? error.message : `Failed to upload ${params.file.name}`);
    }
  }
);

export const uploadMultipleFiles = createAsyncThunk(
  'files/uploadMultipleFiles',
  async (params: { token: string; files: File[]; category?: string }, { dispatch, rejectWithValue }) => {
    try {
      // Add all files to uploading state
      params.files.forEach(file => {
        dispatch(addUploadingFile(file.name));
      });

      const formData = new FormData();
      params.files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('category', params.category || 'OTHER');

      const response = await fetch('http://localhost:3001/api/files/upload-multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${params.token}`,
        },
        body: formData,
      });

      const result = await response.json();

      // Remove all files from uploading state
      params.files.forEach(file => {
        dispatch(removeUploadingFile(file.name));
      });

      if (!response.ok) {
        // If there are specific failed files, provide more detailed error
        if (result.failedFiles && result.failedFiles.length > 0) {
          const failedFileNames = result.failedFiles.map((f: any) => f.filename).join(', ');
          throw new Error(`Failed to upload: ${failedFileNames}`);
        }
        throw new Error(result.error || 'Failed to upload files');
      }

      // If some files failed but some succeeded, we still return success but with warnings
      if (result.failedFiles && result.failedFiles.length > 0) {
        const failedFileNames = result.failedFiles.map((f: any) => `${f.filename} (${f.error})`).join(', ');
        return {
          ...result,
          warning: `Some files failed: ${failedFileNames}`
        };
      }

      return result;
    } catch (error) {
      // Remove all files from uploading state on error
      params.files.forEach(file => {
        dispatch(removeUploadingFile(file.name));
      });
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to upload files');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (params: { token: string; fileId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/api/files/${params.fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${params.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      return params.fileId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Delete failed');
    }
  }
);

export const updateFile = createAsyncThunk(
  'files/updateFile',
  async (
    params: {
      token: string;
      fileId: string;
      updates: { category?: string; description?: string; tags?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`http://localhost:3001/api/files/${params.fileId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${params.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update file');
      }

      const updatedFile = await response.json();
      return updatedFile;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Update failed');
    }
  }
);

export const downloadFile = createAsyncThunk(
  'files/downloadFile',
  async (params: { token: string; file: FileItem }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/api/files/download/${params.file.filename}`, {
        headers: {
          'Authorization': `Bearer ${params.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = params.file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return params.file.id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Download failed');
    }
  }
);

// Helper function to filter files
const filterFiles = (files: FileItem[], category: string, searchTerm: string): FileItem[] => {
  if (!files || !Array.isArray(files)) return [];
  
  return files.filter(file => {
    if (!file) return false;
    
    const matchesCategory = category === 'ALL' || file.category === category;
    const matchesSearch = !searchTerm || 
      file.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ type: 'category' | 'search'; value: string }>) => {
      if (action.payload.type === 'category') {
        state.filters.category = action.payload.value;
      } else {
        state.filters.searchTerm = action.payload.value;
      }
      
      // Update filtered files
      state.filteredFiles = filterFiles(state.files, state.filters.category, state.filters.searchTerm);
    },
    addUploadingFile: (state, action: PayloadAction<string>) => {
      if (!state.uploadingFiles.includes(action.payload)) {
        state.uploadingFiles.push(action.payload);
      }
    },
    removeUploadingFile: (state, action: PayloadAction<string>) => {
      state.uploadingFiles = state.uploadingFiles.filter(fileName => fileName !== action.payload);
    },
    setUploadProgress: (state, action: PayloadAction<{ fileName: string; progress: number }>) => {
      state.uploadProgress[action.payload.fileName] = action.payload.progress;
    },
    clearUploadProgress: (state, action: PayloadAction<string>) => {
      delete state.uploadProgress[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredFiles = state.files;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch files
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        const files = Array.isArray(action.payload) ? action.payload.filter(file => file && file.id) : [];
        state.files = files;
        state.filteredFiles = filterFiles(files, state.filters.category, state.filters.searchTerm);
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Upload file
      .addCase(uploadFile.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          state.files.unshift(action.payload);
          state.filteredFiles = filterFiles(state.files, state.filters.category, state.filters.searchTerm);
        }
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Upload multiple files
      .addCase(uploadMultipleFiles.fulfilled, (state, action) => {
        if (action.payload && action.payload.files) {
          const newFiles = Array.isArray(action.payload.files) ? action.payload.files : [];
          state.files = [...newFiles, ...state.files];
          state.filteredFiles = filterFiles(state.files, state.filters.category, state.filters.searchTerm);
          
          // If there's a warning about failed files, set it as error for toast display
          if (action.payload.warning) {
            state.error = action.payload.warning;
          }
        }
      })
      .addCase(uploadMultipleFiles.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Delete file
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file.id !== action.payload);
        state.filteredFiles = state.filteredFiles.filter(file => file.id !== action.payload);
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Update file
      .addCase(updateFile.fulfilled, (state, action) => {
        const index = state.files.findIndex(file => file.id === action.payload.id);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
        state.filteredFiles = filterFiles(state.files, state.filters.category, state.filters.searchTerm);
      })
      .addCase(updateFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // Download file
      .addCase(downloadFile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilter,
  addUploadingFile,
  removeUploadingFile,
  setUploadProgress,
  clearUploadProgress,
  clearError,
  resetFilters,
} = filesSlice.actions;

export default filesSlice.reducer;

// Selectors
export const selectFiles = (state: { files: FilesState }) => state.files?.files || [];
export const selectFilteredFiles = (state: { files: FilesState }) => state.files?.filteredFiles || [];
export const selectUploadingFiles = (state: { files: FilesState }) => state.files?.uploadingFiles || [];
export const selectFilesLoading = (state: { files: FilesState }) => state.files?.loading || false;
export const selectFilesError = (state: { files: FilesState }) => state.files?.error || null;
export const selectFilters = (state: { files: FilesState }) => state.files?.filters || { category: 'ALL', searchTerm: '' };
export const selectUploadProgress = (state: { files: FilesState }) => state.files?.uploadProgress || {};
export const selectFilesByCategory = (category: string) => (state: { files: FilesState }) =>
  (state.files?.files || []).filter(file => file && (category === 'ALL' || file.category === category));
export const selectFilesCount = (state: { files: FilesState }) => (state.files?.files || []).length;
export const selectFilesSizeTotal = (state: { files: FilesState }) =>
  (state.files?.files || []).reduce((total, file) => total + (file?.size || 0), 0);
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isAddJobModalOpen: boolean;
  isEditJobModalOpen: boolean;
  editingJobId: string | null;
}

const initialState: UIState = {
  isAddJobModalOpen: false,
  isEditJobModalOpen: false,
  editingJobId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAddJobModal: (state) => {
      state.isAddJobModalOpen = true;
    },
    closeAddJobModal: (state) => {
      state.isAddJobModalOpen = false;
    },
    openEditJobModal: (state, action: PayloadAction<string>) => {
      state.isEditJobModalOpen = true;
      state.editingJobId = action.payload;
    },
    closeEditJobModal: (state) => {
      state.isEditJobModalOpen = false;
      state.editingJobId = null;
    },
  },
});

export const {
  openAddJobModal,
  closeAddJobModal,
  openEditJobModal,
  closeEditJobModal,
} = uiSlice.actions;

export default uiSlice.reducer;

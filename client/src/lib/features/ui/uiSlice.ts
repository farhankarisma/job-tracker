import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isEditModalOpen: boolean;
  editingApplicationId: string | null;
}

const initialState: UIState = {
  isEditModalOpen: false,
  editingApplicationId: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openEditModal: (state, action: PayloadAction<string>) => {
      state.isEditModalOpen = true;
      state.editingApplicationId = action.payload;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.editingApplicationId = null;
    },
  },
});

export const { openEditModal, closeEditModal } = uiSlice.actions;

export default uiSlice.reducer;

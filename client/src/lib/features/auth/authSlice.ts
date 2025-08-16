// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { User } from "@/lib/type";

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isSucces: boolean;
//   isLoading: boolean;
//   isError: boolean;
//   message: string;
// }

// const storedUser =
//   typeof window !== "undefined" && localStorage.getItem("user");
// const storedToken =
//   typeof window !== "undefined" ? localStorage.getItem("token") : null;
// console.log("Initial load - Reading from localStorage:", storedToken);

// const initialState: AuthState = {
//   user: storedUser ? JSON.parse(storedUser) : null,
//   token: storedToken,
//   isSucces: false,
//   isLoading: false,
//   isError: false,
//   message: "",
// };

// export const register = createAsyncThunk(
//   "auth/register",
//   async (userData: any, thunkAPI) => {
//     try {
//       const response = await fetch("${API_BASE_URL}/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         return thunkAPI.rejectWithValue(data.error || "Register failed");
//       }
//       return data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const login = createAsyncThunk(
//   "auth/login",
//   async (userData: any, thunkAPI) => {
//     try {
//       const response = await fetch("${API_BASE_URL}/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });
//       const data = await response.json();
//       if (!response.ok) {
//         return thunkAPI.rejectWithValue(data.error || "Login failed");
//       }
//       console.log("Login successful - Saving to localStorage:", data.token);
//       localStorage.setItem("token", data.token);
//       return data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue;
//     }
//   }
// );

// export const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     reset: (state) => {
//       state.isLoading = false;
//       state.isSucces = false;
//       state.isError = false;
//       state.message = "";
//     },
//     logout: (state) => {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user"); // Also good to remove the user object
//       state.user = null;
//       state.token = null;
//       state.isLoading = false;
//       state.isSucces = false;
//       state.isError = false;
//       state.message = "";
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(register.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(register.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSucces = true;
//         state.message = action.payload as string;
//       })
//       .addCase(register.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload as string;
//         state.user = null;
//       })
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.isSucces = true;
//         state.token = action.payload.token;
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isError = true;
//         state.message = action.payload as string;
//         state.user = null;
//       });
//   },
// });

// export const { reset, logout } = authSlice.actions;
// export default authSlice.reducer;

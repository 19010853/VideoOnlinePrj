import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import apiServer from '../../api/apiServer';
import type { RootState } from '..';

// Types
interface IUser {
  _id: string;
  email: string;
  name?: string;
  token: string;
  uploadCount: number;
  downloadCount: number;
}

export interface AuthState {
  loggedIn: IUser | null;
  isLoading: boolean;
}

interface ISignInPayload {
  email: string;
  password: string;
}

interface ISignUpPayload {
  email: string;
  password: string;
}


interface IAuthResponse {
  success: boolean;
  message: string;
  user?: IUser;
}

// Initial state
const initialState: AuthState = {
  loggedIn: null,
  isLoading: false,
}


// Async thunks
export const logInUser = createAsyncThunk<
  string | null,                // Kết quả trả về (fulfilled)
  ISignInPayload,       // Payload khi dispatch
  { rejectValue: string } // Giá trị reject
>(
  "auth/sign-in-user",
  async (payload, thunkAPI) => {
    try {
      const { email, password } = payload;

      const { data } = await apiServer.post<IAuthResponse>(
        "/api/v1/auth/sign-in",
        { email, password }
      );

      if (data.success && data.user) {
        // Lưu token + hiện thông báo
        toast.success("Login successful");
        localStorage.setItem("token", data.user.token);

        return data.user.token; // ✅ trả về cả user (IUser)
      } else {
        const msg = data.message || "Login failed";
        toast.error(msg);
        return thunkAPI.rejectWithValue(msg);
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || error.message || "An error occurred";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk<
  void,
  ISignUpPayload,
  { rejectValue: string }
>("auth/sign-up-user",
  async (payload) => {
    try {
      const { data } = await apiServer.post<IAuthResponse>(
        "/api/v1/auth/sign-up",
        payload
      );

      if (data.success) {
        toast.success("Register successful");
        return;
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  }
);

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.loggedIn = null;
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    },
    clearError: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(logInUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // Set loggedIn state when login is successful
          state.loggedIn = {
            _id: '',
            email: '',
            token: action.payload,
            uploadCount: 0,
            downloadCount: 0,
          };
        }
      })
      .addCase(logInUser.rejected, (state) => {
        state.isLoading = false;
      });

    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

// Export actions
export const { logout, clearError } = authSlice.actions;

// Export selectors
export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;

// Export the slice reducer
export default authSlice.reducer;



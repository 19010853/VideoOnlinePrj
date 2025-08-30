import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import apiServer from '../../api/apiServer';
import type { RootState } from '..';
import { useNavigate, type NavigateFunction } from 'react-router-dom';

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
  navigate: NavigateFunction;
}

interface ISignUpPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
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
      const { email, password, navigate } = payload;

      const { data } = await apiServer.post<IAuthResponse>(
        "/api/v1/auth/sign-in",
        { email, password }
      );

      if (data.success && data.user) {
        // Lưu token + hiện thông báo
        toast.success("Login successful");
        localStorage.setItem("token", data.user.token);
        navigate("/user/profile")

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

export const fetchUserDetails = createAsyncThunk<
  IUser | null,
  void,
  { rejectValue: string }
>("auth/fetch-user-details", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return thunkAPI.rejectWithValue("No token found");
    }

    const { data } = await apiServer.get<IAuthResponse>("/api/v1/user/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    )

    if (data.success && data.user) {
      return data.user;
    } else {
      return thunkAPI.rejectWithValue(data.message || "Failed to fetch user data");
    }

  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch user data")
  }
})

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOutUser: (state, action) => {
      const navigate = action.payload;
      localStorage.removeItem('token');
      state.loggedIn = null;
      toast.success('Logged out successfully');
      navigate('/sign-in');
    },

    updateUserDetails: (state, action) => {
      const { name, email } = action.payload;
      if (state.loggedIn) {
        state.loggedIn.name = name;
        state.loggedIn.email = email;
      }
    }
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

    // Fetch user details
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loggedIn = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserDetails.rejected, (state) => {
        state.isLoading = false;
      })
  }
});

// Export actions
export const { logOutUser, updateUserDetails } = authSlice.actions;

// Export selectors
export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;

// Export the slice reducer
export default authSlice.reducer;



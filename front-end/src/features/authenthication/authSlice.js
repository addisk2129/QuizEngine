
// features/auth/authSlice.js - Add updateProfile thunk
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authService';

// Async thunks
export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await authService.login(email, password);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    return await authService.signup(userData);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Signup failed');
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async ({ credential }, { rejectWithValue }) => {
  try {
    return await authService.googleLogin(credential);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Google login failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    return await authService.updateProfile(userData);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, { rejectWithValue }) => {
  try {
    return await authService.changePassword(passwordData);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to change password');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    return await authService.forgotPassword(email);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to send reset link');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, passwordData }, { rejectWithValue }) => {
  try {
    return await authService.resetPassword(token, passwordData);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
  return {};
});

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  message: null
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    };
    
    const handleRejected = (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    };
    
    builder
      // Login
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, handleRejected)
      // Signup
      .addCase(signup.pending, handlePending)
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.accessToken;
      })
      .addCase(signup.rejected, handleRejected)
      // Google Login
      .addCase(googleLogin.pending, handlePending)
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
        state.token = action.payload.accessToken;
      })
      .addCase(googleLogin.rejected, handleRejected)
      // Forgot Password
      .addCase(forgotPassword.pending, handlePending)
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(forgotPassword.rejected, handleRejected)
      // Reset Password
      .addCase(resetPassword.pending, handlePending)
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.accessToken) {
          state.isAuthenticated = true;
          state.user = action.payload.data.user;
          state.token = action.payload.accessToken;
        }
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, handleRejected)
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      // Change Password
      .addCase(changePassword.fulfilled, (state) => {})
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.message = null;
      });
  }
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
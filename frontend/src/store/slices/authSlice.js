import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// ---------------------------------------------------------------------------
// Async thunks — createAsyncThunk automatically dispatches
//   pending  → while the promise is in flight
//   fulfilled → on success (return value becomes action.payload)
//   rejected  → on failure (rejectWithValue string becomes action.payload)
// ---------------------------------------------------------------------------

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post('/auth/register', userData);
      return res.data; // UserOut
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Step 1: exchange credentials for a JWT
      const tokenRes = await axiosClient.post('/auth/login', credentials);
      const token = tokenRes.data.access_token;

      // Step 2: fetch the user profile.
      // The interceptor hasn't stored the new token in Redux yet (we're still
      // inside this thunk), so we pass the Authorization header manually.
      const userRes = await axiosClient.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { token, user: userRes.data }; // user includes role: { id, name }
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail ?? 'Login failed');
    }
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,  // JWT string — lives only in memory (not localStorage)
    user: null,   // { id, name, email, role_id, role: { id, name }, created_at }
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state) => { state.loading = false; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

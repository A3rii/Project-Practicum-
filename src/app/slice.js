import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authToken from "./../utils/authToken";
import Cookies from "js-cookie";
import axios from "axios";

const initialState = {
  currentUser: null,
  currentLessor: null,
  isLoading: false,
  error: null,
};

// Helper function to get token from localStorage and remove quotes

// Async thunk to register a new user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        userData
      );
      const { user, accessToken } = response.data;
      Cookies.set("token", accessToken, { expires: 7, secure: true });

      return { user, accessToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

export const registerLessor = createAsyncThunk(
  "auth/registerLessor",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/lessor/auth/register`,
        userData
      );
      const { lessor, accessToken } = response.data;

      // Storing token in  cookie
      Cookies.set("token", accessToken, { expires: 7, secure: true });

      return { lessor, accessToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

// Login User and get the token from backend to store on client
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userCredential, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        userCredential
      );
      const { user, accessToken } = response.data;

      Cookies.set("token", accessToken, { expires: 7, secure: true });

      return { user, accessToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

export const loginLessor = createAsyncThunk(
  "auth/loginLessor",
  async (userCredential, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/lessor/auth/login`,
        userCredential
      );
      const { lessor, accessToken } = response.data;

      Cookies.set("token", accessToken, { expires: 7, secure: true });

      return { lessor, accessToken };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

// Get user by authorizing JWT token that has been generated from backend
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const token = authToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          headers: {
            Accept: `application/json`,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

// Get lessor by authorizing JWT token that has been generated from backend
export const getCurrentLessor = createAsyncThunk(
  "auth/getCurrentLessor",
  async (_, thunkAPI) => {
    try {
      const token = authToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessor/auth/profile`,
        {
          headers: {
            Accept: `application/json`,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.lessor;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.errors || err.message
      );
    }
  }
);

// Create a user slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoading = false;
      state.currentUser = null;
      state.currentLessor = null;
      Cookies.remove("token");
    },
  },
  extraReducers: (builder) => {
    // Reducers for handling registration actions
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(registerLessor.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(registerLessor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLessor = action.payload;
      })
      .addCase(registerLessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Reducers for handling login actions
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set the error message
      });

    builder
      .addCase(loginLessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginLessor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLessor = action.payload;
      })
      .addCase(loginLessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // Set the error message
      });

    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getCurrentLessor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentLessor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLessor = action.payload;
      })
      .addCase(getCurrentLessor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export const { logout } = userSlice.actions;

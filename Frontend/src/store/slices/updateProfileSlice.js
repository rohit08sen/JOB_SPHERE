import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Create axios instance
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "/api/v1",
  withCredentials: true, // Always send cookies
});

const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    loading: false,
    error: null,
    isUpdated: false,
  },
  reducers: {
    updateProfileRequest(state) {
      state.loading = true;
    },
    updateProfileSuccess(state) {
      state.loading = false;
      state.isUpdated = true;
      state.error = null;
    },
    updateProfileFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    },
    updatePasswordRequest(state) {
      state.loading = true;
    },
    updatePasswordSuccess(state) {
      state.loading = false;
      state.isUpdated = true;
      state.error = null;
    },
    updatePasswordFailed(state, action) {
      state.loading = false;
      state.isUpdated = false;
      state.error = action.payload;
    },
    profileResetAfterUpdate(state) {
      state.loading = false;
      state.isUpdated = false;
      state.error = null;
    },
  },
});

// Update Profile
export const updateProfile = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.updateProfileRequest());
  try {
    await axiosInstance.put("/user/update/profile", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateProfileSlice.actions.updateProfileSuccess());
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.updateProfileFailed(
        error.response?.data?.message || "Failed to update profile."
      )
    );
  }
};

// Update Password
export const updatePassword = (data) => async (dispatch) => {
  dispatch(updateProfileSlice.actions.updatePasswordRequest());
  try {
    await axiosInstance.put("/user/update/password", data, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(updateProfileSlice.actions.updatePasswordSuccess());
  } catch (error) {
    dispatch(
      updateProfileSlice.actions.updatePasswordFailed(
        error.response?.data?.message || "Failed to update password."
      )
    );
  }
};

// Reset state
export const clearAllUpdateProfileErrors = () => (dispatch) => {
  dispatch(updateProfileSlice.actions.profileResetAfterUpdate());
};

export default updateProfileSlice.reducer;

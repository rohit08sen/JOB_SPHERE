import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Shared axios instance
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "/api/v1",
  withCredentials: true,
});

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    requestForAllApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllApplications(state, action) {
      state.loading = false;
      state.applications = action.payload;
      state.error = null;
    },
    failureForAllApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForMyApplications(state) {
      state.loading = true;
      state.error = null;
    },
    successForMyApplications(state, action) {
      state.loading = false;
      state.applications = action.payload;
      state.error = null;
    },
    failureForMyApplications(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForPostApplication(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForPostApplication(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    failureForPostApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    requestForDeleteApplication(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteApplication(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    failureForDeleteApplication(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    clearAllErrors(state) {
      state.error = null;
    },
    resetApplicationSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// Fetch applications for employer
export const fetchEmployerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForAllApplications());
  try {
    const { data } = await axiosInstance.get(`/application/employer/getall`);
    dispatch(
      applicationSlice.actions.successForAllApplications(data.applications)
    );
    dispatch(applicationSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForAllApplications(
        error.response?.data?.message || "Failed to fetch applications"
      )
    );
  }
};

// Fetch applications for job seeker
export const fetchJobSeekerApplications = () => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForMyApplications());
  try {
    const { data } = await axiosInstance.get(`/application/jobseeker/getall`);
    dispatch(
      applicationSlice.actions.successForMyApplications(data.applications)
    );
    dispatch(applicationSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForMyApplications(
        error.response?.data?.message || "Failed to fetch applications"
      )
    );
  }
};

// Post new application
export const postApplication = (formData, jobId) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForPostApplication());
  try {
    const { data } = await axiosInstance.post(
      `/application/post/${jobId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(applicationSlice.actions.successForPostApplication(data.message));
    dispatch(applicationSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForPostApplication(
        error.response?.data?.message || "Failed to submit application"
      )
    );
  }
};

// Delete application
export const deleteApplication = (id) => async (dispatch) => {
  dispatch(applicationSlice.actions.requestForDeleteApplication());
  try {
    const { data } = await axiosInstance.delete(`/application/delete/${id}`);
    dispatch(
      applicationSlice.actions.successForDeleteApplication(data.message)
    );
    dispatch(clearAllApplicationErrors());
  } catch (error) {
    dispatch(
      applicationSlice.actions.failureForDeleteApplication(
        error.response?.data?.message || "Failed to delete application"
      )
    );
  }
};

// Clear errors
export const clearAllApplicationErrors = () => (dispatch) => {
  dispatch(applicationSlice.actions.clearAllErrors());
};

// Reset slice state
export const resetApplicationSlice = () => (dispatch) => {
  dispatch(applicationSlice.actions.resetApplicationSlice());
};

export default applicationSlice.reducer;

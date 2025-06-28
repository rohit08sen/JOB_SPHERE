import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Create axios instance globally
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/api/v1"
      : "/api/v1",
  withCredentials: true,
});

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    message: null,
    singleJob: {},
    myJobs: [],
  },
  reducers: {
    requestForAllJobs(state) {
      state.loading = true;
      state.error = null;
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.jobs = action.payload;
      state.error = null;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForSingleJob(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForSingleJob(state, action) {
      state.loading = false;
      state.singleJob = action.payload;
      state.error = null;
    },
    failureForSingleJob(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    requestForPostJob(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForPostJob(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    failureForPostJob(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    requestForDeleteJob(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteJob(state, action) {
      state.loading = false;
      state.message = action.payload;
      state.error = null;
    },
    failureForDeleteJob(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    requestForMyJobs(state) {
      state.loading = true;
      state.error = null;
      state.myJobs = [];
    },
    successForMyJobs(state, action) {
      state.loading = false;
      state.myJobs = action.payload;
      state.error = null;
    },
    failureForMyJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    clearAllErrors(state) {
      state.error = null;
    },
    resetJobSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
      state.singleJob = {};
    },
  },
});

// Fetch all jobs
export const fetchJobs =
  (city, niche, searchKeyword = "") =>
  async (dispatch) => {
    dispatch(jobSlice.actions.requestForAllJobs());
    try {
      let link = "/job/getall?";
      const params = [];
      if (searchKeyword) params.push(`searchKeyword=${searchKeyword}`);
      if (city && city !== "All") params.push(`city=${city}`);
      if (niche && niche !== "All") params.push(`niche=${niche}`);
      link += params.join("&");

      const { data } = await axiosInstance.get(link);
      dispatch(jobSlice.actions.successForAllJobs(data.jobs));
      dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(
        jobSlice.actions.failureForAllJobs(
          error.response?.data?.message || "Something went wrong"
        )
      );
    }
  };

// Fetch single job
export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSingleJob());
  try {
    const { data } = await axiosInstance.get(`/job/get/${jobId}`);
    dispatch(jobSlice.actions.successForSingleJob(data.job));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      jobSlice.actions.failureForSingleJob(
        error.response?.data?.message || "Failed to load job"
      )
    );
  }
};

// Post new job
export const postJob = (jobData) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForPostJob());
  try {
    const { data } = await axiosInstance.post(`/job/postjob`, jobData, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(jobSlice.actions.successForPostJob(data.message));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      jobSlice.actions.failureForPostJob(
        error.response?.data?.message || "Failed to post job"
      )
    );
  }
};

// Get my jobs
export const getMyJobs = () => async (dispatch) => {
  dispatch(jobSlice.actions.requestForMyJobs());
  try {
    const { data } = await axiosInstance.get(`/job/getmyjobs`);
    dispatch(jobSlice.actions.successForMyJobs(data.myJobs));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      jobSlice.actions.failureForMyJobs(
        error.response?.data?.message || "Failed to load my jobs"
      )
    );
  }
};

// Delete job
export const deleteJob = (id) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForDeleteJob());
  try {
    const { data } = await axiosInstance.delete(`/job/delete/${id}`);
    dispatch(jobSlice.actions.successForDeleteJob(data.message));
    dispatch(clearAllJobErrors());
  } catch (error) {
    dispatch(
      jobSlice.actions.failureForDeleteJob(
        error.response?.data?.message || "Failed to delete job"
      )
    );
  }
};

// Clear errors
export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllErrors());
};

// Reset slice
export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice());
};

export default jobSlice.reducer;

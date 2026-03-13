import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/user-login", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk("/registerUser",
  async (data,{ rejectWithValue })=>{
    try {
      const res = await api.post("/admin/registerUser", data);
      return res.data;
    } catch (error) {
       return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
)
export const sendOtpEmail = createAsyncThunk("/sendOtpEmail",
  async(data,{rejectWithValue})=>{
    try {
       const res = await api.post("/admin/send-otp-email", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "send otp failed")
    }
  }
)
export const verifyOtpEmail = createAsyncThunk("/verifyOtpEmail",
  async(data,{rejectWithValue})=>{
    try {
       const res = await api.post("/admin/verify-otp-email", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "verify otp failed")
    }
  }
)

export const sendOtpMobile = createAsyncThunk("/sendOtpMobile",
  async(data,{rejectWithValue})=>{
    try {
       const res = await api.post("/admin/send-otp", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "send otp failed")
    }
  }
)
export const verifyOtpMobile = createAsyncThunk("/verifyOtpMobile",
  async(data,{rejectWithValue})=>{
    try {
       const res = await api.post("/admin/verify-otp", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "verify otp failed")
    }
  }
)
export const listServices = createAsyncThunk("/listServices",
  async(data,{rejectWithValue})=>{
    try {
       const res = await api.post("/admin/listService", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "verify otp failed")
    }
  }
)

export const listSectionByGender = createAsyncThunk(
  "auth/listGender",
  async (data) => {
    const res = await api.post("/admin/gender", data);
    return res.data;
  }
);
export const listStaffs = createAsyncThunk(
  "auth/getStaff",
  async (data) => {
    const res = await api.post("/admin/getStaff", data);
    return res.data;
  }
);
export const bookAppointment = createAsyncThunk(
  "auth/book-appointment",
  async (data) => {
    const res = await api.post("/admin/book-appointment", data);
    return res.data;
  }
);
export const getAppointmentHistory = createAsyncThunk(
  "auth/get-appointment",
  async (data) => {
    const res = await api.get("/admin/get-appointment", data);
    return res.data;
  }
);
export const getAppointmentAvailability = createAsyncThunk(
  "auth/get-available-slots",
  async (data) => {
    const res = await api.post("/admin/get-available-slots", data);
    return res.data;
  }
);
export const getNotificationForAdmin = createAsyncThunk(
  "auth/getNotificationForAdmin",
  async (data) => {
    const res = await api.post("/admin/user", data);
    return res.data;
  }
);
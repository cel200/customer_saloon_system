// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import {
  authReducer,
  bookAppointmentReducer,
  getAppointmentAvailabilityReducer,
  getAppointmentHistoryReducer,
  getNotificationForAdminReducer,
  listSectionByGenderReducer,
  listServicesReducer,
  listStaffsReducer,
  registerUserReducer,
  sendOtpEmailReducer,
  sendOtpMobileReducer,
  verifyOtpEmailReducer,
  verifyOtpMobileReducer,
} from "./userSlice";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    registerUser: registerUserReducer,
    sendOtpEmail: sendOtpEmailReducer,
    verifyOtpEmail: verifyOtpEmailReducer,
    sendOtpMobile: sendOtpMobileReducer,
    verifyOtpMobile: verifyOtpMobileReducer,
    listServices: listServicesReducer,
    listSectionByGender:listSectionByGenderReducer,
    listStaffs:listStaffsReducer,
    bookAppointment:bookAppointmentReducer,
    getAppointmentHistory:getAppointmentHistoryReducer,
    getAppointmentAvailability:getAppointmentAvailabilityReducer,
    getNotificationForAdmin:getNotificationForAdminReducer
  }
});

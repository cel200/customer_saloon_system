const { createSlice } = require('@reduxjs/toolkit');
const { loginUser, registerUser, sendOtpEmail, verifyOtpEmail, sendOtpMobile, verifyOtpMobile, listServices, listSectionByGender, listStaffs, bookAppointment, getAppointmentHistory, getAppointmentAvailability, getNotificationForAdmin, getFeaturedServices } = require('./userThunk');
const Cookies = require('js-cookie');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    hydrateAuth: (state, action) => {
      state.user = action.payload || null;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('user');
        Cookies.remove('userToken');
        Cookies.remove('userId');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const userData = action.payload?.user || action.payload?.data || action.payload;
        state.loading = false;
        state.user = userData;
        if (typeof window !== 'undefined' && userData) {
          window.localStorage.setItem('user', JSON.stringify(userData));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const registerUserSlice = createSlice({
  name: 'registerUser',
  initialState: {
    userData: null,
    userLoading: false,
    userError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.userLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userLoading = false;
        state.userError = action.payload;
      });
  },
});

const sendOtpEmailSlice = createSlice({
  name: 'sendOtpEmail',
  initialState: {
    sendOtpEmailData: null,
    sendOtpEmailLoading: false,
    sendOtpEmailError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpEmail.pending, (state) => {
        state.sendOtpEmailLoading = true;
      })
      .addCase(sendOtpEmail.fulfilled, (state, action) => {
        state.sendOtpEmailLoading = false;
        state.sendOtpEmailData = action.payload;
      })
      .addCase(sendOtpEmail.rejected, (state, action) => {
        state.sendOtpEmailLoading = false;
        state.sendOtpEmailError = action.payload;
      });
  },
});

const verifyOtpEmailSlice = createSlice({
  name: 'verifyOtpEmail',
  initialState: {
    verifyOtpEmailData: null,
    verifyOtpEmailLoading: false,
    verifyOtpEmailError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpEmail.pending, (state) => {
        state.verifyOtpEmailLoading = true;
      })
      .addCase(verifyOtpEmail.fulfilled, (state, action) => {
        state.verifyOtpEmailLoading = false;
        state.verifyOtpEmailData = action.payload;
      })
      .addCase(verifyOtpEmail.rejected, (state, action) => {
        state.verifyOtpEmailLoading = false;
        state.verifyOtpEmailError = action.payload;
      });
  },
});

const sendOtpMobileSlice = createSlice({
  name: 'sendOtpMobile',
  initialState: {
    sendOtpMobileData: null,
    sendOtpMobileLoading: false,
    sendOtpMobileError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpMobile.pending, (state) => {
        state.sendOtpMobileLoading = true;
      })
      .addCase(sendOtpMobile.fulfilled, (state, action) => {
        state.sendOtpMobileLoading = false;
        state.sendOtpMobileData = action.payload;
      })
      .addCase(sendOtpMobile.rejected, (state, action) => {
        state.sendOtpMobileLoading = false;
        state.sendOtpMobileError = action.payload;
      });
  },
});

const verifyOtpMobileSlice = createSlice({
  name: 'verifyOtpMobile',
  initialState: {
    verifyOtpMobileData: null,
    verifyOtpMobileLoading: false,
    verifyOtpMobileError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtpMobile.pending, (state) => {
        state.verifyOtpMobileLoading = true;
      })
      .addCase(verifyOtpMobile.fulfilled, (state, action) => {
        state.verifyOtpMobileLoading = false;
        state.verifyOtpMobileData = action.payload;
      })
      .addCase(verifyOtpMobile.rejected, (state, action) => {
        state.verifyOtpMobileLoading = false;
        state.verifyOtpMobileError = action.payload;
      });
  },
});

const listServicesSlice = createSlice({
  name: 'listServices',
  initialState: {
    listServicesData: null,
    listServicesLoading: false,
    listServicesError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listServices.pending, (state) => {
        state.listServicesLoading = true;
      })
      .addCase(listServices.fulfilled, (state, action) => {
        state.listServicesLoading = false;
        state.listServicesData = action.payload;
      })
      .addCase(listServices.rejected, (state, action) => {
        state.listServicesLoading = false;
        state.listServicesError = action.payload;
      });
  },
});
const listSectionByGenderSlice = createSlice({
  name: "listSectionByGender",
  initialState: {
    listSectionByGenderData: null,
    listSectionByGenderLoading: false,
    listSectionByGenderError: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(listSectionByGender.pending, (state) => {
        state.listSectionByGenderLoading = true;
      })
      .addCase(listSectionByGender.fulfilled, (state, action) => {
        state.listSectionByGenderLoading = false;
        state.listSectionByGenderData = action.payload;
      })
      .addCase(listSectionByGender.rejected, (state, action) => {
        state.listSectionByGenderLoading = false;
        state.listSectionByGenderError = action.error.message;
      });
  },
});
const listStaffsSlice = createSlice({
  name: "listStaffs",
  initialState: {
    listStaffsData: null,
    listStaffsLoading: false,
    listStaffsError: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(listStaffs.pending, (state) => {
        state.listStaffsLoading = true;
      })
      .addCase(listStaffs.fulfilled, (state, action) => {
        state.listStaffsLoading = false;
        state.listStaffsData = action.payload;
      })
      .addCase(listStaffs.rejected, (state, action) => {
        state.listStaffsLoading = false;
        state.listStaffsError = action.error.message;
      });
  },
});
const bookAppointmentSlice = createSlice({
  name: "bookAppointment",
  initialState: {
    bookAppointmentData: null,
    bookAppointmentLoading: false,
    bookAppointmentError: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.bookAppointmentLoading = true;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.bookAppointmentLoading = false;
        state.bookAppointmentData = action.payload;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.bookAppointmentLoading = false;
        state.bookAppointmentError = action.error.message;
      });
  },
});
const getAppointmentHistorySlice = createSlice({
  name: "getAppointmentHistory",
  initialState: {
    getAppointmentHistoryData: null,
    getAppointmentHistoryLoading: false,
    getAppointmentHistoryError: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentHistory.pending, (state) => {
        state.getAppointmentHistoryLoading = true;
      })
      .addCase(getAppointmentHistory.fulfilled, (state, action) => {
        state.getAppointmentHistoryLoading = false;
        state.getAppointmentHistoryData = action.payload;
      })
      .addCase(getAppointmentHistory.rejected, (state, action) => {
        state.getAppointmentHistoryLoading = false;
        state.getAppointmentHistoryError = action.error.message;
      });
  },
});
const getAppointmentAvailabilitySlice = createSlice({
  name: "getAppointmentAvailability",
  initialState: {
    getAppointmentAvailabilityData: null,
    getAppointmentAvailabilityLoading: false,
    getAppointmentAvailabilityError: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAppointmentAvailability.pending, (state) => {
        state.getAppointmentAvailabilityLoading = true;
      })
      .addCase(getAppointmentAvailability.fulfilled, (state, action) => {
        state.getAppointmentAvailabilityLoading = false;
        state.getAppointmentAvailabilityData = action.payload;
      })
      .addCase(getAppointmentAvailability.rejected, (state, action) => {
        state.getAppointmentAvailabilityLoading = false;
        state.getAppointmentAvailabilityError = action.error.message;
      });
  },
});
const getNotificationForAdminSlice = createSlice({
  name: "getNotificationForAdmin",
  initialState: {
  getNotificationForAdminData: null,
 getNotificationForAdminLoading: false,
   getNotificationForAdminError: null,
  },
 
  extraReducers: (builder) => {
    builder
      .addCase( getNotificationForAdmin.pending, (state) => {
        state.getNotificationForAdminLoading = true;
      })
      .addCase(getNotificationForAdmin.fulfilled, (state, action) => {
        state.getNotificationForAdminLoading = false;
        state.getNotificationForAdminData = action.payload;
      })
      .addCase(getNotificationForAdmin.rejected, (state, action) => {
        state.getNotificationForAdminLoading = false;
        state.getNotificationForAdminError = action.error.message;
      });
  },
});

const getFeaturedServicesSlice = createSlice({
  name: "getFeaturedServices",
  initialState: {
 getFeaturedServicesData: null,
 getFeaturedServicesLoading: false,
   getFeaturedServicesError: null,
  },
 
  extraReducers: (builder) => {
    builder
      .addCase( getFeaturedServices.pending, (state) => {
        state.getFeaturedServicesLoading = true;
      })
      .addCase(getFeaturedServices.fulfilled, (state, action) => {
        state.getFeaturedServicesLoading = false;
        state.getFeaturedServicesData = action.payload;
      })
      .addCase(getFeaturedServices.rejected, (state, action) => {
        state.getFeaturedServicesLoading = false;
        state.getFeaturedServicesError = action.error.message;
      });
  },
});
export const authReducer = authSlice.reducer;
export const { hydrateAuth, logout } = authSlice.actions;
export const registerUserReducer = registerUserSlice.reducer;
export const sendOtpEmailReducer = sendOtpEmailSlice.reducer;
export const verifyOtpEmailReducer = verifyOtpEmailSlice.reducer;
export const verifyOtpMobileReducer = verifyOtpMobileSlice.reducer;
export const sendOtpMobileReducer = sendOtpMobileSlice.reducer;
export const listServicesReducer = listServicesSlice.reducer;
export const listSectionByGenderReducer = listSectionByGenderSlice.reducer;
export const listStaffsReducer = listStaffsSlice.reducer;
export const bookAppointmentReducer = bookAppointmentSlice.reducer;
export const getAppointmentHistoryReducer = getAppointmentHistorySlice.reducer;
export const getAppointmentAvailabilityReducer = getAppointmentAvailabilitySlice.reducer;
export const getNotificationForAdminReducer = getNotificationForAdminSlice.reducer;
export const getFeaturedServicesReducer = getFeaturedServicesSlice.reducer
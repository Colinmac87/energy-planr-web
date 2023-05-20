import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    user: null,
    loginAttempted: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loginAttempted = true;
    },
    unsetUser: (state) => {
      state.user = null;
      state.loginAttempted = false;
    },
  },
});

export const { setUser, unsetUser } = accountSlice.actions;

export default accountSlice.reducer;

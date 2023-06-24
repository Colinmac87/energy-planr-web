import { createSlice } from "@reduxjs/toolkit";

export const systemSlice = createSlice({
  name: "system",
  initialState: {
    colorMode: localStorage.getItem("colorMode") || "dark",
  },
  reducers: {
    toggleColorMode: (state, action) => {
      let colorMode = state.colorMode == "dark" ? "light" : "dark";
      state.colorMode = colorMode;
      localStorage.setItem("colorMode", colorMode);
    },
  },
});

export const { toggleColorMode } = systemSlice.actions;

export default systemSlice.reducer;

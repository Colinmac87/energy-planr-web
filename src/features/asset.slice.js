import { createSlice } from "@reduxjs/toolkit";

export const assetSlice = createSlice({
  name: "asset",
  initialState: {
    asset: null,
    registers: [],
  },
  reducers: {
    setAsset: (state, action) => {
      state.asset = action.payload;
    },
    setRegisters: (state, action) => {
      state.registers = action.payload;
    },
  },
});

export const { setAsset, setRegisters } = assetSlice.actions;

export default assetSlice.reducer;

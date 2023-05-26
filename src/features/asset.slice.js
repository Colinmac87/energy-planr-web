import { createSlice } from "@reduxjs/toolkit";

export const assetSlice = createSlice({
  name: "asset",
  initialState: {
    asset: null,
  },
  reducers: {
    setAsset: (state, action) => {
      state.asset = action.payload;
    },
  },
});

export const { setAsset } = assetSlice.actions;

export default assetSlice.reducer;

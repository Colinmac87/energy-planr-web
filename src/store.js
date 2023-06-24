import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./features/account.slice";
import assetReducer from "./features/asset.slice";
import systemReducer from "./features/system.slice";

export default configureStore({
  reducer: {
    account: accountReducer,
    asset: assetReducer,
    system: systemReducer,
  },
});

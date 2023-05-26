import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./features/account.slice";
import assetReducer from "./features/asset.slice";

export default configureStore({
  reducer: { account: accountReducer, asset: assetReducer },
});

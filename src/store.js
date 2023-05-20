import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./features/account.slice";

export default configureStore({
  reducer: { account: accountReducer },
});

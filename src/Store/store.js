import { configureStore } from "@reduxjs/toolkit";
import querySlice from "./Slices/querySlice";

const rootReducer = {
  query: querySlice.reducer,
};

const store = configureStore({ reducer: rootReducer });

export default store;

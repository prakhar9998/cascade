import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import { socketMiddleware } from "../middlewares/socketMiddleware";

import rootReducer from "./rootReducer";

const middleware = [...getDefaultMiddleware(), socketMiddleware];

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export default store;

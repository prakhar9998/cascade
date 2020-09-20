import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import socketMiddleware from "../middlewares/socketMiddleware";
import optimisticUpdatesMiddleware from "../middlewares/optimisticUpdatesMiddleware";

import rootReducer from "./rootReducer";

const middleware = [
  ...getDefaultMiddleware(),
  socketMiddleware,
  optimisticUpdatesMiddleware,
];

const store = configureStore({
  reducer: rootReducer,
  middleware,
});

export default store;

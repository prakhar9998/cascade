import { combineReducers } from "@reduxjs/toolkit";
import boardsReducer from "../features/boards/boardsSlice";

const rootReducer = combineReducers({
  boards: boardsReducer,
});

export default rootReducer;

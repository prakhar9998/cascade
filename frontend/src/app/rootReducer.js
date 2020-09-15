import { combineReducers } from "@reduxjs/toolkit";
import boardsListReducer from "../features/boardsList/boardsListSlice";
import boardReducer from "../features/board/boardSlice";

const rootReducer = combineReducers({
  boards: boardsListReducer,
  board: boardReducer,
});

export default rootReducer;

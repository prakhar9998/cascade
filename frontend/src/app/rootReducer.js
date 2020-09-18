import { combineReducers } from "@reduxjs/toolkit";
import boardsListReducer from "../features/boardsList/boardsListSlice";
import boardReducer from "../features/board/boardSlice";
import profileReducer from "../features/profile/profileSlice";

const rootReducer = combineReducers({
  boards: boardsListReducer,
  board: boardReducer,
  profile: profileReducer,
});

export default rootReducer;

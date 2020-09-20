import { combineReducers } from "@reduxjs/toolkit";
import boardsListReducer from "../features/boardsList/boardsListSlice";
import boardReducer from "../features/board/boardSlice";
import profileReducer from "../features/profile/profileSlice";
import { optimistic } from "redux-optimistic-ui";

const rootReducer = combineReducers({
  boards: boardsListReducer,
  board: optimistic(boardReducer),
  profile: profileReducer,
});

export default rootReducer;

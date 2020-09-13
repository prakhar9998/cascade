import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/config";

const initialState = {
  boardsData: [],
  status: "idle",
  error: null,
};

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL + "/api/board/all", {
        withCredentials: true,
      });
      console.log(res.data);
      return res.data.data;
    } catch (err) {
      console.log("e", err.response.data.success);
      return rejectWithValue(err.response.data);
    }
  }
);

const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard(state, action) {
      const { id, title, description, creator, members } = action.payload;
      state.boards.push({ id, title, description, creator, members });
    },
    updateBoard(state, action) {
      const { id, title, description } = action.payload;
      const existingBoard = state.find((board) => board.id === id);
      if (existingBoard) {
        existingBoard.title = title;
        existingBoard.description = description;
      }
    },
  },
  extraReducers: {
    [fetchBoards.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchBoards.fulfilled]: (state, action) => {
      state.status = "succeeded";
      console.log("ac", action.payload.boards);
      state.boardsData = action.payload.boards;
    },
    [fetchBoards.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload.message;
    },
  },
});

export const { boardAdded, boardUpdated } = boardsSlice.actions;

export default boardsSlice.reducer;

// selectors
export const selectAllBoards = (state) => state.boards.boardsData;

export const selectBoardById = (state, boardId) =>
  state.boards.boardsData.find((board) => board.id === boardId);

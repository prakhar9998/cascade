import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/config";

const initialState = {
  boardsData: [],
  status: "idle",
  error: null,
};

export const fetchBoardsList = createAsyncThunk(
  "boards/fetchBoardsList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL + "/api/board/all", {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const addBoard = createAsyncThunk(
  "boards/addBoard",
  async (boardData) => {
    const response = await axios.post(
      `${API_URL}/api/board/create`,
      boardData,
      { withCredentials: true }
    );
    return response.data.data;
  }
);

export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async (boardId) => {
    const response = await axios.delete(`${API_URL}/api/board/${boardId}`, {
      withCredentials: true,
    });
    return boardId;
  }
);

const boardsListSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    updateBoard(state, action) {
      const { id, title, description } = action.payload;
      const existingBoard = state.find((board) => board._id === id);
      if (existingBoard) {
        existingBoard.title = title;
        existingBoard.description = description;
      }
    },
  },
  extraReducers: {
    [fetchBoardsList.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchBoardsList.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.boardsData = action.payload.boards;
    },
    [fetchBoardsList.rejected]: (state, action) => {
      state.status = "failed";
      if (action.payload.message) {
        state.error = action.payload.message;
      }
      state.error = "Something went wrong! Please try again!";
    },

    // create
    [addBoard.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.boardsData.push(action.payload);
    },

    // delete
    [deleteBoard.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.error = null;
      const index = state.boardsData.findIndex(
        (board) => board._id === action.payload
      );
      state.boardsData.splice(index, 1);
    },
  },
});

export const { updateBoard } = boardsListSlice.actions;

export default boardsListSlice.reducer;

// selectors
export const selectAllBoards = (state) => state.boards.boardsData;

export const selectBoardById = (state, boardId) =>
  state.boards.boardsData.find((board) => board._id === boardId);

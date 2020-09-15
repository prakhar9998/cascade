import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/config";
import APIErrorHandler from "../../utils/APIErrorHandler";

const initialState = {
  data: [],
  status: "idle",
  error: null,
};

export const fetchBoard = createAsyncThunk(
  "board/fetchBoard",
  async (boardId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/api/board/${boardId}`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      const errMsg = APIErrorHandler(err);
      return rejectWithValue(errMsg);
    }
  }
);

export const addList = createAsyncThunk(
  "board/addList",
  async (boardId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/list/create`, {
        withCredentials: true,
      });
      console.log(res);
    } catch (err) {
      return err;
    }
  }
);

export const addCard = createAsyncThunk(
  "board/addCard",
  async (boardId, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/card/create`, {
        withCredentials: true,
      });
      console.log(res);
    } catch (err) {
      const errMsg = APIErrorHandler(err);
      rejectWithValue(errMsg);
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addListToBoard(state, action) {
      const { title } = action.payload;
    },
  },
  extraReducers: {
    // Retrieve board
    [fetchBoard.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchBoard.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    [fetchBoard.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },

    // CRUD List
    [addList.fulfilled]: (state, action) => {
      // update list in the state
      state.status = "succeeded";
    },

    // CRUD Card
    [addCard.fulfilled]: (state, action) => {
      state.status = "succeeded";
    },
  },
});

export const { addListToBoard } = boardSlice.actions;

export default boardSlice.reducer;

// selectors
export const selectBoard = (state) => state.board.data;

export const selectAllLists = (state) => state.board.data.lists;

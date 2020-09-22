import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_URL from "../../config/config";
import APIErrorHandler from "../../utils/APIErrorHandler";

const initialState = {
  data: {},
  status: "idle",
  errors: null,
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
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/list/create`,
        { title: payload.title, boardId: payload.boardId },
        {
          withCredentials: true,
        }
      );
      console.log("shouldnt print");
      return res.data.data;
    } catch (err) {
      console.log("Erro from list create", err);
      const errMsg = APIErrorHandler(err);
      return rejectWithValue(errMsg);
    }
  }
);

export const addCard = createAsyncThunk(
  "board/addCard",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/card/create`,
        {
          title: payload.title,
          listId: payload.listId,
          boardId: payload.boardId,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res.data.data);
      return res.data.data;
    } catch (err) {
      const errMsg = APIErrorHandler(err);
      return rejectWithValue(errMsg);
    }
  }
);

export const addMember = createAsyncThunk(
  "board/addMember",
  async (payload, { rejectWithValue }) => {
    const { email, boardId } = payload;
    const res = await axios.post(
      `${API_URL}/api/board/${boardId}/addmember`,
      { email },
      { withCredentials: true }
    );
    return res.data.data;
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    changeCardPosition: {
      reducer(state, action) {
        const { source, destination, listId } = action.payload.payload;
        // finding list
        const listIndex = state.data.lists.findIndex(
          (list) => list._id === listId
        );

        if (listIndex === -1) {
          return;
        }

        // reordering cards inplace (immer magic)
        state.data.lists[listIndex].cards.splice(
          destination,
          0,
          state.data.lists[listIndex].cards.splice(source, 1)[0]
        );
      },
      prepare(payload) {
        // adding metadata for optimistic updates here
        return {
          payload: { payload },
          meta: { isOptimistic: true },
        };
      },
    },
    moveCardToList(state, action) {
      const {
        source,
        destination,
        sourceListId,
        destinationListId,
      } = action.payload;

      const srcListIndex = state.data.lists.findIndex(
        (list) => list._id === sourceListId
      );
      const desListIndex = state.data.lists.findIndex(
        (list) => list._id === destinationListId
      );

      state.data.lists[desListIndex].cards.splice(
        destination,
        0,
        state.data.lists[srcListIndex].cards.splice(source, 1)[0]
      );
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
      // update lists array in the state
      state.data.lists.push(action.payload);
      state.status = "succeeded";
    },
    [addList.rejected]: (state, action) => {
      console.log("add list error", action.payload);
    },

    // CRUD Card
    [addCard.fulfilled]: (state, action) => {
      const { listId } = action.payload;

      // appending card at the bottom of the list
      const listIndex = state.data.lists.findIndex(
        (list) => list._id === listId
      );

      console.log("list index", listIndex);
      console.log("list id", listId);
      console.log("payload", action.payload);
      state.data.lists[listIndex].cards.push(action.payload);

      state.status = "succeeded";
    },

    [addMember.fulfilled]: (state, action) => {
      console.log("member added", action.payload);
    },
  },
});

export const { changeCardPosition, moveCardToList } = boardSlice.actions;

export default boardSlice.reducer;

// selectors (use state.current because of redux-optimistic-ui reducer enhancer)
export const selectBoard = (state) => state.board.current.data;

export const selectAllLists = (state) => state.board.current.data.lists;

export const selectAllMembers = (state) => state.board.current.data.members;

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
      return res.data.data;
    } catch (err) {
      const errMsg = APIErrorHandler(err);
      return rejectWithValue(errMsg);
    }
  }
);

export const updateListTitle = createAsyncThunk(
  "board/updateListTitle",
  async (payload) => {
    const { listId, title } = payload;
    const res = await axios.put(
      `${API_URL}/api/list/${listId}`,
      { title },
      { withCredentials: true }
    );
    return res.data.data;
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
  async (payload) => {
    const { email, boardId } = payload;
    const res = await axios.post(
      `${API_URL}/api/board/${boardId}/addmember`,
      { email },
      { withCredentials: true }
    );
    return res.data.data;
  }
);

export const addLabelToCard = createAsyncThunk(
  "board/addLabelToCard",
  async (payload) => {
    const { name, color, cardId } = payload;
    const res = await axios.post(
      `${API_URL}/api/card/${cardId}/addlabel`,
      { name, color },
      { withCredentials: true }
    );
    return res.data.data;
  }
);

export const assignMemberToCard = createAsyncThunk(
  "board/assignMemberToCard",
  async (payload) => {
    const { email, boardId, cardId } = payload;
    const res = await axios.post(
      `${API_URL}/api/card/assign`,
      { email, boardId, cardId },
      { withCredentials: true }
    );
    return res.data.data;
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateFullBoard(state, action) {
      state.data = action.payload;
    },
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

    [addMember.fulfilled]: (state, action) => {
      state.data = action.payload;
      console.log("member added", action.payload);
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
    [updateListTitle.fulfilled]: (state, action) => {
      const listIndex = state.data.lists.findIndex(
        (list) => list._id === action.payload.id
      );
      console.log("index list", listIndex);
      console.log("action ", action.payload);
      if (listIndex !== -1) {
        state.data.lists[listIndex].title = action.payload.title;
      }
    },

    // CRUD Card
    [addCard.fulfilled]: (state, action) => {
      const { listId } = action.payload;

      // appending card at the bottom of the list
      const listIndex = state.data.lists.findIndex(
        (list) => list._id === listId
      );

      state.data.lists[listIndex].cards.push(action.payload);
    },
    // TODO: remove code duplication here
    [addLabelToCard.fulfilled]: (state, action) => {
      const { _id, listId } = action.payload;

      const listIndex = state.data.lists.findIndex(
        (list) => list._id === listId
      );
      const cardIndex = state.data.lists[listIndex].cards.findIndex(
        (card) => card._id === _id
      );

      if (cardIndex !== -1 && listIndex !== -1) {
        console.log("indexes", cardIndex, listIndex);
        state.data.lists[listIndex].cards[cardIndex] = action.payload;
      }
    },
    [assignMemberToCard.fulfilled]: (state, action) => {
      const { _id, listId } = action.payload;

      const listIndex = state.data.lists.findIndex(
        (list) => list._id === listId
      );
      const cardIndex = state.data.lists[listIndex].cards.findIndex(
        (card) => card._id === _id
      );

      if (cardIndex !== -1 && listIndex !== -1) {
        state.data.lists[listIndex].cards[cardIndex] = action.payload;
      }
    },
  },
});

export const {
  changeCardPosition,
  moveCardToList,
  updateFullBoard,
} = boardSlice.actions;

export default boardSlice.reducer;

// selectors (use state.current because of redux-optimistic-ui reducer enhancer)
export const selectBoard = (state) => state.board.current.data;

export const selectAllLists = (state) => state.board.current.data.lists;

export const selectAllMembers = (state) => state.board.current.data.members;

export const getMemberById = (state, userId) =>
  state.board.current.data.members.find((member) => userId === member._id);

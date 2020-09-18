import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  profile: {},
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addProfile(state, action) {
      const { _id, firstname, lastname, email } = action.payload;
      console.log("dispatched");
      state.profile = {
        _id: _id,
        firstname: firstname,
        lastname: lastname,
        email: email,
      };
    },
  },
});

export const { addProfile } = profileSlice.actions;

export default profileSlice.reducer;

export const selectProfile = (state) => state.profile.profile;

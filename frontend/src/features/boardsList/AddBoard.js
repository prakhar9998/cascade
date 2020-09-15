import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBoard } from "./boardsListSlice";

export const AddBoard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const onTitleChange = (e) => setTitle(e.target.value);
  const onDescriptionChange = (e) => setDescription(e.target.value);

  const isValid = Boolean(title) && addRequestStatus == "idle";

  const handleAddBoardClick = async () => {
    if (isValid) {
      try {
        setAddRequestStatus("loading");
        const result = await dispatch(addBoard({ title, description }));
        unwrapResult(result);
        setTitle("");
        setDescription("");
      } catch (err) {
        console.error("Failed to save board:", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <div>
      <h2>Add a new board:</h2>
      <form>
        <label htmlFor="boardTitle">Board Title</label>
        <input
          type="text"
          id="boardTitle"
          name="boardTitle"
          placeholder="Title"
          value={title}
          onChange={onTitleChange}
          required
        />

        <label htmlFor="boardDescription">Board Description</label>
        <input
          type="text"
          id="boardDescription"
          name="boardDescription"
          placeholder="What's this board about?"
          value={description}
          onChange={onDescriptionChange}
        />

        <button type="button" onClick={handleAddBoardClick} disabled={!isValid}>
          Save Board
        </button>
      </form>
    </div>
  );
};

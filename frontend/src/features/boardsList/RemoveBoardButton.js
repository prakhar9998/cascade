import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteBoard } from "./boardsListSlice";

export const RemoveBoardButton = (props) => {
  const dispatch = useDispatch();

  const removeButton = async () => {
    const result = await dispatch(deleteBoard(props.boardId));
  };

  return (
    <div>
      <button type="button" onClick={removeButton}>
        Delete
      </button>
    </div>
  );
};

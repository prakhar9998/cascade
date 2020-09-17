import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddBoard } from "./AddBoard";
import { selectAllBoards, fetchBoardsList } from "./boardsListSlice";
import { RemoveBoardButton } from "./RemoveBoardButton";

export const BoardsList = () => {
  const boards = useSelector(selectAllBoards);

  const renderBoards = boards.map((board) => (
    <div key={board._id}>
      <h2>Title: {board.title}</h2>
      <h4>Description: {board.description}</h4>
      <RemoveBoardButton boardId={board._id} />
    </div>
  ));

  return (
    <div>
      <h1>All Boards:</h1>
      {renderBoards}
      <AddBoard />
    </div>
  );
};

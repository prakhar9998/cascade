import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddBoard } from "./AddBoard";
import { selectAllBoards, fetchBoardsList } from "./boardsListSlice";
import { RemoveBoardButton } from "./RemoveBoardButton";

export const BoardsList = () => {
  const dispatch = useDispatch();
  const boards = useSelector(selectAllBoards);

  const boardStatus = useSelector((state) => state.boards.status);
  const error = useSelector((state) => state.boards.error);

  // fetching boards
  useEffect(() => {
    if (boardStatus === "idle") {
      dispatch(fetchBoardsList());
    }
  }, [boardStatus, dispatch]);

  let renderedContent;

  if (boardStatus === "loading") {
    renderedContent = (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  } else if (boardStatus === "succeeded") {
    const renderBoards = boards.map((board) => (
      <div key={board._id}>
        <h2>Title: {board.title}</h2>
        <h4>Description: {board.description}</h4>
        <RemoveBoardButton boardId={board._id} />
      </div>
    ));

    renderedContent = renderBoards;
  } else if (boardStatus === "failed") {
    renderedContent = <div>{error}</div>;
  }

  return (
    <div>
      <h1>All Boards:</h1>
      {renderedContent}
      <AddBoard />
    </div>
  );
};

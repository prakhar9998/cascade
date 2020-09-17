import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoard,
  selectAllLists,
  selectBoard,
  changeCardPosition,
  moveCardToList,
} from "./boardSlice";

import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

import { useParams } from "react-router-dom";
import { List } from "./List";
import { BoardToolbar } from "./BoardToolbar";
import { AddMemberForm } from "./AddMemberForm";

const BoardContainer = styled.div``;
const Button = styled.button``;
const Input = styled.input``;
const Label = styled.label``;

export const Board = () => {
  const [prevId, setPrevId] = useState(null);

  const board = useSelector(selectBoard);
  const lists = useSelector(selectAllLists);

  const { id } = useParams();

  const dispatch = useDispatch();

  const boardStatus = useSelector((state) => state.board.status);
  const error = useSelector((state) => state.board.error);

  useEffect(() => {
    console.log("mounted");
    console.log("action", fetchBoard.pending);
    dispatch(fetchBoard(id));
  }, [dispatch]);

  // the component isn't unmounted if users clicks one board then other
  // in this case fetchBoard action has to be dispatched again
  if (id !== prevId) {
    dispatch(fetchBoard(id));
    setPrevId(id);
  }

  const onDragEnd = (result) => {
    console.log("drag ended");
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const inSameList = source.droppableId === destination.droppableId;

    if (inSameList) {
      dispatch(
        changeCardPosition({
          source: source.index,
          destination: destination.index,
          listId: source.droppableId,
        })
      );
    } else {
      dispatch(
        moveCardToList({
          source: source.index,
          destination: destination.index,
          sourceListId: source.droppableId,
          destinationListId: destination.droppableId,
        })
      );
    }
  };

  let content;

  if (boardStatus === "loading") {
    content = (
      <div style={{ margin: "25% 0 0 0" }}>
        <CircularProgress style={{ margin: "auto", display: "block" }} />
      </div>
    );
  } else if (boardStatus === "succeeded") {
    content = (
      <BoardContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="droppable-board"
            direction="horizontal"
            type="list"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                style={{
                  display: "flex",
                  margin: "20px",
                }}
              >
                {lists.map((list, index) => (
                  <Draggable
                    key={list._id}
                    draggableId={list._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <List data={list} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </BoardContainer>
    );
  } else if (boardStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <div>
      <BoardToolbar />
      {content}
      <AddMemberForm />
    </div>
  );
};

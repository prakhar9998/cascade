import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoard,
  changeCardPosition,
  moveCardToList,
  selectBoard,
} from "./boardSlice";

import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

import { useParams } from "react-router-dom";
import { List } from "./List";
import { BoardToolbar } from "./BoardToolbar";
import { socket } from "../../socketClient/socketClient";

const BoardContainer = styled.div``;
const Container = styled.div``;

export const Board = () => {
  const [prevId, setPrevId] = useState(null);

  const board = useSelector(selectBoard);

  const { id } = useParams();

  const dispatch = useDispatch();

  const boardStatus = useSelector((state) => state.board.status);
  const error = useSelector((state) => state.board.error);

  useEffect(() => {
    console.log("mounted");
    console.log("action", fetchBoard.pending.type);
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
      socket.emit(
        "CHANGE_CARD_POSITION",
        {
          source: source.index,
          destination: destination.index,
          listId: source.droppableId,
          boardId: id,
        },
        (res) => {
          console.log("socket response", res);
        }
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
      <Container>
        <BoardToolbar title={board.title} />
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
                  {board.lists.map((list, index) => (
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
      </Container>
    );
  } else if (boardStatus === "failed") {
    content = <div>{error}</div>;
  }

  return <div>{content}</div>;
};

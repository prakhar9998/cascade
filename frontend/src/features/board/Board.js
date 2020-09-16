import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoard,
  selectAllLists,
  selectBoard,
  changeCardPosition,
  moveCardToList,
} from "./boardSlice";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { List } from "./List";

const Container = styled.div``;
const Button = styled.button``;
const Input = styled.input``;
const Label = styled.label``;

export const Board = () => {
  const board = useSelector(selectBoard);
  const lists = useSelector(selectAllLists);

  const { id } = useParams();

  const dispatch = useDispatch();

  const boardStatus = useSelector((state) => state.board.status);
  const error = useSelector((state) => state.board.error);

  useEffect(() => {
    if (boardStatus === "idle") {
      console.log("action", fetchBoard.pending);
      dispatch(fetchBoard(id));
    }
  }, [boardStatus, dispatch]);

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
    // TODO: Add loading icno here
    content = <h3>Loading...</h3>;
  } else if (boardStatus === "succeeded") {
    content = (
      <Container>
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
                  border: "2px solid red",
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
      </Container>
    );
  } else if (boardStatus === "failed") {
    content = <div>{error}</div>;
  }

  return <div>{content}</div>;
};

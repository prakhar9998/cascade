import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBoard,
  changeCardPosition,
  moveCardToList,
  selectBoard,
  changeListPosition,
} from "./boardSlice";

import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";

import { useParams } from "react-router-dom";
import { List } from "./List";
import { BoardToolbar } from "./BoardToolbar";
import { AddList } from "./AddList";

const BoardContainer = styled.div`
  height: 100%;
  display: flex;
`;
const Container = styled.div`
  height: 100%;
`;
const ListsContainer = styled.div`
  display: flex;
  height: 100%;
  margin: 20px;
`;

export const Board = () => {
  const [prevId, setPrevId] = useState(null);

  const board = useSelector(selectBoard);

  const { id } = useParams();

  const dispatch = useDispatch();

  const boardStatus = useSelector((state) => state.board.current.status);
  const error = useSelector((state) => state.board.current.error);

  useEffect(() => {
    dispatch(fetchBoard(id));
  }, [dispatch]);

  // the component isn't unmounted if users clicks one board then other
  // in this case fetchBoard action has to be dispatched again
  if (id !== prevId) {
    dispatch(fetchBoard(id));
    setPrevId(id);
  }

  const onDragEnd = (result) => {
    console.log("drag ended", result);
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (type === "card") {
      const inSameList = source.droppableId === destination.droppableId;

      if (inSameList) {
        console.log("change card");
        dispatch(
          changeCardPosition({
            source: source.index,
            destination: destination.index,
            listId: source.droppableId,
            boardId: id,
          })
        );
      } else {
        console.log("move card");
        dispatch(
          moveCardToList({
            source: source.index,
            destination: destination.index,
            sourceListId: source.droppableId,
            destinationListId: destination.droppableId,
            boardId: id,
          })
        );
      }
    } else if (type === "list") {
      dispatch(
        changeListPosition({
          source: source.index,
          destination: destination.index,
          boardId: id,
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
        <BoardToolbar title={board.title} boardId={board._id} />
        <BoardContainer>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="droppable-board"
              direction="horizontal"
              type="list"
            >
              {(provided) => (
                <ListsContainer ref={provided.innerRef}>
                  {board.lists ? (
                    board.lists.map((list, index) => (
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
                    ))
                  ) : (
                    <div></div>
                  )}
                  {provided.placeholder}
                </ListsContainer>
              )}
            </Droppable>
          </DragDropContext>
          <AddList boardId={id} />
        </BoardContainer>
      </Container>
    );
  } else if (boardStatus === "failed") {
    content = <div>Error: {error}</div>;
  }

  return <div style={{ flex: "1", overflow: "scroll" }}>{content}</div>;
};

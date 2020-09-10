import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import List from "./List";
import BoardService from "../services/boardService";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ListService from "../services/ListService";
import axios from "axios";
import API_URL from "../config/config";

const Container = styled.div``;
const Button = styled.button``;
const Input = styled.input``;
const Label = styled.label``;

const Board = (props) => {
  const [listData, setListData] = useState([]);
  const [listTitle, setListTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    BoardService.getBoard(id)
      .then((response) => {
        console.log("response", response.data);
        setListData(response.data.lists);
        setLoading(false);
      })
      .catch((err) => {
        console.log("error", err);
        setLoading(false);
      });
  }, []);

  const reorderArray = (arr, source, destination) => {
    var ele = arr[source];
    arr.splice(source, 1);
    arr.splice(destination, 0, ele);
  };

  const reorderInList = (source, destination, droppableId) => {
    setListData((prevState) => {
      const newLists = [...prevState];
      newLists.map((ele) => {
        if (ele.id === droppableId) {
          reorderArray(ele.cards, source, destination);
        }
        return ele;
      });
      return newLists;
    });
  };

  const moveToList = (source, destination, sourceId, destinationId) => {
    setListData((prevState) => {
      const newLists = [...prevState];
      let sourceCard;
      newLists.map((ele) => {
        if (ele.id === sourceId) {
          console.log("ele", ele);
          sourceCard = ele.cards[source];
          ele.cards.splice(source, 1);
        }
        return ele;
      });
      console.log("source card", sourceCard);
      newLists.map((ele) => {
        if (ele.id === destinationId) {
          ele.cards.splice(destination, 0, sourceCard);
        }
        return ele;
      });

      console.log("new state", newLists);

      return newLists;
    });
  };

  const onDragEnd = (result) => {
    // TODO: figure out if its a list or a card
    // making API call for changing position of card
    const { source, destination } = result;
    console.log("result", result);

    const isInSameList = source.droppableId === destination.droppableId;
    console.log("dstate", listData);

    if (isInSameList) {
      const payload = {
        source: source.index,
        destination: destination.index,
        listId: destination.droppableId,
        boardId: id,
      };

      axios
        .post(API_URL + "/api/card/changePosition", payload, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("res", response.data.data.board.lists);
          if (response.data.success) {
            setListData(response.data.data.board.lists);
          }
        })
        .catch((err) => {
          // TODO: set the error message state as active
          console.log("an error occured", err);
        });

      // update UI optimistically
      reorderInList(source.index, destination.index, destination.droppableId);
    } else {
      const payload = {
        source: source.index,
        destination: destination.index,
        sourceListId: source.droppableId,
        destinationListId: destination.droppableId,
        boardId: id,
      };

      console.log("payload", payload);

      axios
        .post(API_URL + "/api/card/moveCard", payload, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("move card to list response", response.data);
          if (response.data.success) {
            setListData(response.data.data.board.lists);
          }
        })
        .catch((err) => {
          console.log("an error occured", err);
        });

      // update UI optimistically
      moveToList(
        source.index,
        destination.index,
        source.droppableId,
        destination.droppableId
      );
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setListTitle(title);
  };

  const createList = () => {
    ListService.createList(id, listTitle).then((res) => {
      console.log("data", res.data);
    });
  };

  return (
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
              {listData.map((list, index) => (
                <Draggable key={index} draggableId={list.id} index={index}>
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
      <Label htmlFor="title">List Title</Label>
      <Input
        name="title"
        value={listTitle}
        onChange={handleTitleChange}
        required
      />
      <Button onClick={createList}>Create List</Button>
    </Container>
  );
};

export default Board;

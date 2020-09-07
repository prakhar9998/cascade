import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import List from "./List";
import BoardService from "../services/boardService";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ListService from "../services/ListService";

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

  const onDragEnd = () => {
    console.log("drag ended!");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setListTitle(title);
  };

  const createList = () => {
    ListService.createList(id, listTitle).then(() => console.log("success"));
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

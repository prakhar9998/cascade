import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import List from "./List";

// fake data
const data = [
  {
    id: "1",
    title: "list 1",
    cards: [
      {
        id: "1",
        title: "card 1",
        description: "card 1",
      },
      {
        id: "2",
        title: "card 2",
        description: "card 2 description",
      },
    ],
  },
  {
    id: "2",
    title: "list 2",
    cards: [
      {
        id: "12",
        title: "card 12",
        description: "card 12 desc",
      },
      {
        id: "22",
        title: "card 22",
        description: "card 22 description",
      },
      {
        id: "32",
        title: "card 32",
        description: "card 32 description",
      },
      {
        id: "42",
        title: "card 42",
        description: "card 42 description",
      },
    ],
  },
];

const Board = (props) => {
  const onDragEnd = () => {
    alert("drag ended!");
  };

  return (
    <div style={{ display: "flex", margin: "20px" }}>
      {data.map((list) => (
        <List key={list.id} data={list} />
      ))}
    </div>
  );
};

export default Board;

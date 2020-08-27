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
        id: "11",
        title: "card 11",
        description: "card 12 desc",
      },
      {
        id: "12",
        title: "card 12",
        description: "card 22 description",
      },
    ],
  },
  {
    id: "2",
    title: "list 2",
    cards: [
      {
        id: "22",
        title: "card 22",
        description: "card 12 desc",
      },
      {
        id: "23",
        title: "card 23",
        description: "card 22 description",
      },
      {
        id: "24",
        title: "card 24",
        description: "card 32 description",
      },
      {
        id: "25",
        title: "card 25",
        description: "card 42 description",
      },
    ],
  },
];

const Board = (props) => {
  const onDragEnd = () => {
    console.log("drag ended!");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable-board"
        direction="horizontal"
        type="list"
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            style={{ display: "flex", margin: "20px", border: "2px solid red" }}
          >
            {data.map((list, index) => (
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
  );
};

export default Board;

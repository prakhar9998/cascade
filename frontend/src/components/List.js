import React from "react";
import Card from "./Card";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const List = (props) => {
  const onDragEnd = () => {
    alert("drag ended!");
  };

  return (
    <div style={{ border: "solid 1px red", margin: "15px" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={props.data.id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ margin: "10px" }}
            >
              {props.data.cards.map((obj, index) => (
                <Card
                  key={obj.id}
                  title={obj.title}
                  description={obj.description}
                  index={index}
                  id={obj.id}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default List;

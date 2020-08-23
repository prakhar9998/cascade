import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

const Card = (props) => {
  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <h1>{props.title}</h1>
          <h3>{props.description}</h3>
        </div>
      )}
    </Draggable>
  );
};

export default Card;

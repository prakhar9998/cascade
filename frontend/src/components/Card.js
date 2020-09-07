import React from "react";
import { Draggable } from "react-beautiful-dnd";

const Card = (props) => {
  return (
    <div>
      <Draggable draggableId={props.id} index={props.index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <h2>{props.title}</h2>
            <h3>{props.description}</h3>
          </div>
        )}
      </Draggable>
    </div>
  );
};

export default Card;

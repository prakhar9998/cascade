import React from "react";
import { Draggable } from "react-beautiful-dnd";

export const Card = (props) => {
  return (
    <div>
      <Draggable draggableId={props.cardData._id} index={props.index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <h2>{props.cardData.title}</h2>
            <h3>{props.cardData.description}</h3>
          </div>
        )}
      </Draggable>
    </div>
  );
};

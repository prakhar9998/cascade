import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import List from "./List";
import BoardService from "../services/boardService";
import { useParams } from "react-router-dom";

const Board = (props) => {
  const [listData, setListData] = useState([]);
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
  );
};

export default Board;

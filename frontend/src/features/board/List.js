import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Card } from "./Card";

const Container = styled.div``;
const Button = styled.button``;
const Input = styled.input``;
const Label = styled.label``;

export const List = (props) => {
  return (
    <Container>
      <Droppable droppableId={props.data._id} type="card">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <h1>{props.data.title}</h1>
            {props.data.cards.map((card, index) => (
              <Card key={card._id} cardData={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Container>
  );
};

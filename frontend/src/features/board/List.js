import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card } from "./Card";

import styled from "styled-components";

const Container = styled.div`
  border-radius: 7px;
  width: 275px;
  background-color: #f5f5f5;
  padding: 0.3rem 0.5rem;
  margin: 0.5rem;
`;

const ListTitle = styled.h3`
  margin-left: 16px;
  font-size: 20px;
  color: #131c27;
`;

const Button = styled.button``;
const Input = styled.input``;
const Label = styled.label``;

export const List = (props) => {
  return (
    <Container>
      <Droppable droppableId={props.data._id} type="card">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <ListTitle>{props.data.title}</ListTitle>
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

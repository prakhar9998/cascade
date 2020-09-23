import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card } from "./Card";

import styled from "styled-components";

import IconButton from "@material-ui/core/IconButton";
import EditSharpIcon from "@material-ui/icons/EditSharp";

import { AddCard } from "./AddCard";

const Container = styled.div`
  border-radius: 4px;
  width: 275px;
  background-color: #eeedf0;
  padding: 0.3rem 0.5rem;
  margin: 0.5rem;
`;

const ListTitle = styled.h3`
  margin-left: 16px;
  font-size: 20px;
  color: #161c2e;
  flex-grow: 1;
`;

const ListHeader = styled.div`
  display: flex;
`;

const EditButton = styled(IconButton)`
  width: 50px;
  height: 50px;
  align-self: center;
`;

export const List = (props) => {
  const handleEditTitle = () => {
    // edits title and sends message through sockets
  };

  return (
    <Container>
      <Droppable droppableId={props.data._id} type="card">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <ListHeader>
              <ListTitle>{props.data.title}</ListTitle>
              <EditButton aria-label="edit title" onClick={handleEditTitle}>
                <EditSharpIcon />
              </EditButton>
            </ListHeader>
            <AddCard listId={props.data._id} boardId={props.data.boardId} />

            {props.data.cards ? (
              props.data.cards.map((card, index) => (
                <Card key={card._id} cardData={card} index={index} />
              ))
            ) : (
              <></>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Container>
  );
};

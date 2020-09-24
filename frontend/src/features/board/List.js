import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Card } from "./Card";

import styled from "styled-components";

import IconButton from "@material-ui/core/IconButton";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";

import { AddCard } from "./AddCard";
import { useDispatch } from "react-redux";
import { updateListTitle } from "./boardSlice";

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

const StyledTextField = styled(TextField)`
  && {
    margin-left: 16px;
    margin-top: 15px;
    margin-bottom: 15px;
    font-size: 20px;
    color: #161c2e;
    flex-grow: 1;
  }
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
  const [editOpen, setEditOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(props.data.title);
  const dispatch = useDispatch();

  const handleEditTitle = () => setEditOpen(true);

  const handleTitleChange = (e) => setNewTitle(e.target.value);

  const handleTitleSubmit = async () => {
    try {
      if (newTitle !== props.data.title) {
        const res = await dispatch(
          updateListTitle({ listId: props.data._id, title: newTitle })
        );
      }
      setEditOpen(false);
    } catch (err) {
      console.log("error in updating list", err);
    }
  };

  return (
    <Container>
      <Droppable droppableId={props.data._id} type="card">
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <ListHeader>
              {editOpen ? (
                <>
                  <StyledTextField
                    value={newTitle}
                    onChange={handleTitleChange}
                  ></StyledTextField>
                  <EditButton onClick={handleTitleSubmit}>
                    <DoneIcon />
                  </EditButton>
                  <EditButton onClick={() => setEditOpen(false)}>
                    <CloseIcon />
                  </EditButton>
                </>
              ) : (
                <>
                  <ListTitle>{props.data.title}</ListTitle>
                  <EditButton aria-label="edit title" onClick={handleEditTitle}>
                    <EditSharpIcon />
                  </EditButton>
                </>
              )}
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

import React, { useState } from "react";
import { useDispatch } from "react-redux";

import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import styled from "styled-components";
import { addCard } from "./boardSlice";

const AddCardButton = styled(IconButton)`
  && {
    width: 42px;
    height: 42px;
    align-self: center;
    margin: auto 5px;
  }
`;

const AddCardContainer = styled.div`
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  min-height: 60px;
  width: 250px;
`;

const AddCardText = styled.p`
  font-size: 18px;
  align-self: center;
`;

const CardFormContainer = styled.div``;

const CreateButton = styled(Button)`
  && {
    font-size: 10px;
    margin: 10px;
  }
`;

const CancelButton = styled(Button)`
  && {
    font-size: 10px;
    margin: 10px;
  }
`;

const CardTitleInput = styled(TextField)`
  && {
    margin: auto 10px;
  }
`;

export const AddCard = (props) => {
  const [addingCard, setAddingCard] = useState(false);
  const [title, setTitle] = useState("");

  const dispatch = useDispatch();

  const handleAddCardOpen = () => setAddingCard(true);
  const handleAddCardClose = () => setAddingCard(false);

  const handleCardTitleChange = (e) => setTitle(e.target.value);

  const handleCreateCard = () => {
    if (title) {
      // TODO: dispatch actions here
      dispatch(
        addCard({ title: title, listId: props.listId, boardId: props.boardId })
      );
      setTitle("");
      setAddingCard(false);
    }
  };

  return (
    <AddCardContainer>
      {addingCard ? (
        <CardFormContainer>
          <CardTitleInput
            label="New Card"
            placeholder="Card title"
            onChange={handleCardTitleChange}
          />
          <CreateButton
            variant="outlined"
            color="primary"
            onClick={handleCreateCard}
          >
            Create
          </CreateButton>
          <CancelButton
            variant="outlined"
            color="secondary"
            onClick={handleAddCardClose}
          >
            Cancel
          </CancelButton>
        </CardFormContainer>
      ) : (
        <>
          <AddCardButton onClick={handleAddCardOpen}>
            <AddIcon aria-label="add card" />
          </AddCardButton>
          <AddCardText>Add Card</AddCardText>
        </>
      )}
    </AddCardContainer>
  );
};

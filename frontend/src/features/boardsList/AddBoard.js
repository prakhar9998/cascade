import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBoard } from "./boardsListSlice";

import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Container = styled.div`
  background: white;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 350px;
  transform: translate(-50%, -50%);
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 25px;
`;

const Input = styled(TextField)`
  && {
    margin-bottom: 20px;
  }
`;

const Heading = styled.p`
  font-size: 28px;
`;

const StyledButton = styled(Button)``;

export const AddBoard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const onTitleChange = (e) => setTitle(e.target.value);
  const onDescriptionChange = (e) => setDescription(e.target.value);

  const isValid = Boolean(title) && addRequestStatus == "idle";

  const handleAddBoardClick = async () => {
    if (isValid) {
      try {
        setAddRequestStatus("loading");
        const result = await dispatch(addBoard({ title, description }));
        unwrapResult(result);
        setTitle("");
        setDescription("");
      } catch (err) {
        console.error("Failed to save board:", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <Container>
      <Heading>Add a new board:</Heading>
      <Input
        type="text"
        id="boardTitle"
        name="boardTitle"
        label="Title"
        value={title}
        onChange={onTitleChange}
        required
      />

      <Input
        type="text"
        id="boardDescription"
        name="boardDescription"
        label="Description"
        placeholder="What's this board about?"
        value={description}
        onChange={onDescriptionChange}
      />

      <StyledButton
        color="primary"
        onClick={handleAddBoardClick}
        disabled={!isValid}
      >
        Save Board
      </StyledButton>
    </Container>
  );
};

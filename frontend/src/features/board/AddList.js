import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import AddBoxSharpIcon from "@material-ui/icons/AddBoxSharp";
import TextField from "@material-ui/core/TextField";

import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addList } from "./boardSlice";

const Container = styled.div`
  width: 225px;
`;
const StyledIconButton = styled(IconButton)``;

export const AddList = (props) => {
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleListTitleChange = (e) => setTitle(e.target.value);

  const handleAddListSubmit = () => {
    dispatch(addList({ title: title, boardId: props.boardId }));
    setTitle("");
  };

  return (
    <Container>
      <TextField
        label="New List"
        placeholder="List Title"
        onChange={handleListTitleChange}
      />
      <StyledIconButton onClick={handleAddListSubmit}>
        <AddBoxSharpIcon aria-label="add list" />
      </StyledIconButton>
    </Container>
  );
};

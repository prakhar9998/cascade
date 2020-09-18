import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteBoard } from "./boardsListSlice";

import Button from "@material-ui/core/Button";

import styled from "styled-components";

const StyledButton = styled(Button)`
  && {
    font-size: 12px;
    &:hover {
      background-color: #fdd5d3;
    }
  }
  &.MuiButton-textPrimary {
    color: #df737a;
  }
`;

export const RemoveBoardButton = (props) => {
  const dispatch = useDispatch();

  const removeBoard = async () => {
    await dispatch(deleteBoard(props.boardId));
  };

  return (
    <div>
      <StyledButton color="primary" onClick={removeBoard}>
        Delete
      </StyledButton>
    </div>
  );
};

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddBoard } from "./AddBoard";
import { selectAllBoards, fetchBoardsList } from "./boardsListSlice";
import { RemoveBoardButton } from "./RemoveBoardButton";

import styled from "styled-components";

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const Container = styled.div``;

const BoardContainer = styled.div`
  width: 250px;
  height: 150px;
  border: 1px solid black;
  margin: 10px;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

const Heading = styled.p`
  font-size: 24px;
  color: #30343c;
  margin: 2px 20px 2px 20px;
`;

const BoardsHeader = styled.div`
  display: flex;
  min-height: 30px;
  margin: 30px auto;
`;

const AddButton = styled(Button)`
  &.MuiButton-containedPrimary {
    && {
      color: #ffffff;
      background-color: #2ab56f;
    }
  }

  && {
    height: 30px;
    padding: 6px;
    font-size: 12px;
    align-self: center;
    margin auto 20px;
  }
`;

const BoardTitle = styled.p`
  font-size: 32px;
`;

const BoardDesription = styled.p``;

export const BoardsList = () => {
  const boards = useSelector(selectAllBoards);

  const renderBoards = boards.map((board) => (
    <BoardContainer key={board._id}>
      <BoardTitle>{board.title}</BoardTitle>
      <BoardDesription>{board.description}</BoardDesription>
      <RemoveBoardButton boardId={board._id} />
    </BoardContainer>
  ));

  return (
    <Container>
      <BoardsHeader>
        <Heading>All Projects</Heading>
        <Divider orientation="vertical" flexItem />
        <AddButton variant="contained" color="primary" startIcon={<AddIcon />}>
          New Project
        </AddButton>
      </BoardsHeader>
      <Boards>{renderBoards}</Boards>
      <AddBoard />
    </Container>
  );
};

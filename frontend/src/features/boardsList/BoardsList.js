import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddBoard } from "./AddBoard";
import { selectAllBoards, fetchBoardsList } from "./boardsListSlice";
import { RemoveBoardButton } from "./RemoveBoardButton";

import styled from "styled-components";

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Modal from "@material-ui/core/Modal";

const Container = styled.div``;

const BoardContainer = styled.div`
  width: 275px;
  height: 150px;
  margin: 10px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 1px solid #ebebef;
  border-left: 3px solid #338eda;
  padding: 10px;
`;

const Boards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  background: #f5f5f7;
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
  margin: 0 8px;
  font-size: 32px;
`;

const BoardDesription = styled.p`
  color: #969696;
  margin: 0 8px;
  flex-grow: 1;
`;

const ButtonSpan = styled.span`
  margin-top: 10px;
  align-self: flex-end;
`;

export const BoardsList = () => {
  const boards = useSelector(selectAllBoards);
  const [modalOpen, setModalOpen] = useState(false);

  // for add board form modal
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const renderBoards = boards.map((board) => (
    <BoardContainer key={board._id}>
      <BoardTitle>{board.title}</BoardTitle>
      <BoardDesription>{board.description}</BoardDesription>
      <ButtonSpan>
        <RemoveBoardButton boardId={board._id} />
      </ButtonSpan>
    </BoardContainer>
  ));

  return (
    <Container>
      <BoardsHeader>
        <Heading>All Projects</Heading>
        <Divider orientation="vertical" flexItem />
        <AddButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleModalOpen}
        >
          New Project
        </AddButton>
      </BoardsHeader>
      <Boards>{renderBoards}</Boards>
      <Modal open={modalOpen} onClose={handleModalClose}>
        <AddBoard />
      </Modal>
    </Container>
  );
};

import React, { useState } from "react";
import { useSelector } from "react-redux";

import { selectAllMembers } from "./boardSlice";
import { getInitials } from "../../utils/memberName";
import { AddMemberForm } from "./AddMemberForm";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import AddCircleSharpIcon from "@material-ui/icons/AddCircleSharp";
import Modal from "@material-ui/core/Modal";

import styled from "styled-components";

const BoardToolbarContainer = styled.div`
  width: 100%;
  height: 75px;
  border: 1px solid red;
  display: flex;
  align-content: center;
`;

const AvatarContainer = styled.div`
  align-self: center;
  margin: auto 3px;
`;

const StyledAvatar = styled(Avatar)`
  && {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
`;

const AddMemberButton = styled(Button)`
  &.MuiButton-containedPrimary {
    && {
      color: #ffffff;
      background-color: #2c80ff;
    }
  }

  && {
    height: 32px;
    align-self: center;
    margin-left: 20px;
  }
`;

const BoardTitle = styled.p`
  align-self: center;
  margin: auto 20px;
  font-size: 32px;
`;

export const BoardToolbar = (props) => {
  const members = useSelector(selectAllMembers);

  const [modalOpen, setModalOpen] = useState(false);

  // for add board form modal
  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <BoardToolbarContainer>
      <BoardTitle>{props.title}</BoardTitle>
      {members.map((member) => (
        <AvatarContainer key={member._id}>
          <StyledAvatar>{getInitials(member)}</StyledAvatar>
        </AvatarContainer>
      ))}
      <AddMemberButton
        variant="contained"
        color="primary"
        startIcon={<AddCircleSharpIcon />}
        onClick={handleModalOpen}
      >
        Add member
      </AddMemberButton>

      {/* uses react fragment to render modal, fixes the focus tabIndex issue */}
      <>
        <Modal open={modalOpen} onClose={handleModalClose}>
          <AddMemberForm boardId={props.boardId} />
        </Modal>
      </>
    </BoardToolbarContainer>
  );
};

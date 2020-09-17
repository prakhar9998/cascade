import React from "react";
import { useSelector } from "react-redux";

import Avatar from "@material-ui/core/Avatar";

import styled from "styled-components";
import { selectAllMembers } from "./boardSlice";

const fakeData = {
  members: ["Elon Musk", "Mark Zuckerberg", "Someone great"],
};

const BoardToolbarContainer = styled.div`
  width: 100%;
  height: 75px;
  border: 1px solid red;
  display: flex;
  align-content: center;
`;

const AvatarContainer = styled.div`
  align-self: center;
  margin: auto 4px;
`;

export const BoardToolbar = () => {
  const boardMembers = useSelector(selectAllMembers);

  return (
    <BoardToolbarContainer>
      {fakeData.members.map((member) => (
        <AvatarContainer>
          <Avatar>{member[0]}</Avatar>
        </AvatarContainer>
      ))}
    </BoardToolbarContainer>
  );
};

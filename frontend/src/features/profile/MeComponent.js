import React from "react";
import { useSelector } from "react-redux";
import { selectProfile } from "./profileSlice";

import styled from "styled-components";

import Avatar from "@material-ui/core/Avatar";
import { fullName, getInitials } from "../../utils/memberName";

const MeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;
  margin-bottom: 20px;
`;

const Name = styled.div`
  margin-top: 15px;
  align-self: center;
  font-size: 20px;
`;

const Email = styled.div`
  align-self: center;
`;

const StyledAvatar = styled(Avatar)`
  && {
    width: 128px;
    height: 128px;
    align-self: center;
    font-size: 50px;
  }
`;

export const MeComponent = () => {
  const profile = useSelector(selectProfile);

  return (
    <MeContainer>
      <StyledAvatar>{getInitials(profile)}</StyledAvatar>
      <Name>{fullName(profile)}</Name>
      <Email>{profile.email}</Email>
    </MeContainer>
  );
};

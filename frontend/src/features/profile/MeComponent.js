import React from "react";
import { useSelector } from "react-redux";
import { selectProfile } from "./profileSlice";

import styled from "styled-components";

import Avatar from "@material-ui/core/Avatar";

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

  const fullName = () => {
    if (!profile.lastname) {
      return profile.firstname.toUpperCase();
    } else {
      return `${profile.firstname} ${profile.lastname}`.toUpperCase();
    }
  };

  const getInitials = () => {
    if (!profile.lastname) {
      return `${profile.firstname[0]}`.toUpperCase();
    } else {
      return `${profile.firstname[0]}${profile.lastname[0]}}`.toUpperCase();
    }
  };

  return (
    <MeContainer>
      <StyledAvatar>{getInitials()}</StyledAvatar>
      <Name>{fullName()}</Name>
      <Email>{profile.email}</Email>
    </MeContainer>
  );
};

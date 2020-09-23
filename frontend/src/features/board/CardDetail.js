import React from "react";

import Button from "@material-ui/core/Button";

import styled from "styled-components";

import { fullName } from "../../utils/memberName";
import { Label } from "./Card";
const Container = styled.div`
  background: white;
  top: 50%;
  left: 50%;
  width: 700px;
  height: 700px;
  transform: translate(-50%, -50%);
  position: absolute;
`;

export const CardDetail = (props) => {
  return (
    <Container>
      <h1>Title: {props.data.title}</h1>
      <h3>Description</h3>
      <textarea>{props.data.description}</textarea>
      <p>Due Date: {props.data.due_date}</p>
      <p>Assigned: </p>
      {/* {props.data.assigned.map((user) => (
        <p>{fullName(user)}</p>
      ))} */}
      <p>Labels: </p>
      {props.data.labels.map((label) => (
        <Label key={label._id} color={label.color}>
          {label.name}
        </Label>
      ))}
      <Button>Add label</Button>
    </Container>
  );
};

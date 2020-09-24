import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import styled from "styled-components";
import { CirclePicker } from "react-color";

import { fullName } from "../../utils/memberName";
import { Label } from "./Card";
import { useDispatch } from "react-redux";
import { addLabelToCard } from "./boardSlice";

const Container = styled.div`
  background: white;
  top: 50%;
  left: 50%;
  width: 700px;
  height: 700px;
  transform: translate(-50%, -50%);
  position: absolute;
  padding: 30px;
`;

const NewLabelContainer = styled.div`
  display: flex;
  align-content: center;
`;

const ColorContainer = styled.div``;

export const CardDetail = (props) => {
  const [newLabel, setNewLabel] = useState("");
  const [labelColor, setLabelColor] = useState("#eee");
  const [requestStatus, setRequestStatus] = useState("idle");
  const dispatch = useDispatch();

  const handleLabelNameChange = (e) => setNewLabel(e.target.value);

  const handleColorChange = (color) => setLabelColor(color.hex);

  const handleAddLabelClicked = async () => {
    try {
      setRequestStatus("pending");
      const result = await dispatch(
        addLabelToCard({
          name: newLabel,
          color: labelColor,
          cardId: props.data._id,
        })
      );
      setNewLabel("");
      setLabelColor("#eee");
      setRequestStatus("success");
    } catch (err) {
      setRequestStatus("error");
      console.log("error in adding lavel", err);
    }
  };

  return (
    <Container>
      <h1>Title: {props.data.title}</h1>
      <h3>Description</h3>
      <textarea>{props.data.description}</textarea>
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
      <NewLabelContainer>
        <p>Add a new label</p>
        <Label color={labelColor}>{newLabel}</Label>
      </NewLabelContainer>
      <ColorContainer>
        <TextField
          label="Name"
          placeholder="Enter new label name"
          onChange={handleLabelNameChange}
        />
        <CirclePicker onChangeComplete={handleColorChange} />
      </ColorContainer>

      <Button
        variant="outlined"
        color="primary"
        onClick={handleAddLabelClicked}
      >
        Add label
      </Button>
      {requestStatus === "error" ? (
        <div>Couldn't add label. Please try again.</div>
      ) : (
        <></>
      )}
    </Container>
  );
};

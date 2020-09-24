import React, { useState } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import styled from "styled-components";
import { CirclePicker } from "react-color";

import { fullName, getInitials } from "../../utils/memberName";
import { Label } from "./Card";
import { useDispatch, useSelector } from "react-redux";
import {
  addLabelToCard,
  assignMemberToCard,
  getMemberById,
  selectAllMembers,
} from "./boardSlice";

/*** CARD STYLES START */
const Container = styled.div`
  background: #f3f3f3;
  top: 50%;
  left: 50%;
  width: 700px;
  height: 700px;
  transform: translate(-50%, -50%);
  position: absolute;
  padding: 30px;
  overflow-y: scroll;
`;

const NewLabelContainer = styled.div`
  display: flex;
  align-content: center;
`;

const ColorContainer = styled.div`
  display: flex;
`;

const AssignedContainer = styled.div`
  display: flex;
`;

const LabelsContainer = styled.div`
  display: flex;
`;

const InputLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AddLabelButton = styled(Button)`
  && {
    align-self: flex-start;
    margin-top: 25px;
  }
`;

/** CARD STYLES END */

/**
 * Member styles
 * */

const MemberContainer = styled.div`
  display: flex;
  align-content: center;
  margin: auto 10px;
`;

const MemberAvatar = styled(Avatar)`
  && {
    width: 32px;
    height: 32px;
    align-self: center;
  }
`;

const MemberName = styled.p`
  align-self: center;
  margin-left: 8px;
`;

const AddMemberButton = styled(Button)`
  && {
    margin-left: 40px;
  }
`;

const Member = (props) => {
  const member = useSelector((state) => getMemberById(state, props.member));

  return (
    <MemberContainer>
      <MemberAvatar>{getInitials(member)}</MemberAvatar>
      <MemberName>{fullName(member)}</MemberName>
    </MemberContainer>
  );
};

export const CardDetail = (props) => {
  const [newLabel, setNewLabel] = useState("");
  const [labelColor, setLabelColor] = useState("#eee");
  const [requestStatus, setRequestStatus] = useState("idle");
  const [assignRequestStatus, setAssignRequestStatus] = useState("idle");
  const [memberSelect, setMemberSelect] = useState("");

  const boardMembers = useSelector(selectAllMembers);

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

  const handleAssignMemberClicked = async () => {
    try {
      setAssignRequestStatus("pending");
      const result = await dispatch(
        assignMemberToCard({
          email: memberSelect,
          boardId: props.data.boardId,
          cardId: props.data._id,
        })
      );
      setMemberSelect("");
      setAssignRequestStatus("success");
    } catch (err) {
      setAssignRequestStatus("error");
      console.log("error in adding member");
    }
  };

  const handleMemberSelectChange = (e) => setMemberSelect(e.target.value);

  return (
    <Container>
      <h1>Title: {props.data.title}</h1>
      <h3>Description</h3>
      <textarea>{props.data.description}</textarea>
      <AssignedContainer>
        <h3>Assigned: </h3>
        {props.data.assigned.map((member) => (
          <Member member={member} />
        ))}
      </AssignedContainer>
      <div style={{ margin: "20px 0" }}>
        <h3>Assign new member</h3>
        <InputLabel id="member-select">Member</InputLabel>
        <Select
          labelId="member-select"
          value={memberSelect}
          onChange={handleMemberSelectChange}
        >
          {boardMembers.map((member) => (
            <MenuItem key={member._id} value={member.email}>
              {member.email}
            </MenuItem>
          ))}
        </Select>
        <AddMemberButton
          color="primary"
          size="small"
          disabled={!memberSelect}
          onClick={handleAssignMemberClicked}
        >
          Assign member
        </AddMemberButton>
      </div>
      <LabelsContainer>
        <h3 style={{ marginRight: "10px" }}>Labels: </h3>
        {props.data.labels.map((label) => (
          <Label key={label._id} color={label.color}>
            {label.name}
          </Label>
        ))}
      </LabelsContainer>

      <NewLabelContainer>
        <h3>Add a new label</h3>
        <Label color={labelColor}>{newLabel}</Label>
      </NewLabelContainer>
      <ColorContainer>
        <InputLabelContainer>
          <TextField
            label="Name"
            placeholder="Enter new label name"
            onChange={handleLabelNameChange}
          />
          <AddLabelButton
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleAddLabelClicked}
          >
            Add label
          </AddLabelButton>
        </InputLabelContainer>

        <span style={{ marginLeft: "40px", alignSelf: "center" }}>
          <p>Color</p>
          <CirclePicker onChangeComplete={handleColorChange} />
        </span>
      </ColorContainer>

      {requestStatus === "error" ? (
        <div>Couldn't add label. Please try again.</div>
      ) : (
        <></>
      )}
      {assignRequestStatus === "error" ? (
        <div>Couldn't assign member. Please try again.</div>
      ) : (
        <></>
      )}
    </Container>
  );
};

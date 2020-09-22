import React, { useState } from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

import styled from "styled-components";
import { addMember } from "./boardSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

const validEmailRegex = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const FormContainer = styled.div`
  border: 1px solid red;
  background: white;
`;

export const AddMemberForm = React.forwardRef((props, ref) => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (validEmailRegex.test(email)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (isValid) {
      // dispatch action here.
      try {
        setAddRequestStatus("pending");
        const result = await dispatch(
          addMember({ email: email, boardId: props.boardId })
        );
        unwrapResult(result);
        setAddRequestStatus("success");
        setEmail("");
      } catch (err) {
        setAddRequestStatus("error");
        console.error("add member error", err);
      }
    }
  };

  return (
    <FormContainer>
      <Input
        error={isValid}
        inputProps={{ "aria-label": "E-mail" }}
        placeholder="Enter e-mail"
        type="email"
        required
        onChange={handleInputChange}
      />
      <Button
        variant="outlined"
        color="primary"
        size="small"
        disabled={!isValid}
        onClick={handleEmailSubmit}
      >
        Add member
      </Button>
      {addRequestStatus === "error" ? <p>An error occurred.</p> : <span></span>}
      {addRequestStatus === "success" ? (
        <p>Member successfully added!</p>
      ) : (
        <span></span>
      )}
    </FormContainer>
  );
});

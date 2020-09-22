import React, { useState } from "react";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";

import styled from "styled-components";

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

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (validEmailRegex.test(email)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  const handleEmailSubmit = () => {
    if (isValid) {
      // dispatch action here.
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
      >
        Add member
      </Button>
    </FormContainer>
  );
});

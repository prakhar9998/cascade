import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

import API_URL from "../config/config";

const validEmailRegex = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const Container = styled.div`
  width: 400px;
  background: #222629;
  border: 1px solid #222629;
  border-radius: 10px;
  font: 300 1em "Fira Sans", sans-serif;
`;

const InputContainer = styled.div`
  position: relative;
  margin: 50px auto;
  width: 70%;
`;

const ErrorContainer = styled.span`
  color: #c96567;
  font-size: 12px;
`;

const Form = styled.form``;

const Label = styled.label`
  color: #f2f2f2;
  font-size: 16px;
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  top: 10px;
  transition: 300ms ease all;
`;

const Input = styled.input`
  background: none;
  font-size: 18px;
  display: block;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #f2f2f2;
  width: 100%;
  padding: 5px;
  color: #ccc;

  ~ label {
    top: ${(props) => (props.value ? "-14px" : "10px")};
    font-size: ${(props) => (props.value ? "12px" : "16px")};
  }

  &:focus {
    outline: none;
  }
  &:focus ~ label,
  &:valid ~ label {
    top: -14px;
    font-size: 12px;
  }

  &:invalid {
    border: none;
    outline: none;
  }
`;

const EmailInput = styled(Input).attrs((props) => ({
  type: "email",
}))``;

const PasswordInput = styled(Input).attrs((props) => ({
  type: "password",
}))``;

const SubmitButton = styled.input.attrs((props) => ({
  type: "submit",
}))`
  background: none;
  border: 2px solid;
  font: inherit;
  line-height: 1;
  margin: auto;
  align-self: center;
  width: 100%;
  padding: 1em 2em;
  color: #57ba98;
  transition: 0.25s;

  &:hover,
  &:focus {
    border-color: #65ccb8;
    color: #fff;
    box-shadow: inset 0 0 0 2em #65ccb8;
  }
`;

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setErrors((prevState) => ({
      ...prevState,
      email: validEmailRegex.test(email) ? "" : "E-mail is invalid!",
    }));

    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;

    // TODO: consistend password validation with validation in backend
    setErrors((prevState) => ({
      ...prevState,
      password:
        password.length < 8 ? "Password must be 8 characters long!" : "",
    }));

    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(errors).forEach((value) => {
      if (value.length > 0) valid = false;
    });

    if (email === "" || password === "") valid = false;

    if (valid) {
      setLoading(true);
      axios
        .post(API_URL + "/api/login", {
          email: email,
          password: password,
        })
        .then((res) => {
          // TODO: save token
          setLoading(false);
          console.log("response", res);
          setMessage("Successfully logged in!");
        })
        .catch((err) => {
          if (err.response) {
            // server responded with error
            setMessage(err.response.data.message);
          } else if (err.request) {
            // server did not respond
            setMessage("Please check your network connectivity.");
          } else {
            // something went wrong
            setMessage("Something went wrong!");
          }
          setLoading(false);
        });
    } else {
      setMessage("Please complete the form.");
      console.log("form is invalid");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <InputContainer>
          <EmailInput
            name="email"
            value={email}
            onChange={onChangeEmail}
            required
          />
          <Label htmlFor="email">E-mail</Label>
          {errors.email && <ErrorContainer>{errors.email}</ErrorContainer>}
        </InputContainer>

        <InputContainer>
          <PasswordInput
            name="password"
            value={password}
            onChange={onChangePassword}
            required
          />
          <Label htmlFor="password">Password</Label>
          {errors.password && (
            <ErrorContainer>{errors.password}</ErrorContainer>
          )}
        </InputContainer>
        <InputContainer>
          <SubmitButton type="submit" value="Login" />
        </InputContainer>
      </Form>
      {loading && <span>Loading...</span>}
      {message && <span>{message}</span>}
    </Container>
  );
};

export default Login;

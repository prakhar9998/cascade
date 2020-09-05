import React, { useState } from "react";
import AuthService from "../services/authService";

import {
  Container,
  InputContainer,
  ErrorContainer,
  Form,
  Label,
  EmailInput,
  PasswordInput,
  SubmitButton,
} from "./reusables/formReusables";

import API_URL from "../config/config";

const validEmailRegex = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

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
      AuthService.login(email, password)
        .then(() => {
          setLoading(false);
          setMessage("");
        })
        .catch((err) => {
          if (err.response.data.error) {
            // server responded with error
            setMessage(err.response.data.error);
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

import React, { useState } from "react";
import axios from "axios";

import {
  Container,
  InputContainer,
  ErrorContainer,
  Form,
  Label,
  Input,
  EmailInput,
  PasswordInput,
  SubmitButton,
} from "./reusables/formReusables";

import API_URL from "../config/config";

const validEmailRegex = RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const onChangeName = (e) => {
    const name = e.target.value;
    setErrors((prevState) => ({
      ...prevState,
      name: name.length < 6 ? "Username must be atleast 8 character long!" : "",
    }));

    setName(name);
  };

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
        password.length < 8
          ? "Password must be atleast 8 characters long!"
          : "",
    }));

    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(errors).forEach((value) => {
      if (value.length > 0) valid = false;
    });

    if (name === "" || email === "" || password === "") valid = false;

    if (valid) {
      setLoading(true);
      console.log("form is valid");
      setMessage("Registering account...");

      axios
        .post(API_URL + "/api/register", {
          name: name,
          email: email,
          password: password,
        })
        .then((res) => {
          setLoading(false);
          console.log("response", res);
          setMessage("Account registered successfully.");
        })
        .catch((err) => {
          if (err.response) {
            // server responded with an error
            setMessage(err.response.data.message);
          } else if (err.request) {
            // server did not respond
            setMessage("Please check your network connectivity.");
          } else {
            // literally something went wrong
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
          <Input
            type="text"
            name="name"
            value={name}
            onChange={onChangeName}
            required
          />
          <Label htmlFor="name">Name</Label>
          {errors.name && <ErrorContainer>{errors.name}</ErrorContainer>}
        </InputContainer>
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
          <SubmitButton type="submit" value="Register" />
        </InputContainer>
      </Form>
      {loading && <span>Loading...</span>}
      {message && <span>{message}</span>}
    </Container>
  );
};

export default Register;

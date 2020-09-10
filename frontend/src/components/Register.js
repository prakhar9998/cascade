import React, { useState } from "react";
import AuthService from "../services/authService";

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
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const onChangeFirstname = (e) => {
    const name = e.target.value;
    setErrors((prevState) => ({
      ...prevState,
      firstname:
        firstname.length < 3
          ? "Firstname must be atleast 3 character long!"
          : "",
    }));

    setFirstname(name);
  };

  const onChangeLastname = (e) => {
    const name = e.target.value;
    setLastname(name);
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

    if (firstname === "" || email === "" || password === "") valid = false;

    if (valid) {
      setLoading(true);
      console.log("form is valid");
      setMessage("Registering account...");

      AuthService.register(firstname, lastname, email, password)
        .then(() => {
          setLoading(false);
          setMessage("");
        })
        .catch((err) => {
          if (err.response && err.response.data.error) {
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
          <Input
            type="text"
            name="firstname"
            value={firstname}
            onChange={onChangeFirstname}
            required
          />
          <Label htmlFor="firstname">Firstname</Label>
          {errors.name && <ErrorContainer>{errors.name}</ErrorContainer>}
        </InputContainer>
        <InputContainer>
          <Input
            type="text"
            name="lastname"
            value={lastname}
            onChange={onChangeLastname}
          />
          <Label htmlFor="firstname">Lastname</Label>
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

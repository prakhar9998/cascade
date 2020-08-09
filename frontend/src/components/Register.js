import React, { useState } from "react";
import API_URL from "../config/config";
import axios from 'axios';

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({name: "", email: "", password: ""});
  const [errorMsg, setErrorMsg] = useState("");

  const onChangeName = (e) => {
    const name = e.target.value;
    setErrors(prevState => ({
      ...prevState,
      name: (name.length < 6) ? "Username must be atleast 8 character long!" : ""
    }));

    setName(name);
  }

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setErrors(prevState => ({
      ...prevState,
      email: validEmailRegex.test(email) ? "" : "E-mail is invalid!"
    }));

    setEmail(email);
  }

  const onChangePassword = (e) => {
    const password = e.target.value;

    // TODO: consistend password validation with validation in backend
    setErrors(prevState => ({
      ...prevState,
      password: (password.length < 8) ? "Password must be atleast 8 characters long!" : ""
    }));

    setPassword(password);
  }

  const handleLogin = (e) => {
    e.preventDefault();

    let valid = true;
    Object.values(errors).forEach((value) => {
      if (value.length > 0) valid = false;
    });

    if (name === "" || email === "" || password === "") valid = false;

    setLoading(true);

    if (valid) {
      console.log("form is valid");
      axios.post(API_URL + '/api/register', {
        name: name,
        email: email,
        password: password
      })
      .then((res) => {
        setLoading(false);
        setErrorMsg("");
      })
      .catch((error) => {
        if (error.response) {
          // server responded with an error
          setErrorMsg(error.response.data.message);
        } else if (error.request) {
          // server did not respond
          setErrorMsg("Please check your network connectivity");
        } else {
          // literally something went wrong
          setErrorMsg("Something went wrong!");
        }
      });
    } else {
      console.log("form is invalid");
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={onChangeName} />
          {errors.name &&
            <span>{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="email">E-mail</label>
          <input type="email" name="email" value={email} onChange={onChangeEmail} />
          {errors.email &&
          <span>{errors.email}</span>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={password} onChange={onChangePassword} />
          {errors.password &&
            <span>{errors.password}</span>}
        </div>
        <input type="submit" value="login"/>
      </form>
      {errorMsg &&
        <span><h2>{errorMsg}</h2></span>}
    </div>
  )
}

export default Register;
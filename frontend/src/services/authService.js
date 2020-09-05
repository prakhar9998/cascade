import axios from "axios";

import API_URL from "../config/config";

const login = (email, password) => {
  return axios
    .post(
      API_URL + "/api/login",
      {
        email: email,
        password: password,
      },
      { withCredentials: true }
    )
    .then((res) => {
      // recieves httpOnly cookie which browser automatically sends with each request.
      return res.data;
    });
};

const register = (firstname, lastname, email, password) => {
  return axios.post(API_URL + "/api/register", {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
  });
};

const isAuthenticated = () => {
  // used for checking whether the private router should redirect

  return axios.get(API_URL + "/api/me", { withCredentials: true });
};

const logout = () => {
  return axios.get(API_URL + "/api/logout", { withCredentials: true });
};

export default {
  login,
  register,
  isAuthenticated,
  logout,
};

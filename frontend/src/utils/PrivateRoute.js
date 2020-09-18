import React, { useState, useEffect } from "react";
import AuthService from "../services/authService";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProfile, selectProfile } from "../features/profile/profileSlice";

import axios from "axios";
import API_URL from "../config/config";

const PrivateRoute = (props) => {
  const [state, setState] = useState({ isLoading: true, isLoggedIn: false });

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`${API_URL}/api/me`, {
          withCredentials: true,
        });
        console.log("succedd");
        dispatch(addProfile(res.data.data));
        console.log("blah");
        setState({ isLoading: false, isLoggedIn: true });
      } catch (err) {
        console.log("Failed to authenticate", err.message);
        setState({ isLoading: false, isLoggedIn: false });
      }
    }
    fetchProfile();
  }, []);

  return state.isLoading ? null : state.isLoggedIn ? (
    <Route path={props.path} component={props.component} exact={props.exact} />
  ) : (
    <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
  );
};

export default PrivateRoute;

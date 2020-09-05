import React, { useState, useEffect } from "react";
import AuthService from "../services/authService";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = (props) => {
  const [state, setState] = useState({ isLoading: true, isLoggedIn: false });

  useEffect(() => {
    AuthService.isAuthenticated()
      .then(() => {
        setState({ isLoading: false, isLoggedIn: true });
      })
      .catch(() => {
        setState({ isLoading: false, isLoggedIn: false });
      });
  }, []);

  return state.isLoading ? null : state.isLoggedIn ? (
    <Route path={props.path} component={props.component} exact={props.exact} />
  ) : (
    <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
  );
};

export default PrivateRoute;

import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Board from "./components/Board";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import Sidebar from "./components/Sidebar";
import styled from "styled-components";

function Side() {
  return (
    <Sidebar>
      <Dashboard />
    </Sidebar>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoute
            path="/dashboard"
            component={(props) => (
              <Sidebar {...props}>
                <Dashboard />
              </Sidebar>
            )}
            exact={true}
          />
          <PrivateRoute
            path="/board/:id"
            component={(props) => (
              <Sidebar {...props}>
                <Board />
              </Sidebar>
            )}
            exact={true}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

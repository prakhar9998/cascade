import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Board from "./components/Board";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Router path="/">
            <Sidebar />
          </Router>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/dashboard" component={Dashboard} exact={true} />
          <PrivateRoute path="/board/:id" component={Board} exact={true} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

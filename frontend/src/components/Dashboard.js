import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import API_URL from "../config/config";
import AuthService from "../services/authService";

const Container = styled.div``;
const BoardContainer = styled.div``;

const Dashboard = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL + "/api/board/all", { withCredentials: true })
      .then((res) => {
        setBoards(res.data.data);
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []);

  const logout = () => {
    AuthService.logout().then((res) => {
      console.log("logged out");
    });
  };

  return (
    <Container>
      {boards.map((board) => (
        <BoardContainer key={board._id}>{board.title}</BoardContainer>
      ))}
      <button onClick={logout}>logout</button>
    </Container>
  );
};

export default Dashboard;

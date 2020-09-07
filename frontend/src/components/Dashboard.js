import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import API_URL from "../config/config";
import AuthService from "../services/authService";
import BoardService from "../services/boardService";

const Container = styled.div``;
const BoardContainer = styled.div``;
const Input = styled.input``;
const Label = styled.label``;
const Button = styled.button``;

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [boardData, setBoardData] = useState({ title: "", description: "" });

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

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setBoardData((prevState) => ({ ...prevState, title: title }));
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setBoardData((prevState) => ({ ...prevState, description: description }));
  };

  const createBoard = () => {
    BoardService.createBoard(boardData.title, boardData.description).then(
      (res) => {
        console.log("success");
      }
    );
  };

  return (
    <Container>
      {boards.map((board) => (
        <BoardContainer key={board._id}>
          <h1>Title: {board.title}</h1>
          <h3>Id: {board._id}</h3>
        </BoardContainer>
      ))}
      <Button onClick={logout}>logout</Button>
      <Label htmlFor="title">Board Title</Label>
      <Input
        name="title"
        value={boardData.title}
        onChange={handleTitleChange}
        required
      />
      <Label htmlFor="description">Board Description</Label>
      <Input
        name="description"
        value={boardData.description}
        onChange={handleDescriptionChange}
      />
      <Button onClick={createBoard}>Create Board</Button>
    </Container>
  );
};

export default Dashboard;

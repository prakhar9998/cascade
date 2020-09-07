import React, { useState } from "react";
import Card from "./Card";
import { Droppable } from "react-beautiful-dnd";
import CardService from "../services/CardService";
import styled from "styled-components";

const Container = styled.div``;
const Button = styled.button``;
const Input = styled.input``;
const Label = styled.label``;

const List = (props) => {
  const [cardData, setCardData] = useState({ title: "", description: "" });

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setCardData((prevState) => ({ ...prevState, title: title }));
  };

  const handleDescriptionChange = (e) => {
    const description = e.target.value;
    setCardData((prevState) => ({ ...prevState, description: description }));
  };

  const createCard = () => {
    CardService.createCard(
      cardData.title,
      cardData.description,
      props.data.id,
      props.data.boardId
    ).then(() => console.log("success"));
  };

  return (
    <Container style={{ border: "solid 1px red", margin: "15px" }}>
      <Droppable droppableId={props.data.id} type="card">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ margin: "10px" }}
          >
            <h1>{props.data.title}</h1>
            {props.data.cards.map((obj, index) => (
              <Card
                key={obj.id}
                title={obj.title}
                description={obj.description}
                index={index}
                id={obj.id}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Label htmlFor="title">Card Title</Label>
      <Input
        name="title"
        value={cardData.title}
        onChange={handleTitleChange}
        required
      />
      <Label htmlFor="description">Card Description</Label>
      <Input
        name="description"
        value={cardData.description}
        onChange={handleDescriptionChange}
      />
      <Button onClick={createCard}>Create Card</Button>
    </Container>
  );
};

export default List;

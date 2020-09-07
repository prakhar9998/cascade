import axios from "axios";
import API_URL from "../config/config";

const createCard = (title, description, listId, boardId) => {
  return axios
    .post(
      API_URL + "/api/card/create",
      {
        title: title,
        description: description,
        listId: listId,
        boardId: boardId,
      },
      { withCredentials: true }
    )
    .then((res) => {
      console.log("successfully created card", res);
    })
    .catch((err) => {
      console.log("error creating card", err);
    });
};

export default { createCard };

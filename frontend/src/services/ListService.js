import axios from "axios";
import API_URL from "../config/config";

const createList = (boardId, title) => {
  return axios
    .post(
      API_URL + "/api/list/create",
      { boardId: boardId, title: title },
      { withCredentials: true }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("error", err);
    });
};

export default { createList };
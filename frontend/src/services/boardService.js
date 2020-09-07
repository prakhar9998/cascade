import axios from "axios";
import API_URL from "../config/config";

const createBoard = (title, description) => {
  return axios
    .post(
      API_URL + "/api/board/create",
      { title: title, description: description },
      { withCredentials: true }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("error occured", err);
    });
};

const getBoard = (id) => {
  return axios
    .get(API_URL + `/api/board/${id}`, { withCredentials: true })
    .then((res) => {
      if (res.data.success) {
        return res.data;
      }
    });
};

export default { createBoard, getBoard };

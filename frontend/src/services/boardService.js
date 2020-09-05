import axios from "axios";
import API_URL from "../config/config";

const getBoard = (id) => {
  return axios
    .get(API_URL + `/api/board/${id}`, { withCredentials: true })
    .then((res) => {
      if (res.data.success) {
        return res.data;
      }
    });
};

export default { getBoard };

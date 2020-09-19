import io from "socket.io-client";

const host = process.env.REACT_APP_HOST;
const socketPath = process.env.REACT_APP_SOCKET_PATH;

export let socket;

export const connect = () => {
  socket = io(host);
};

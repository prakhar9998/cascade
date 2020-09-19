import { socket } from "../socketClient/socketClient";

export const socketMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case "board/fetchBoard/fulfilled": {
      // create socket listeners
      console.log("payload", action.payload);
      socket.on("test event", (data) => {
        console.log("received", data);
      });
      console.log("fetched boards middleware");
    }
  }
  return next(action);
};

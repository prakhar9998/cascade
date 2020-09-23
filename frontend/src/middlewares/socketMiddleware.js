import { updateFullBoard } from "../features/board/boardSlice";
import { socket } from "../socketClient/socketClient";

export default (store) => (next) => (action) => {
  switch (action.type) {
    case "board/fetchBoard/fulfilled": {
      // create socket listeners
      socket.emit("join board room", action.payload._id);
      socket.on("card updated", (res) => {
        store.dispatch(updateFullBoard(res.data.board));
      });
    }
  }
  return next(action);
};

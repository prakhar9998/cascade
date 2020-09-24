import { BEGIN, COMMIT, REVERT } from "redux-optimistic-ui";
import { socket } from "../socketClient/socketClient";

const _SUCCESS = "_SUCCESS";
const _ERROR = "_ERROR";

let nextTransactionID = 0;

export default (store) => (next) => (action) => {
  const { type, meta, payload } = action;

  // if optimistic flag is set true then only proceed with optimistic updates
  // else return and continue normally
  if (!meta || !meta.isOptimistic) return next(action);

  // incrementing transactionID on every optimistic update
  let transactionID = nextTransactionID++;

  // extending the action meta to start optimistic update
  next(
    Object.assign({}, action, {
      meta: { optimistic: { type: BEGIN, id: transactionID } },
    })
  );

  // making socket calls here
  if (type === "board/changeCardPosition") {
    socket.emit(
      "CHANGE_CARD_POSITION",
      {
        source: payload.payload.source,
        destination: payload.payload.destination,
        listId: payload.payload.listId,
        boardId: payload.payload.boardId,
      },
      (error) => {
        // create redux action based on result of callback
        console.log("error in sockets", error);
        next({
          type: type + (error ? _ERROR : _SUCCESS),
          error,
          payload,
          meta: {
            optimistic: error
              ? { type: REVERT, id: transactionID }
              : { type: COMMIT, id: transactionID },
          },
        });
      }
    );
  } else if (type === "board/moveCardToList") {
    console.log("move card initiated");
    socket.emit(
      "MOVE_CARD_TO_LIST",
      {
        source: payload.payload.source,
        destination: payload.payload.destination,
        destinationListId: payload.payload.destinationListId,
        sourceListId: payload.payload.sourceListId,
        boardId: payload.payload.boardId,
      },
      (error) => {
        console.log("move card error", error);
        next({
          type: type + (error ? _ERROR : _SUCCESS),
          error,
          payload,
          meta: {
            optimistic: error
              ? { type: REVERT, id: transactionID }
              : { type: COMMIT, id: transactionID },
          },
        });
      }
    );
  } else if (type === "board/changeListPosition") {
    socket.emit(
      "CHANGE_LIST_POSITION",
      {
        source: payload.payload.source,
        destination: payload.payload.destination,
        boardId: payload.payload.boardId,
      },
      (error) => {
        console.log("reorder list error", error);
        next({
          type: type + (error ? _ERROR : _SUCCESS),
          error,
          payload,
          meta: {
            optimistic: error
              ? { type: REVERT, id: transactionID }
              : { type: COMMIT, id: transactionID },
          },
        });
      }
    );
  }
};

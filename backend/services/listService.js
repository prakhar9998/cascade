const List = require('../models/List');

const createList = async (list) => {
  const bottomListRecord = await List.find({ boardId: list.boardId }).sort('-order').limit(1);
  let listOrder;
  if (bottomListRecord.length === 0) {
    listOrder = 0;
  } else {
    listOrder = bottomListRecord[0].order + 1024;
  }

  const listRecord = await List.create({
    title: list.title,
    boardId: list.boardId,
    order: listOrder,
  });

  return { list: listRecord };
};

module.exports = { createList };

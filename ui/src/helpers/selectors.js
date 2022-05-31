function getOfferedItems(items) {
  const offeredItems = items.filter(item => item.offered);
  return offeredItems;
};

function getWantedItems(items) {
  const wantedItems = items.filter(item => !item.offered);
  return wantedItems;
};

function getMyItems(items, loggedInUser) {
  const myItems = items.filter(item => loggedInUser && item.userId === loggedInUser.id );
  return myItems;
};

export { getOfferedItems, getWantedItems, getMyItems };


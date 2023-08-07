const storeRouter = require("express").Router();
const Store = require("../models/StoreModel");

// all routes to the store DB must start with /store/...

// fetch a list of all the store items
storeRouter.get("/", async (req, res) => {
  const storeItems = await Store.find({});
  res.status(200).json(storeItems);
});

// fetch a list of an item with a specific ID
storeRouter.get("/:id", async (req, res) => {
  const storeItem = await Store.findById(req.params.id);
  res.status(200).json(storeItem);
});

// to update the quantities of the items in the store
storeRouter.put("/post-request/downstock", async (req, res) => {
  // the requested items will be put in the body
  const { requestedItems } = req.body;
  // find all the requested items first
  const storeItems = requestedItems.map((requestedItem) =>
    Store.findById(requestedItem.id)
  );
  // can do this because map preserves the order of the array
  const storeItemData = await Promise.all(storeItems);
  const updatedItems = requestedItems.map((requestedItem, i) => {
    return Store.findByIdAndUpdate(
      requestedItem.id,
      { quantity: storeItemData[i].quantity - requestedItem.quantity },
      { new: true }
    );
  });
  const newStoreList = await Promise.all(updatedItems);
  res.status(200).json(newStoreList);
});

storeRouter.put("/post-sizing/downstock", async (req, res) => {
  // requestedItems put in the body
  const { requestedItems } = req.body;
  // find all the requested items first
  const storeItems = requestedItems.map((requestedItem) =>
    Store.findById(requestedItem.id)
  );
  // can do this because map preserves the order of the array
  const storeItemData = await Promise.all(storeItems);
  const updatedItems = requestedItems.map((requestedItem, i) => {
    return Store.findByIdAndUpdate(
      requestedItem.id,
      {
        quantity:
          storeItemData[i].quantity -
          (requestedItem.quantity - requestedItem.originalQuantity),
      },
      { new: true }
    );
  });
  const newStoreList = await Promise.all(updatedItems);
  res.status(200).json(newStoreList);
});

storeRouter.put("/post-return/upstock", async (req, res) => {
  const { requestedItems, prevReq } = req.body;
  // find all the requested items first
  const storeItems = requestedItems.map((requestedItem) =>
    Store.findById(requestedItem.id)
  );
  const storeItemData = await Promise.all(storeItems);
  const updatedItems = requestedItems.map((requestedItem, i) => {
    return Store.findByIdAndUpdate(
      requestedItem.id,
      {
        quantity:
          storeItemData[i].quantity +
          requestedItem.returnedQuantity -
          prevReq.requestedItems[i].returnedQuantity,
      },
      { new: true }
    );
  });
  const newStoreList = await Promise.all(updatedItems);
  res.status(200).json(newStoreList);
});

// add a new item to the storeDB. returns the newly added item
storeRouter.post("/", async (req, res) => {
  const newEntry = new Store(req.body);
  const entryResult = await newEntry.save();
  res.status(201).json(entryResult);
});

module.exports = storeRouter;

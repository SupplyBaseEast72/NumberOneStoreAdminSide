const storeRouter = require("express").Router();
const Store = require("../models/StoreModel");

// all routes to the store DB must start with /store/...

// fetch a list of all the store items
storeRouter.get("/", async (req, res) => {
  const storeItems = await Store.find({});
  const sizedItems = [];
  const items = [];
  storeItems.forEach((storeItem) => {
    if (storeItem.name.includes(" - ")) {
      sizedItems.push(storeItem);
    } else {
      items.push(storeItem);
    }
  });
  res.status(200).json({ items, sizedItems });
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
  let consolidatedSizedItemUpdates = [];
  const updatedItems = requestedItems.map((requestedItem, i) => {
    console.log();
    const consolidatedId = requestedItem.consolidatedItemId;
    if (consolidatedId) {
      const index = consolidatedSizedItemUpdates.findIndex(
        (sizedItems) => sizedItems.consolidatedItemId === consolidatedId
      );
      if (index !== -1) {
        consolidatedSizedItemUpdates[index].quantity += Number(
          requestedItem.quantity
        );
      } else {
        consolidatedSizedItemUpdates.push({
          consolidatedItemId: consolidatedId,
          quantity: Number(requestedItem.quantity),
        });
      }
    }

    return Store.findByIdAndUpdate(
      requestedItem.id,
      { quantity: storeItemData[i].quantity - requestedItem.quantity },
      { new: true }
    );
  });
  // find consolidatedSizedItems
  const sizedItemsReq = consolidatedSizedItemUpdates.map((sizedItem) =>
    Store.findById(sizedItem.consolidatedItemId)
  );
  const sizedItems = await Promise.all(sizedItemsReq);
  const updatedSizedItems = consolidatedSizedItemUpdates.map((sizedItem, i) =>
    Store.findByIdAndUpdate(
      sizedItem.consolidatedItemId,
      {
        quantity: sizedItems[i].quantity - sizedItem.quantity,
      },
      { new: true }
    )
  );
  const fullUpdate = await Promise.all([...updatedItems, ...updatedSizedItems]);
  console.log(fullUpdate);
  res.status(200).json(fullUpdate);
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
  const consolidatedSizedItemUpdates = [];
  const updatedItems = requestedItems.map((requestedItem, i) => {
    const consolidatedId = requestedItem.consolidatedItemId;
    if (consolidatedId) {
      const index = consolidatedSizedItemUpdates.findIndex(
        (sizedItems) => sizedItems.consolidatedItemId === consolidatedId
      );
      if (index !== -1) {
        consolidatedSizedItemUpdates[index].quantity += Number(
          requestedItem.quantity
        );
        consolidatedSizedItemUpdates[index].originalQuantity += Number(
          requestedItem.originalQuantity
        );
      } else {
        consolidatedSizedItemUpdates.push({
          consolidatedItemId: consolidatedId,
          quantity: Number(requestedItem.quantity),
          originalQuantity: Number(requestedItem.originalQuantity),
        });
      }
    }
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

  // if there are sized items among the requested items, 2 quantities have to be adjusted again
  const sizedItemsReq = consolidatedSizedItemUpdates.map((item) =>
    Store.findById(item.consolidatedItemId)
  );
  const sizedItems = await Promise.all(sizedItemsReq);

  const updatedSizedItems = consolidatedSizedItemUpdates.map((item, i) => {
    return Store.findByIdAndUpdate(
      item.consolidatedItemId,
      {
        quantity:
          sizedItems[i].quantity - (item.quantity - item.originalQuantity),
      },
      { new: true }
    );
  });
  const newStoreList = await Promise.all([
    ...updatedItems,
    ...updatedSizedItems,
  ]);
  res.status(200).json(newStoreList);
});

storeRouter.put("/post-return/upstock", async (req, res) => {
  const { requestedItems, prevReq } = req.body;
  // find all the requested items first
  const storeItems = requestedItems.map((requestedItem) =>
    Store.findById(requestedItem.id)
  );
  const storeItemData = await Promise.all(storeItems);
  // track all sized items
  const consolidatedSizedItems = [];

  // adjust the quantity of returned items to take into account that the return will be split up into multiple sections
  const updatedItems = requestedItems.map((requestedItem, i) => {
    const consolidatedItemId = requestedItem.consolidatedItemId;
    if (consolidatedItemId) {
      const index = consolidatedSizedItems.findIndex(
        (sizedItem) => sizedItem.consolidatedItemId === consolidatedItemId
      );
      if (index !== -1) {
        consolidatedSizedItems[index].returnedQuantity +=
          requestedItem.returnedQuantity;
        consolidatedSizedItems[index].prevReqReturnQuantity +=
          prevReq.requestedItems[i].returnedQuantity;
      } else {
        consolidatedSizedItems.push({
          consolidatedItemId,
          returnedQuantity: requestedItem.returnedQuantity,
          prevReqReturnQuantity: prevReq.requestedItems[i].returnedQuantity,
        });
      }
    }

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
  const sizedItemsStoreListReq = consolidatedSizedItems.map((sizedItem) =>
    Store.findById(sizedItem.consolidatedItemId)
  );
  const sizedItemData = await Promise.all(sizedItemsStoreListReq);
  const sizedItemsUpdateReq = consolidatedSizedItems.map((sizedItem, i) =>
    Store.findByIdAndUpdate(
      sizedItem.consolidatedItemId,
      {
        quantity:
          sizedItemData[i].quantity +
          sizedItem.returnedQuantity -
          sizedItem.prevReqReturnQuantity,
      },
      { new: true }
    )
  );

  const newStoreList = await Promise.all([
    ...updatedItems,
    ...sizedItemsUpdateReq,
  ]);
  console.log(newStoreList);
  res.status(200).json(newStoreList);
});

// add a new item to the storeDB. returns the newly added item
storeRouter.post("/", async (req, res) => {
  const newEntry = new Store(req.body);
  const entryResult = await newEntry.save();
  res.status(201).json(entryResult);
});

module.exports = storeRouter;

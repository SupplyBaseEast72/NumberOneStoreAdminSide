const storeRouter = require("express").Router();
const Store = require("../models/StoreModel");

// all routes to the store DB must start with /store/...

// fetch a list of all the store items
storeRouter.get("/", async (req, res) => {
  const storeItems = await Store.find({});
  res.status(200).json(storeItems);
});

// add a new item to the storeDB. returns the newly added item
storeRouter.post("/", async (req, res) => {
  const newEntry = new Store(req.body);
  const entryResult = await newEntry.save();
  res.status(201).json(entryResult);
});

module.exports = storeRouter;

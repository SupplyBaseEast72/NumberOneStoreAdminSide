const requestRouter = require("express").Router();
const mongoose = require("mongoose");
const Request = require("../models/RequestModel");

// get a list of all the requests
requestRouter.get("/", async (req, res) => {
  const requests = await Request.find({}).populate("requestedItems");
  res.status(200).send(requests);
});

// get a list of requests, sorted by their status
requestRouter.get("/filteredRequests", async (req, res) => {
  const requestArray = [
    Request.find({ status: "Pending" }),
    Request.find({ status: "Awaiting Sizing" }),
    Request.find({
      $or: [{ status: "Awaiting Return" }, { status: "Incomplete Return" }],
    }),
  ];
  const [sizingRequests, sizingAppointments, returnAppointments] =
    await Promise.all(requestArray);
  res.status(200).json({
    sizingReq: sizingRequests,
    sizingAppt: sizingAppointments,
    returnAppt: returnAppointments,
  });
});

// find a single request
requestRouter.get("/:id", async (req, res) => {
  const requestId = req.params.id;
  // not sure why my middleware handler is not working properly though...
  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return res.status(404).send({ error: "Invalid ID entered" });
  }
  const request = await Request.findById(requestId).populate("requestedItems");

  if (request === null) {
    return res.status(404).send({ error: "Invalid ID entered" });
  }

  res.status(200).send(request);
});

// add a new request
requestRouter.post("/", async (req, res) => {
  const newRequest = new Request(req.body);
  const savedRequest = await newRequest.save();

  res.status(201).send(savedRequest);
});

requestRouter.put("/:id", async (req, res) => {
  const updatedRequest = req.body;
  const savedRequest = await Request.findByIdAndUpdate(
    req.params.id,
    updatedRequest,
    { new: true }
  );
  res.status(200).send(savedRequest);
});

module.exports = requestRouter;

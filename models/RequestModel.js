const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  requester: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  requestedItems: [
    {
      type: Object,
    },
  ],
  sizingDate: {
    type: String,
    required: true,
  },
  returnDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  time: {
    type: String,
    required: true,
  },
});

requestSchema.set("toJSON", {
  transform: (originalDoc, returnedDoc) => {
    returnedDoc.id = returnedDoc._id.toString();
    delete returnedDoc._id;
    delete returnedDoc.__v;
  },
});

module.exports = mongoose.model("Request", requestSchema);

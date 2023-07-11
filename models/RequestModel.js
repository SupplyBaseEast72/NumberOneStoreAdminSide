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
  requestedItems: {
    type: Object,
    required: true,
  },
  sizingDate: {
    type: String,
    required: true,
  },
  loanRequestNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
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

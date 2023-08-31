const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  imgUrl: {
    type: String,
    required: true,
  },
  originalQuantity: {
    type: Number,
    required: true,
  },
  sizes: {
    type: Array,
    required: true,
  },
  consolidatedItemId: String,
});

// if this is not working, it means that you missed out the tansform option
storeSchema.set("toJSON", {
  transform: (originalDoc, returnedDoc) => {
    returnedDoc.id = returnedDoc._id.toString();
    delete returnedDoc._id;
    delete returnedDoc.__v;
  },
});

module.exports = mongoose.model("StoreItem", storeSchema);

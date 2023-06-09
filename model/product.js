const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  compDetails: [
    {
      serialNumber: {
        type: String,
      },
      modelNumber: {
        type: String,
      },
      isReplace: {
        type: Boolean,
        default: false,
      },
    },
  ],
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);

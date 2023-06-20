const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("categoryModel", categorySchema);

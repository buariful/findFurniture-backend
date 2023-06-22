const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: [String],
});

module.exports = mongoose.model("categoryModel", categorySchema);

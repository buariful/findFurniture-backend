const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductModel",
    },
  ],
});

module.exports = mongoose.model("categoryModel", categorySchema);

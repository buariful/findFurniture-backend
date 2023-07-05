const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // products: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "ProductModel",
  //   },
  // ],
  picture: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("categoryModel", categorySchema);

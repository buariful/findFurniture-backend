const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  estabished: {
    type: Date,
  },
  // products: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "ProductModel",
  //   },
  // ],
});

module.exports = mongoose.model("BrandModel", brandSchema);

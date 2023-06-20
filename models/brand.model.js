const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  estabished: {
    type: Date,
  },
  totalProducts: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("BrandModel", brandSchema);

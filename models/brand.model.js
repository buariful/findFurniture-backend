const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  estabished: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("BrandModel", brandSchema);

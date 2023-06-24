const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
  thumbImg: {
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  images: [
    {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
    default: null,
  },
  discount: {
    type: Number,
    default: null,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "BrandModel",
  },
  category: {
    type: String,
    required: true,
  },
  relatedProducts_categories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CategoryModel" },
  ],
  shippingCost: {
    freeShipping: {
      area: [{ type: String, required: true }],
      time: { type: String, required: true },
    },
    lowShipping: {
      area: [{ type: String, required: true }],
      price: { type: Number, required: true },
      time: { type: String, required: true },
    },
    highShipping: {
      price: { type: Number, required: true },
      time: { type: String, required: true },
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
});

module.exports = mongoose.model("ProductModel", productSchema);

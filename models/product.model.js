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
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  brandName: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "BrandModel",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CategoryModel",
  },
  relatedProducts_categories: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CategoryModel" },
  ],
  shippingCost: {
    freeShipping: {
      area: [{ type: String }],
      price: { type: Number },
      time: { type: Number },
    },
    lowShipping: {
      area: [{ type: String }],
      price: { type: Number },
      time: { type: Number },
    },
    highPrice: { price: { type: Number }, time: { type: Number } },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
});

module.exports = mongoose.model("ProductModel", productSchema);

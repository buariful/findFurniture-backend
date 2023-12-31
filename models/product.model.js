const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  colors: [
    {
      type: String,
      required: [true, "Please enter product's available colors"],
    },
  ],
  productCode: {
    type: String,
    required: true,
  },
  images: [
    {
      publicId: {
        type: String,
        required: [true, "Please image public id is required"],
      },
      url: {
        type: String,
        required: [true, "Please image url is required"],
      },
    },
  ],
  price: {
    type: Number,
    required: [true, "Please enter product price"],
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
    type: String,
    required: [true, "Please enter product brand"],
  },
  category: {
    type: String,
    required: [true, "Please enter product category"],
  },
  relatedProducts_categories: [{ type: String, required: true }],
  totalReviews: { type: Number, default: 0 },
  totalRating: { type: Number, default: 0 },
  avg_rating: { type: Number, default: 0 },
  shippingCost: {
    freeShipping: {
      area: [
        {
          label: { type: String },
          value: { type: String },
        },
      ],
      time: { type: Number },
    },
    lowShipping: {
      area: [
        {
          label: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      price: {
        type: Number,
        required: [true, "Please enter low shipping cost"],
      },
      time: {
        type: Number,
        required: [true, "Please enter low shipping time"],
      },
    },
    highShipping: {
      price: {
        type: Number,
        required: [true, "Please enter high shipping cost"],
      },
      time: {
        type: Number,
        required: [true, "Please enter high shipping time"],
      },
    },
  },
  description: {
    type: String,
    required: [true, "Please give product description"],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, "Please give the produt's stock"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
});

module.exports = mongoose.model("ProductModel", productSchema);

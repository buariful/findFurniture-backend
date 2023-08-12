const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  trans_id: { type: String, required: [true, "Transaction id is undefined"] },
  customer: {
    type: mongoose.Types.ObjectId,
    required: [true, "Customer information couldn't find"],
    ref: "UserModel",
  },
  total_amount: {
    type: Number,
    required: [true, "Product price is undefined"],
  },
  shipping_cost: {
    type: Number,
    required: [true, "Shipping cost is undefined"],
  },
  shipping_time: {
    type: Date,
    required: [true, "Shipping time is undefined"],
  },
  shipping_address: {
    type: String,
    required: [true, "Customer address is undefined"],
    trim: true,
  },
  products: [
    {
      type: mongoose.Types.ObjectId,
      required: [true, "Product is undefined"],
      ref: "ProductModel",
    },
  ],
  isPaid: { type: Boolean, required: true, default: false },
  isDelivered: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("OrderModel", orderSchema);

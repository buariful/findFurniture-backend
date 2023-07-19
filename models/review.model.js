const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please give the product id"],
    ref: "ProductModel",
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please give the user id"],
    ref: "UserModel",
  },
  comment: { type: String },
  rating: { type: Number, required: [true, "Please give ratings"] },
});

module.exports = mongoose.model("reviewModel", reviewSchema);

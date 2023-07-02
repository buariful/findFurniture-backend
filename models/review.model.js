const { default: mongoose } = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Types.ObjectId },
  // aro lekhte hobe. it is incomplete
});

module.exports = mongoose.model("reviewModel", reviewSchema);

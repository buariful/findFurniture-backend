const asyncError = require("../middleware/asyncError");
const productModel = require("../models/product.model");
const reviewModel = require("../models/review.model");
const ErrorClass = require("../utils/ErrorClass");

// exports.createReview = asyncError(async (req, res, next) => {
//   const { productId, comment, rating } = req.body;
//   if (!productId || !rating) {
//     return next(new ErrorClass("Please give ratings and other info", 400));
//   }

//   const product = await productModel.findById(productId);
//   if (!product) {
//     return next(new ErrorClass("Product not found", 400));
//   }

//   const review = await reviewModel.find({
//     user: req.user._id,
//     product: productId,
//   });
//   if (review.length > 0) {
//     return next(
//       new ErrorClass("Already given a review. Now you can update your review")
//     );
//   }

//   const newReview = await reviewModel.create({
//     product: productId,
//     comment,
//     rating,
//     user: req.user._id,
//   });

//   product.totalReviews += 1;
//   product.totalRating += rating;
//   product.avg_rating = product.totalRating / product.totalReviews;
//   await product.save();

//   res.status(201).json({
//     success: true,
//     message: "Thanks for your feedback",
//     data: newReview,
//   });
// });
exports.createReview = asyncError(async (req, res, next) => {
  const { product, comment, rating } = req.body;
  if (!product || !rating) {
    return next(new ErrorClass("Please give ratings and other info", 400));
  }

  const targeted_product = await productModel.findById(product);
  if (!targeted_product) {
    return next(new ErrorClass("Product not found", 400));
  }

  const review = await reviewModel.find({
    user: req.user._id,
    product: product,
  });
  if (review.length > 0) {
    return next(
      new ErrorClass("Already given a review. Now you can update your review")
    );
  }

  const newReview = await reviewModel.create({
    product: product,
    comment,
    rating,
    user: req.user._id,
  });

  targeted_product.totalReviews += 1;
  targeted_product.totalRating += rating;
  targeted_product.avg_rating = (
    targeted_product.totalRating / targeted_product.totalReviews
  ).toFixed(1);
  await targeted_product.save();

  res.status(201).json({
    success: true,
    message: "Thanks for your feedback",
    data: newReview,
  });
});

exports.updateReview = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const updateReviewData = req.body;
  let review = await reviewModel.find({ user: req.user._id, _id: id });

  if (!review.length > 0) {
    return next(new ErrorClass("review not found", 400));
  }
  if (updateReviewData.rating) {
    const { product, rating } = review[0];
    const targetedProduct = await productModel.findById(product);
    if (targetedProduct) {
      const ratignDiff = updateReviewData.rating - rating;
      targetedProduct.totalRating += ratignDiff;
      targetedProduct.avg_rating =
        targetedProduct.totalRating / targetedProduct.totalReviews;
      targetedProduct.save();
    }
  }

  const updatedReview = await reviewModel.findByIdAndUpdate(
    id,
    updateReviewData,
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: updatedReview,
  });
});

exports.getProductReviews = asyncError(async (req, res, next) => {
  const productId = req.params.productId;
  const review = await reviewModel
    .find({ product: productId })
    .populate("user", "name avatar");

  res.status(200).json({ success: true, data: review });
});
exports.getSingleReview = asyncError(async (req, res, next) => {
  const id = req.params.id;
  const review = await reviewModel.findById(id);

  if (!review) {
    return next(new ErrorClass("Review not found", 400));
  }
  res.status(200).json({ success: true, data: review });
});

exports.deleteSingleReview = asyncError(async (req, res, next) => {
  const id = req.params.id;
  const review = await reviewModel.findById(id);

  const product = await productModel.findById(review.product);
  if (product) {
    product.totalRating -= review.rating;
    product.totalReviews -= 1;
    product.avg_rating = product.totalRating / product.totalReviews;
    product.save();
  }

  await reviewModel.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
    data: review,
  });
});

exports.getUserAllReviews = asyncError(async (req, res, next) => {
  const reviews = await reviewModel
    .find({ user: req.user._id })
    .populate("product");

  if (reviews.length < 1) {
    return next(new ErrorClass("No reviews found", 400));
  }
  res.status(200).json({
    success: true,
    data: reviews,
  });
});

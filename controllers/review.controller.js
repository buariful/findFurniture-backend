const asyncError = require("../middleware/asyncError");
const productModel = require("../models/product.model");
const reviewModel = require("../models/review.model");
const ErrorClass = require("../utils/ErrorClass");
const Errorclass = require("../utils/ErrorClass");

exports.createReview = asyncError(async (req, res, next) => {
  const { productId, comment, rating } = req.body;
  if (!productId || !rating) {
    return next(new Errorclass("Given informations are not enough", 400));
  }

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new ErrorClass("Product not found", 400));
  }

  const review = await reviewModel.find({
    userId: req.user._ie,
    productId,
  });
  if (review) {
    return next(
      new ErrorClass("Already given a review. Now you can update your review")
    );
  }

  const newReview = await reviewModel.create({
    productId,
    comment,
    rating,
    userId: req.user._id,
  });

  product.totalReviews += 1;
  product.totalRating += rating;
  product.avg_rating = product.totalRating / product.totalReviews;
  await product.save();

  res.status(201).json({
    success: true,
    message: "Thanks for your feedback",
    data: newReview,
  });
});

exports.updateReview = asyncError(async (req, res, next) => {
  const { id } = req.params;
  const updateReviewData = req.body;
  let review = await reviewModel.find({ userId: req.user._id, _id: id });

  if (!review.length > 0) {
    return next(new ErrorClass("review not found", 400));
  }
  if (updateReviewData.rating) {
    const { productId, rating } = review[0];
    const product = await productModel.findById(productId);

    if (product) {
      const ratignDiff = updateReviewData.rating - rating;
      product.totalRating += ratignDiff;
      product.avg_rating = product.totalRating / product.totalReviews;
      product.save();
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

  const product = await productModel.findById(review.productId);
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

exports.getUserAllReviews = asyncError(async (req, res) => {
  //   console.log("sssssssssss", req.user._id);

  //   const reviews = await reviewModel.find({ userId: req.user._id });

  //   res.status(200).json({
  //     success: true,
  //     data: reviews,
  //   });

  res.send("ddd");
});

const asyncError = require("../middleware/asyncError");
const categoryModel = require("../models/category.model");
const ErrorClass = require("../utils/ErrorClass");

exports.createCategory = asyncError(async (req, res, next) => {
  const { name } = req.body;
  const isCategoryExist = await categoryModel.findOne({ name });
  if (isCategoryExist) {
    return next(new ErrorClass("category exist", 400));
  }

  const category = await categoryModel.create({ name });

  res.status(201).json({
    success: true,
    data: category,
  });
});

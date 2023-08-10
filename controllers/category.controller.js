const asyncError = require("../middleware/asyncError");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const ErrorClass = require("../utils/ErrorClass");
const imageUpload = require("../utils/imageUpload");

exports.getAllCategory = asyncError(async (_req, res) => {
  const categories = await categoryModel.find({});
  res.status(200).json({
    success: true,
    data: categories,
  });
});

// only admin
exports.createCategory = asyncError(async (req, res, next) => {
  const { name } = req.body;

  const isCategoryExist = await categoryModel.findOne({ name });
  if (isCategoryExist) {
    return next(new ErrorClass("category exist", 400));
  }

  const imgLinks = await imageUpload(req);

  const category = await categoryModel.create({ name, picture: imgLinks });

  res.status(201).json({
    success: true,
    data: category,
  });
});

exports.deleteCategory = asyncError(async (req, res, next) => {
  const categoryId = req.params.id;

  const targeted_category = await categoryModel.findById(categoryId);
  if (!targeted_category) {
    return next(new ErrorClass("Categroy not found", 400));
  }

  const products = await productModel.find({
    category: targeted_category.name,
  });

  if (products.length === 0) {
    const result = await categoryModel.findByIdAndDelete(categoryId);

    return res.status(200).json({
      success: true,
      message: "Successfully Deleted",
      data: result,
    });
  } else {
    return next(
      new ErrorClass("There are some products under this category", 400)
    );
  }
});

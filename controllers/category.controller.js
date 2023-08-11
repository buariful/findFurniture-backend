const asyncError = require("../middleware/asyncError");
const categoryModel = require("../models/category.model");
const productModel = require("../models/product.model");
const ErrorClass = require("../utils/ErrorClass");
const cloudinaryConfig = require("../utils/cloudinary");
const imageUpload = require("../utils/imageUpload");

exports.getAllCategory = asyncError(async (_req, res) => {
  const categories = await categoryModel.find({});
  res.status(200).json({
    success: true,
    totalResult: categories.length,
    data: categories,
  });
});

// only admin
exports.createCategory = asyncError(async (req, res, next) => {
  const { name } = req.body;

  const isCategoryExist = await categoryModel.findOne({
    name: { $regex: name, $options: "i" },
  });
  if (isCategoryExist) {
    return next(new ErrorClass("category exist with the same name", 400));
  }

  const imgLinks = await imageUpload(req);

  const category = await categoryModel.create({
    name,
    label: name,
    value: name,
    picture: imgLinks,
  });

  res.status(201).json({
    success: true,
    message: "Category created",
    data: category,
  });
});

exports.deleteCategory = asyncError(async (req, res, next) => {
  const categoryId = req.params.id;
  const { category, imgPublicId } = req.body;

  const products = await productModel.find({
    category: { $regex: category, $options: "i" },
  });
  console.log(products);
  if (products.length === 0) {
    await cloudinaryConfig.uploader.destroy(imgPublicId);
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

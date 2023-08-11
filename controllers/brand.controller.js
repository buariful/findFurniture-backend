const asyncError = require("../middleware/asyncError");
const brandModel = require("../models/brand.model");
const productModel = require("../models/product.model");
const ErrorClass = require("../utils/ErrorClass");

exports.getAllBrands = asyncError(async (_req, res) => {
  const result = await brandModel.find({});

  res.status(200).json({
    success: true,
    totalResults: result.length,
    data: result,
  });
});

// -- Admin
exports.createBrand = asyncError(async (req, res, next) => {
  const { name, estabished } = req.body;
  const isBrandExist = await brandModel.find({
    name: { $regex: name, $options: "i" },
  });
  if (isBrandExist.length > 0) {
    return next(new ErrorClass("Brand Exist with the same name", 400));
  }
  const brand = await brandModel.create({
    name,
    label: name,
    value: name,
    estabished,
  });

  res.status(201).json({
    success: true,
    message: "Brand created successfully",
    data: brand,
  });
});

// ---Admin
exports.deleteBrand = asyncError(async (req, res, next) => {
  const brandId = req.params.id;
  const { name } = req.body;
  const product = await productModel.find({
    brand: { $regex: name, $options: "i" },
  });
  if (product.length > 0) {
    return next(
      new ErrorClass(`${product.length} products under this brand.`, 400)
    );
  }

  const result = await brandModel.findByIdAndDelete(brandId);
  res.status(200).json({
    success: true,
    message: "Successfully deleted the brand",
    data: result,
  });
});

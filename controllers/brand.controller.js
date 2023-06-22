const asyncError = require("../middleware/asyncError");
const brandModel = require("../models/brand.model");
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
  const isBrandExist = await brandModel.findOne({
    name: { $regex: name, $options: "i" },
  });
  if (isBrandExist) {
    return next(new ErrorClass("Brand Exist", 400));
  }

  const brand = await brandModel.create({
    name,
    estabished,
  });

  res.status(201).json({
    success: true,
    data: brand,
  });
});

// ---Admin
exports.deleteBrand = asyncError(async (req, res, next) => {
  const brandId = req.params.id;
  const brand = await brandModel.findById(brandId);

  if (brand.products.length > 0) {
    return next(
      new ErrorClass("This brand cann't be deleted for having products"),
      400
    );
  }

  const result = await brandModel.findByIdAndDelete(brandId);
  res.status(200).json({
    success: true,
    message: "Successfully deleted the brand",
    data: result,
  });
});

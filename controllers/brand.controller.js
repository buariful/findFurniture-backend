const asyncError = require("../middleware/asyncError");
const brandModel = require("../models/brand.model");
const ErrorClass = require("../utils/ErrorClass");

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

// exports.deleteBrand = asyncError(async (req, res, next) => {
//   const { name, estabished } = req.body;
//   const isBrandExist = await brandModel.findOne({ name });
//   if (isBrandExist) {
//     return next(new ErrorClass("Brand Exist", 400));
//   }

//   const brand = await brandModel.create({
//     name,
//     estabished,
//   });

//   res.status(201).json({
//     success: true,
//     data: brand,
//   });
// });

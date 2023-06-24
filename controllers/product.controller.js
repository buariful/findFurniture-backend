const asyncError = require("../middleware/asyncError");
const imageUpload = require("../utils/imageUpload");
const generateProductCode = require("../utils/generateProductCode");
const productModel = require("../models/product.model");
const ErrorClass = require("../utils/ErrorClass");

exports.getProducts = asyncError(async (req, res) => {
  const products = await productModel.find({});

  res.status(200).json({
    success: true,
    totalResults: products.length,
    data: products,
  });
});

exports.getSingleProduct = asyncError(async (req, res, next) => {
  const id = req.params.id;
  const product = await productModel.findById(id);

  if (!product) {
    return next(new ErrorClass("No product found", 400));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// -- Admin
exports.updateProduct = asyncError(async (req, res, next) => {
  const id = req.params.id;
  const updateProductInfo = req.body;
  const product = await productModel
    .findByIdAndUpdate(id, updateProductInfo, {
      new: true,
    })
    .populate("brand", "name");

  if (!product) {
    return next(new ErrorClass("No product found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// --Admin
exports.deleteProduct = asyncError(async (req, res, next) => {
  const id = req.params.id;
  const deletedProduct = await productModel.findByIdAndDelete(id, {
    new: true,
  });

  if (!deletedProduct) {
    return next(new ErrorClass("Product not found or cannot be deleted", 400));
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: deletedProduct,
  });
});

// -- Admin
exports.createProduct = asyncError(async (req, res, next) => {
  const {
    name,
    price,
    sellPrice,
    brand,
    category,
    relatedProducts_categories,
    shippingCost,
  } = req.body;

  const productCode = await generateProductCode();

  let images = [];
  let thumbImg;
  const imgLinks = await imageUpload(req);
  for (let i = 0; i < imgLinks.length; i++) {
    if (i === 0) {
      thumbImg = imgLinks[0];
    } else {
      images.push(imgLinks[i]);
    }
  }

  let discount;
  if (!sellPrice) {
    discount = null;
  } else {
    const subOfPrices = JSON.parse(price) - JSON.parse(sellPrice);
    discount = parseInt((subOfPrices * 100) / price);
  }

  let newProduct = await productModel.create({
    name,
    productCode,
    thumbImg,
    images,
    price,
    sellPrice,
    discount,
    brand,
    category,
    relatedProducts_categories: JSON.parse(relatedProducts_categories),
    shippingCost: JSON.parse(shippingCost),
    createdBy: req.user._id,
  });

  newProduct = await productModel.populate(newProduct, {
    path: "brand",
    select: "name",
  });

  res.status(201).json({
    success: true,
    message: "Successfully product created",
    data: newProduct,
  });
});

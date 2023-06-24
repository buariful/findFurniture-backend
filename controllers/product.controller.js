const asyncError = require("../middleware/asyncError");
const imageUpload = require("../utils/imageUpload");
const generateProductCode = require("../utils/generateProductCode");
const productModel = require("../models/product.model");
const ErrorClass = require("../utils/ErrorClass");
const ProductFilter = require("../utils/productFilter");

exports.getProducts = asyncError(async (req, res) => {
  const result = new ProductFilter(productModel.find(), req.query)
    .search()
    .filter();

  let products = await result.query;
  let filteredProductsCount = products.length;

  result.pagination(4);

  products = await result.query;

  // const a = await productModel.find({
  //   colors: { $in: ["yellow", "ss"] },
  // });

  // const a = await productModel.find({ colors: { $in: ["blue", "red"] } });

  res.status(200).json({
    success: true,
    // a,
    totalResults: filteredProductsCount,
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
    colors,
  } = req.body;

  const productCode = await generateProductCode();

  // let images = [];
  // let thumbImg;
  // const imgLinks = await imageUpload(req);
  // for (let i = 0; i < imgLinks.length; i++) {
  //   if (i === 0) {
  //     thumbImg = imgLinks[0];
  //   } else {
  //     images.push(imgLinks[i]);
  //   }
  // }
  let thumbImg = {
    publicId: "findFurniture/rfewiwbtjy7pgod4lss4",
    url: "https://res.cloudinary.com/dygolqxi7/image/upload/v1687608264/findFurniture/rfewiwbtjy7pgod4lss4.jpg",
  };
  let images = [
    {
      publicId: "findFurniture/rfewiwbtjy7pgod4lss4",
      url: "https://res.cloudinary.com/dygolqxi7/image/upload/v1687608264/findFurniture/rfewiwbtjy7pgod4lss4.jpg",
    },
    {
      publicId: "findFurniture/rfewiwbtjy7pgod4lss4",
      url: "https://res.cloudinary.com/dygolqxi7/image/upload/v1687608264/findFurniture/rfewiwbtjy7pgod4lss4.jpg",
    },
  ];

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
    colors: JSON.parse(colors),
    relatedProducts_categories: JSON.parse(relatedProducts_categories),
    shippingCost: JSON.parse(shippingCost),
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Successfully product created",
    data: newProduct,
  });
});

/* ==========================
ONLY FOR DEVELOPING PURPOSE, NOT FOR PRODUCTION
=============================*/

exports.deleteAllProducts = asyncError(async (_req, res) => {
  const result = await productModel.deleteMany({});

  res.send(result);
});

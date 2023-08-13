const asyncError = require("../middleware/asyncError");
const imageUpload = require("../utils/imageUpload");
const generateProductCode = require("../utils/generateProductCode");
const productModel = require("../models/product.model");
const ErrorClass = require("../utils/ErrorClass");
const getRandomProducts = require("../utils/getRandomProducts");
const cloudinaryConfig = require("../utils/cloudinary");
const orderModel = require("../models/order.model");
const FilterClass = require("../utils/filterClass");

exports.getProducts = asyncError(async (req, res) => {
  const result = new FilterClass(productModel.find(), req.query)
    .productSearch()
    .productFilter()
    .productPriceFilter();
  let products = await result.getResult();
  let filteredProductsCount = products.length;
  result.pagination();
  products = await result.query;

  if (filteredProductsCount === 0) {
    return res.status(400).json({
      success: false,
      message: "no products found",
      data: [],
    });
  }

  res.status(200).json({
    success: true,
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

  const relatedProducts = await getRandomProducts(
    product.relatedProducts_categories
  );

  res.status(200).json({
    success: true,
    data: product,
    relatedProducts,
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
    description,
    stock,
  } = req.body;
  if (
    !name ||
    !price ||
    !brand ||
    !category ||
    !relatedProducts_categories ||
    !shippingCost ||
    !colors ||
    !description ||
    !stock
  ) {
    return next(new ErrorClass("Please give all the details", 400));
  }

  const related_Categories = JSON.parse(relatedProducts_categories);
  if (related_Categories.includes(category)) {
    return next(
      new ErrorClass(
        "Related product categories should not include product category"
      )
    );
  }
  if (price <= sellPrice) {
    return next(
      new ErrorClass(
        "Product sell-price should be smaller than it's price",
        400
      )
    );
  }

  const shippingInfo = JSON.parse(shippingCost);
  const { freeShipping, lowShipping, highShipping } = shippingInfo;
  if (
    freeShipping.time <= 0 ||
    lowShipping.time <= 0 ||
    lowShipping.price <= 0 ||
    highShipping.price <= 0 ||
    highShipping.time <= 0
  ) {
    return next(
      new ErrorClass("Shipping time and price should not be negative or 0", 400)
    );
  }

  const productCode = await generateProductCode();

  let images = [];
  const imgLinks = await imageUpload(req);
  for (let i = 0; i < imgLinks.length; i++) {
    images.push(imgLinks[i]);
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
    images,
    price,
    sellPrice,
    discount,
    brand,
    category,
    colors: JSON.parse(colors),
    relatedProducts_categories: related_Categories,
    shippingCost: shippingInfo,
    createdBy: req.user._id,
    description,
    stock,
  });
  res.status(201).json({
    success: true,
    message: "Successfully product created",
    data: newProduct,
  });
});

// -- Admin
exports.updateProduct = asyncError(async (req, res, next) => {
  const id = req.params.id;
  const updateProductInfo = req.body;
  const { sellPrice, price } = req.body;

  if (sellPrice > price || sellPrice === price) {
    return next(
      new ErrorClass("Sellprice should be smaller than product price")
    );
  }
  if (!sellPrice) {
    updateProductInfo.discount = null;
  } else {
    const subOfPrices = JSON.parse(price) - JSON.parse(sellPrice);
    updateProductInfo.discount = parseInt((subOfPrices * 100) / price);
  }
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
  const product = await productModel.findById(id);

  const orderOfProduct = await orderModel.find({
    products: id,
    isDelivered: false,
  });

  if (orderOfProduct.length > 0) {
    return next(
      new ErrorClass(
        "Product cannot be deleted. User's order has not been delivered yet.",
        400
      )
    );
  }

  await Promise.all(
    product?.images.map(async (img) => {
      await cloudinaryConfig.uploader.destroy(img.publicId);
    })
  );
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

// --Admin
exports.addProdImages = asyncError(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);

  if (!product) {
    return next(new ErrorClass("Product not found", 400));
  }
  if (req.files.length <= 0) {
    return next(new ErrorClass("Images not found", 400));
  }
  const images = await imageUpload(req);
  product.images = [...product.images, ...images];
  await product.save();

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: product,
  });
});

// --Admin
exports.deleteProdImage = asyncError(async (req, res, next) => {
  const { productId } = req.params;
  const { publicIdStr } = req.body;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new ErrorClass("Product not found", 400));
  }

  await cloudinaryConfig.uploader.destroy(publicIdStr);
  const images = product.images.filter((img) => img.publicId !== publicIdStr);
  product.images = images;
  await product.save();

  res.status(200).json({ success: true, message: "Image deleted" });
});

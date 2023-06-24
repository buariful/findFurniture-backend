const asyncError = require("../middleware/asyncError");
const ErrorClass = require("../utils/ErrorClass");
const cloudinaryConfig = require("../utils/cloudinary");
const imageUpload = require("../utils/imageUpload");
const generateProductCode = require("../utils/generateProductCode");
const productModel = require("../models/product.model");

exports.imgUpload = asyncError(async (req, res, next) => {
  const result = await imageUpload(req);

  res.json({ data: result });
});

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

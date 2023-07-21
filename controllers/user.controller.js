const asyncError = require("../middleware/asyncError");
const userModel = require("../models/user.model");
const ErrorClass = require("../utils/ErrorClass");
const cloudinary = require("../utils/cloudinary");
const { setCookie } = require("../utils/setCookie");

exports.registerUser = asyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorClass("Given informations are not enough", 400));
  }

  const isUserExist = await userModel.findOne({ email: email });
  if (isUserExist) {
    return next(new ErrorClass("Email is in use, try with another mail", 400));
  }

  const user = await userModel.create({
    name,
    email,
    password,
    avatar: {
      publicId: "",
      url: "",
    },
  });

  setCookie(user, 201, res, "Register Sucessfully");
});

exports.login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel
    .findOne({ email })
    .select("+password")
    .populate("cartItem.product", "name productCode price sellPrice images");
  if (!user) {
    return next(new ErrorClass("Email or Password doesn't matched", 401));
  }

  const isPasswrodMatched = await user.comparePassword(password);
  if (!isPasswrodMatched) {
    return next(new ErrorClass("Email or Password doesn't matched", 401));
  }
  setCookie(user, 200, res, "Login Successful");
});

exports.logOut = asyncError((_req, res) => {
  res.cookie("auth", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    sucess: true,
    message: "Logout Succesfully",
  });
});

exports.getUserByCookie = asyncError((req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

exports.addProdToCart = asyncError(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const user = await userModel.findById(req.user._id);

  const isProdExist = user.cartItem.find(
    (cart) => cart.product.toString() === productId
  );
  if (isProdExist) {
    return next(new ErrorClass("Product already exist in your cart", 400));
  }

  user.cartItem.push({
    product: productId,
    quantity,
  });
  await user.save();

  res.status(200).json({
    success: true,
    data: user.cartItem,
  });
});

exports.deleteProdFromCart = asyncError(async (req, res) => {
  const { productId } = req.body;
  const user = await userModel.findById(req.user._id);

  const newCartItems = user.cartItem.filter(
    (cart) => cart.product.toString() !== productId
  );
  user.cartItem = newCartItems;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    data: user.cartItem,
  });
});

exports.updateQuantityOfCartProduct = asyncError(async (req, res, next) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity <= 0) {
    return next(
      new ErrorClass("Given informatin are not enough or not coreect", 400)
    );
  }

  const user = await userModel.findById(req.user._id);
  const productIndex = user.cartItem.findIndex(
    (cart) => cart.product.toString() === productId
  );
  const product = user.cartItem[productIndex];
  product.quantity = quantity;

  user.cartItem.splice(productIndex, 1, product);
  await user.save();

  res.status(200).json({ success: true, data: user.cartItem });
});

const asyncError = require("../middleware/asyncError");
const userModel = require("../models/user.model");
const ErrorClass = require("../utils/ErrorClass");
const cloudinaryConfig = require("../utils/cloudinary");
const imageUpload = require("../utils/imageUpload");
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
    .populate(
      "cartItem.product",
      "name productCode price sellPrice images shippingCost"
    )
    .populate("wishList", "name productCode price sellPrice images stock");
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
    sameSite: "none",
    secure: true,
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
  const { productId } = req.body;
  const user = await userModel.findById(req.user._id);

  const isProdExist = user.cartItem.find(
    (cart) => cart.product.toString() === productId
  );
  if (isProdExist) {
    return next(new ErrorClass("Product already exist in your cart", 400));
  }

  user.cartItem.push({
    product: productId,
    quantity: 1,
  });
  await user.save();

  res.status(200).json({
    success: true,
    data: user.cartItem[user.cartItem.length - 1],
    message: "Successfully added the product to cart",
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

exports.addProdToWishlist = asyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  const { productId } = req.body;
  const isProdExist = await user.wishList.find(
    (list) => list.toString() === productId
  );
  if (isProdExist) {
    return next(new ErrorClass("Product exist in your wishlist"));
  }
  user.wishList.push(productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Successfully added the product",
  });
});

exports.deletProdFromWishList = asyncError(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);
  const { productId } = req.body;
  const productIndex = await user.wishList.findIndex(
    (list) => list.toString() === productId
  );
  user.wishList.splice(productIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Successfully removed the product",
  });
});

exports.updateUserProfile = asyncError(async (req, res, next) => {
  const { name, email } = req.body;
  let data = { name, email };
  const isEmailExist = await userModel.findOne({ email });
  if (isEmailExist && email !== req.user.email) {
    return next(new ErrorClass("Email is in use. Please use another one", 400));
  }

  try {
    if (req.file) {
      let result;
      if (req.user?.avatar?.publicId) {
        const publicIdStr = req.user?.avatar?.publicId;
        await cloudinaryConfig.uploader.destroy(publicIdStr);
        result = await cloudinaryConfig.uploader.upload(req.file.path, {
          public_id: publicIdStr,
          transformation: [{ max_width: 512, max_height: 512 }],
          max_bytes: 1000000,
          quality: 80,
        });
      } else {
        result = await cloudinaryConfig.uploader.upload(req.file.path, {
          folder: "findFurniture",
          quality: "auto",
        });
      }
      data.avatar = {
        url: result?.secure_url,
        publicId: result?.public_id,
        default: req.user?.avatar?.default,
      };
    }

    const updateProfile = await userModel.findByIdAndUpdate(
      req.user._id,
      data,
      {
        new: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully updated your profile",
      data: updateProfile,
    });
  } catch (error) {
    return next(
      new ErrorClass("Profile can not be updated, something went wrong", 400)
    );
  }
});

exports.updatePassword = asyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  if (newPassword !== confirmPassword) {
    return next(
      new ErrorClass("Your new and confirm password doesn't matched", 400)
    );
  }
  const user = await userModel.findById(req.user._id).select("+password");
  const isPassMatched = await user.comparePassword(oldPassword);
  if (!isPassMatched) {
    return next(new ErrorClass("Password doesn't matched", 400));
  }

  user.password = newPassword;
  await user.save();
  setCookie(user, 200, res, "Password updating successful");
});

// --Admin
// exports.getAllUsers = asyncError(async (_req,res)=>{
//   const
// })

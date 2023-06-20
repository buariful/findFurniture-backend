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
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorClass("User not found 1", 401));
  }

  const isPasswrodMatched = await user.comparePassword(password);
  if (!isPasswrodMatched) {
    return next(new ErrorClass("User not found 2", 401));
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

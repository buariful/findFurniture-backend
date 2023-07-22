const asyncError = require("./asyncError");
const ErrorClass = require("../utils/ErrorClass");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

exports.isAuthenticated = asyncError(async (req, res, next) => {
  const { auth } = req.cookies;

  if (!auth) {
    return next(new ErrorClass("Please login/register first", 401));
  }

  const token = auth.split(" ")[1];
  const getJwtData = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = await userModel
    .findById(getJwtData.id)
    .populate(
      "cartItem.product",
      "name productCode price sellPrice images stock"
    )
    .populate("wishList", "name productCode price sellPrice images stock");

  next();
});

exports.roleAuthorize = (roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorClass(`${req.user.role} is not allowed`, 403));
    }
    next();
  };
};

const generateToken = require("./generateToken");

exports.setCookie = async (user, statusCode, res, message) => {
  const options = {
    expires: new Date(Date.now() + 3600 * 24 * 1000 * 5),
    httpOnly: true,
  };
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  const token = `Bearer ${generateToken(user._id)}`;

  res.status(statusCode).cookie("auth", token, options).json({
    success: true,
    message: message,
    data: userWithoutPassword,
    token,
  });
};

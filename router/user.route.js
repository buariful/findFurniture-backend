const {
  registerUser,
  login,
  logOut,
  getUserByCookie,
  addProdToCart,
  deleteProdFromCart,
  updateQuantityOfCartProduct,
  addProdToWishlist,
  deletProdFromWishList,
} = require("../controllers/user.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");
const multer = require("../middleware/multer");

const router = require("express").Router();

router.route("/register").post(multer.single("image"), registerUser);
router.route("/login").post(login);
router.route("/logout").post(logOut);
router.route("/getuserby-cookie").get(isAuthenticated, getUserByCookie);
router
  .route("/cart/new")
  .put(isAuthenticated, roleAuthorize(["user"]), addProdToCart);
router
  .route("/cart/delete")
  .put(isAuthenticated, roleAuthorize(["user"]), deleteProdFromCart);
router
  .route("/cart/update")
  .put(isAuthenticated, roleAuthorize(["user"]), updateQuantityOfCartProduct);

router
  .route("/wishlist/new")
  .put(isAuthenticated, roleAuthorize(["user"]), addProdToWishlist);
router
  .route("/wishlist/delete")
  .put(isAuthenticated, roleAuthorize(["user"]), deletProdFromWishList);
module.exports = router;

const {
  registerUser,
  login,
  logOut,
  getUserByCookie,
} = require("../controllers/user.controller");
const { isAuthenticated } = require("../middleware/authentication");
const multer = require("../middleware/multer");

const router = require("express").Router();

router.route("/register").post(multer.single("image"), registerUser);
router.route("/login").post(login);
router.route("/logout").post(logOut);
router.route("/getuserby-cookie").get(isAuthenticated, getUserByCookie);
// router
//   .route("/abc")
//   .get(isAuthenticated, roleAuthorize(["admin", "sss", "de", "user"]));

module.exports = router;

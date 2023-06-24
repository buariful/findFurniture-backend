const {
  imgUpload,
  createProduct,
} = require("../controllers/product.controller");
const upload = require("../middleware/multer");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");

const router = require("express").Router();

router
  .route("/product/new")
  .post(
    isAuthenticated,
    roleAuthorize(["admin"]),
    upload.array("images", 10),
    createProduct
  );
router.route("/upload").post(upload.array("images", 10), imgUpload);

module.exports = router;

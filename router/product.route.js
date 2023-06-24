const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
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

router.route("/product").get(getProducts);
router
  .route("/product/:id")
  .get(getSingleProduct)
  .put(isAuthenticated, roleAuthorize(["admin"]), updateProduct)
  .delete(isAuthenticated, roleAuthorize(["admin"]), deleteProduct);

module.exports = router;

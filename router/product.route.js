const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  addProdImages,
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

router
  .route("/product")
  .get(getProducts)
  .delete(isAuthenticated, roleAuthorize(["admin"]), deleteAllProducts);
router
  .route("/product/:id")
  .get(getSingleProduct)
  .put(isAuthenticated, roleAuthorize(["admin"]), updateProduct)
  .delete(isAuthenticated, roleAuthorize(["admin"]), deleteProduct);

router
  .route("/product-image/:productId")
  .put(
    isAuthenticated,
    roleAuthorize(["admin"]),
    upload.array("images", 10),
    addProdImages
  );

module.exports = router;

const {
  createBrand,
  getAllBrands,
  deleteBrand,
} = require("../controllers/brand.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");
const router = require("express").Router();

router
  .route("/brand")
  .get(getAllBrands)
  .post(isAuthenticated, roleAuthorize(["admin"]), createBrand);

router
  .route("/brand/:id")
  .delete(isAuthenticated, roleAuthorize(["admin"]), deleteBrand);

module.exports = router;

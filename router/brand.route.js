const { createBrand } = require("../controllers/brand.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");
const router = require("express").Router();

router
  .route("/create-brand")
  .post(isAuthenticated, roleAuthorize(["admin"]), createBrand);

module.exports = router;

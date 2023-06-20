const { createCategory } = require("../controllers/category.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");

const router = require("express").Router();

router
  .route("/create-category")
  .post(isAuthenticated, roleAuthorize(["admin"]), createCategory);

module.exports = router;

const {
  createCategory,
  getAllCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");
const upload = require("../middleware/multer");

const router = require("express").Router();

router
  .route("/category")
  .post(
    isAuthenticated,
    roleAuthorize(["admin"]),
    upload.array("image", 1),
    createCategory
  )
  .get(getAllCategory);

router
  .route("/category/:id")
  .delete(isAuthenticated, roleAuthorize(["admin"]), deleteCategory);

module.exports = router;

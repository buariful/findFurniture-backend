const {
  createReview,
  updateReview,
  getSingleReview,
  deleteSingleReview,
  getUserAllReviews,
} = require("../controllers/review.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");

const router = require("express").Router();

router
  .route("/review/new")
  .post(isAuthenticated, roleAuthorize(["user"]), createReview);
router
  .route("/review/:id")
  .put(isAuthenticated, roleAuthorize(["user"]), updateReview)
  .get(isAuthenticated, roleAuthorize(["user"]), getSingleReview)
  .delete(isAuthenticated, roleAuthorize(["user"]), deleteSingleReview);

router
  .route("/review/myreviews")
  .get(isAuthenticated, roleAuthorize(["user"]), getUserAllReviews);

module.exports = router;

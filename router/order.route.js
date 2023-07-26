const {
  placeOrder,
  orderSuccess,
  getOneOrder,
  orderCancel,
  orderFail,
} = require("../controllers/order.controller");
const {
  isAuthenticated,
  roleAuthorize,
} = require("../middleware/authentication");

const router = require("express").Router();

router
  .route("/order/new")
  .post(isAuthenticated, roleAuthorize(["user"]), placeOrder);
router.route("/order/payment-success/:trans_id").post(orderSuccess);
router.route("/order/cancel/:trans_id").post(orderCancel);
router.route("/order/fail/:trans_id").post(orderFail);

router
  .route("/order/get-one/:trans_id")
  .get(isAuthenticated, roleAuthorize(["user"]), getOneOrder);

module.exports = router;

const asyncError = require("../middleware/asyncError");
const SSLCommerzPayment = require("sslcommerz-lts");
const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const ErrorClass = require("../utils/ErrorClass");
const userModel = require("../models/user.model");

exports.placeOrder = asyncError(async (req, res, next) => {
  const { products, shipping_time, shipping_cost, address, personalInfo } =
    req.body;
  // console.log(products, shipping_cost, shipping_time, address);
  const { STORE_ID, STORE_PASSWORD, BACKEND_URL } = process.env;
  const is_live = false; //true for live, false for sandbox
  const trans_id = new mongoose.Types.ObjectId().toString();

  let order_amount = 0;
  await Promise.all(
    products?.map(async (prod) => {
      const item = await productModel.findById(prod);
      order_amount += item?.sellPrice ? item?.sellPrice : item?.price;
    })
  );
  const data = {
    total_amount: order_amount,
    currency: "BDT",
    tran_id: trans_id, // use unique tran_id for each api call
    success_url: `${BACKEND_URL}/api/v1/order/payment-success/${trans_id}`,
    fail_url: `${BACKEND_URL}/api/v1/order/fail/${trans_id}`,
    cancel_url: `${BACKEND_URL}/api/v1/order/cancel/${trans_id}`,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: req.user.name,
    cus_email: personalInfo.email,
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: personalInfo.mblNumber,
    cus_fax: "01711111111",
    ship_name: personalInfo.name,
    ship_add1: address,
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  await orderModel.create({
    trans_id,
    customer: req.user._id,
    total_amount: order_amount,
    shipping_cost,
    shipping_time,
    shipping_address: address,
    products,
  });

  const sslcz = new SSLCommerzPayment(STORE_ID, STORE_PASSWORD, is_live);
  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });
  });
});

exports.orderSuccess = asyncError(async (req, res) => {
  const trans_id = req.params.trans_id;
  const order = await orderModel.findOne({ trans_id });
  const user = await userModel.findById(order?.customer);
  order.isPaid = true;
  user.cartItem = [];

  await order.save();
  await user.save();

  res.redirect(`${process.env.ORDER_SUCCESS_REDIRECT_URL}/${trans_id}`);
});

exports.getOneOrder = asyncError(async (req, res, next) => {
  const trans_id = req.params.trans_id;
  const order = await orderModel.findOne({ trans_id });
  if (!order) {
    return next(new ErrorClass("Order not found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Thanks for ordering",
    data: order,
  });
});

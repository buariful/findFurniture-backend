const asyncError = require("../middleware/asyncError");
const SSLCommerzPayment = require("sslcommerz-lts");
const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const ErrorClass = require("../utils/ErrorClass");
const userModel = require("../models/user.model");
const { orderDelete } = require("../utils/orderDelete");
const FilterClass = require("../utils/filterClass");

// products:[{item:"mongbd objectId",quanity}]
exports.placeOrder = asyncError(async (req, res, next) => {
  const { products, shipping_time, shipping_cost, address, personalInfo } =
    req.body;
  const { STORE_ID, STORE_PASSWORD, BACKEND_URL } = process.env;
  const is_live = false; //true for live, false for sandbox
  const trans_id = new mongoose.Types.ObjectId().toString();

  let order_amount = 0;
  await Promise.all(
    products?.map(async (prod) => {
      const item = await productModel.findById(prod.item);
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
    shipping_time: new Date(
      Date.now() + Number(shipping_time) * 24 * 1000 * 3600
    ),
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

  await Promise.all(
    order?.products?.map(async (prod) => {
      const product = await productModel.findById(prod.item);
      product.stock -= Number(prod.quantity);
      await product.save();
    })
  );

  await order.save();
  await user.save();

  res.redirect(`${process.env.ORDER_SUCCESS_REDIRECT_URL}/${trans_id}`);
});

exports.orderFail = asyncError(async (req, res) => {
  const trans_id = req.params.trans_id;
  orderDelete(trans_id);
  res.redirect(`${process.env.ORDER_FAIL_REDIRECT_URL}/${trans_id}`);
});

exports.orderCancel = asyncError(async (req, res) => {
  const trans_id = req.params.trans_id;
  orderDelete(trans_id);
  res.redirect(`${process.env.ORDER_CANCEL_REDIRECT_URL}`);
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

exports.getUserOrders = asyncError(async (req, res, next) => {
  const userId = req.user._id;
  const orders = await orderModel
    .find({
      customer: userId,
    })
    .populate("products.item", "name brand images category");
  if (orders.length < 1) {
    return next(new ErrorClass("You haven't place any order yet.", 400));
  }

  res.status(200).json({
    success: true,
    totalResult: orders.length,
    data: orders,
  });
});
exports.getAllOrders = asyncError(async (req, res, next) => {
  const order = new FilterClass(orderModel.find(), req.query)
    .orderSearch()
    .orderFilter();

  let result = await order.query
    .populate("products.item", "name")
    .populate("customer", "avatar name email");
  const result_count = result.length;

  order.pagination();
  result = await order.query;

  if (result.length <= 0) {
    return next(new ErrorClass("No result found", 400));
  }

  res.status(200).json({
    success: true,
    totalResult: result_count,
    data: result,
  });
});

exports.updateOrderStatus = asyncError(async (req, res, next) => {
  const { orders, status } = req.body;
  try {
    const result = await orderModel.updateMany(
      { _id: { $in: orders } },
      { $set: { isDelivered: status } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Orders updated successfully",
      data: result,
    });
  } catch (error) {
    return next(new ErrorClass("Orders cannot be updated", 400));
  }
});

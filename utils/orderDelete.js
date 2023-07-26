const orderModel = require("../models/order.model");

exports.orderDelete = async (trans_id) => {
  await orderModel.findOneAndDelete({ trans_id });
};

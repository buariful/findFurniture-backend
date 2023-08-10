const express = require("express");
const errorMiddleware = require("./middleware/errorMiddleware");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./router/user.route");
const brandRouter = require("./router/brand.route");
const categroyRouter = require("./router/category.route");
const locationRouter = require("./router/location.route");
const productRoute = require("./router/product.route");
const reviewRoute = require("./router/review.route");
const orderRoute = require("./router/order.route");
const cookieParser = require("cookie-parser");

const app = express();

app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "20mb", extended: true }));
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/v1", userRouter);
app.use("/api/v1", productRoute);
app.use("/api/v1", brandRouter);
app.use("/api/v1", categroyRouter);
app.use("/api/v1", locationRouter);
app.use("/api/v1", reviewRoute);
app.use("/api/v1", orderRoute);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is ok",
  });
});

app.use(errorMiddleware);
module.exports = app;

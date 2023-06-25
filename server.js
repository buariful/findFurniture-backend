const app = require("./app");
const connectDB = require("./utils/connectDB");
require("dotenv").config();

connectDB();
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`server is running well on port: ${port}`);
});

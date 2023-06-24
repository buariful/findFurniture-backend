const productModel = require("../models/product.model");

const generateProductCode = async () => {
  const characters = "A9BC1DEF@2GHIJKL8MNO!3PQ7RS4TU5VW6XYZ";

  let code = "";
  for (let i = 0; i < 5; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  const product = await productModel.findOne({ productCode: code });

  if (product) {
    return generateProductCode();
  }

  return code;
};

module.exports = generateProductCode;

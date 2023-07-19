const productModel = require("../models/product.model");

const getRandomProducts = async (categories) => {
  const randomProducts = [];

  for (const category of categories) {
    const categoryProducts = await productModel.find({ category });
    if (categoryProducts.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryProducts.length);
      randomProducts.push(categoryProducts[randomIndex]);
    }
  }

  return randomProducts;
};

module.exports = getRandomProducts;

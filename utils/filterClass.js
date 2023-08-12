class FilterClass {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
    this.conditions = [];
  }
  productSearch() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              name: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              productCode: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};
    this.conditions.push(keyword);

    return this;
  }

  productPriceFilter() {
    const { highPrice, lowPrice } = this.queryStr;
    if (highPrice && lowPrice) {
      const priceFilter = {
        $or: [
          {
            $and: [
              {
                price: { $lte: highPrice },
              },
              { price: { $gte: lowPrice } },
            ],
          },
          {
            $and: [
              {
                sellPrice: { $lte: highPrice },
              },
              { sellPrice: { $gte: lowPrice } },
            ],
          },
        ],
      };
      this.conditions.push(priceFilter);
    }

    return this;
  }

  async getResult() {
    if (this.conditions.length > 0) {
      this.query = this.query.find({ $and: this.conditions });
    }
    return await this.query;
  }

  productFilter() {
    const { categories, colors, brands, discount, stock } = this.queryStr;

    let filter = {};
    if (categories) {
      const categoryArray = categories.split(",");
      filter.category = {
        $in: categoryArray.map((category) => new RegExp(category, "i")),
      };
    }
    if (colors) {
      const colorArray = colors.split(",");
      filter.colors = {
        $in: colorArray.map((color) => new RegExp(color, "i")),
      };
    }
    if (brands) {
      const brandArray = brands.split(",");
      filter.brand = { $in: brandArray.map((brand) => new RegExp(brand, "i")) };
    }
    if (discount === "true") {
      filter.discount = { $gt: 0 };
    }
    if (discount === "false") {
      filter.discount = null;
    }
    if (stock === "false") {
      filter.stock = { $lte: 0 };
    }
    if (stock === "true") {
      filter.stock = { $gte: 1 };
    }
    this.query = this.query.find(filter);
    return this;
  }

  orderSearch() {
    const searchStr = this.queryStr.transId
      ? { trans_id: this.queryStr.transId }
      : {};
    this.query = this.query.find(searchStr);
    return this;
  }

  orderFilter() {
    const { delivered, expired, transId } = this.queryStr;
    let filter = {};
    if (delivered === "true" || delivered === "false") {
      filter.isDelivered = delivered;
    }
    if (expired === "true") {
      const currentDate = new Date();
      const queryObj = {
        shipping_time: { $lt: currentDate },
        isDelivered: false,
      };
      filter = queryObj;
    }
    this.query = this.query.find(filter);
    return this;
  }

  pagination() {
    const limit = Number(this.queryStr.limit) || 10;
    const page = Number(this.queryStr.page) || 1;
    const skip = (page - 1) * limit;

    // Create a copy of the query object using clone()
    const clonedQuery = this.query.clone();

    this.query = clonedQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = FilterClass;

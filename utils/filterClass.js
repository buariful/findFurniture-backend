class FilterClass {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
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

    this.query = this.query.find({ ...keyword });

    return this;
  }

  productFilter() {
    const { highPrice, lowPrice, categories, colors, brands, discount, stock } =
      this.queryStr;

    let filter = {};
    if (highPrice && lowPrice) {
      filter.$or = [
        {
          $and: [
            {
              price: { $lte: Number(highPrice) },
            },
            { price: { $gte: Number(lowPrice) } },
          ],
        },
        {
          $and: [
            {
              sellPrice: { $lte: Number(highPrice) },
            },
            { sellPrice: { $gte: Number(lowPrice) } },
          ],
        },
      ];
    }
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
    const { delivered } = this.queryStr;
    let filter;
    if (delivered === "true" || delivered === "false") {
      filter = { isDelivered: delivered };
    } else {
      filter = {};
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

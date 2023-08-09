class ProductFilter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
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

  filter() {
    const { categories, colors, brands, discount } = this.queryStr;

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

    this.query = this.query.find(filter);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skipResults = resultPerPage * (currentPage - 1);

    // Create a copy of the query object using clone()
    const clonedQuery = this.query.clone();

    this.query = clonedQuery.limit(resultPerPage).skip(skipResults);

    return this;
  }
}

module.exports = ProductFilter;

class OrderFilter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const { delivered } = this.queryStr;

    let filter;
    if (delivered === undefined) {
      filter = {};
    } else {
      filter = { isDelivered: delivered };
    }
    this.query = this.query.find(filter);
    return this;
  }

  pagination() {
    const page = Number(this.queryStr.page) || 1;
    const limit = Number(this.queryStr.limit) || 2;
    const skip = (page - 1) * limit; // limit * page - limit
    const clonedQuery = this.query.clone();

    this.query = clonedQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = OrderFilter;

class QueryFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['sort', 'fields', 'limit', 'page'];

    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(',').join(' ')
      : 'dateCreated';

    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }
    return this;
  }

  limitResults() {
    if (this.queryString.limit) {
      this.query = this.query.limit(Number(this.queryString.limit));
    }
    return this;
  }
}

module.exports = QueryFeatures;

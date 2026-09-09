class QueryFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }


  //filtering
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['sort', 'fields', 'limit', 'page'];

    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }


  //sorting
  sort() {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(',').join(' ')
      : '-dateCreated';
    this.query = this.query.sort(sortBy);
    return this;
  }

  //limiting fields
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }


  limitResults() {
    if (this.queryString.limit) {
      this.query = this.query.limit(Number(this.queryString.limit));
    }
    return this;
  }

  //pagination
  async paginate() {
    // 1. Set default values if the user doesn't provide them in the URL
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10; // Default to 10 items per page

    // 2. Calculate how many documents to skip
    // Example: Page 3 with a limit of 10 -> (3 - 1) * 10 = skip 20 documents
    const skip = (page - 1) * limit;

    // 3. Apply skip and limit to the database query
    this.query = this.query.skip(skip).limit(limit);


    if (this.queryString.page) {
      // Use .clone() so countDocuments() doesn't consume or lock the main query
      const totalDocuments = await this.query.model
        .find(this.query.getFilter())
        .clone()
        .countDocuments();

      if (skip >= totalDocuments) {
        throw new Error('PageOutOfBounds');
      }
    }


    return this;
  }
}

module.exports = QueryFeatures;

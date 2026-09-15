const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');

exports.getProducts = async (req, res, next) => {
  try {
    const features = new ApiFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .limitResults()
      .paginate();

    const products = await features.query;

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-averageRating,price';
  req.query.fields = 'name,price,category,description,averageRating';
  next();
};


exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    res.status(200).json({ status: 'success', data: product });
  } catch (error) { next(error); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ status: 'success', data: product });
  } catch (error) { next(error); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    res.status(200).json({ status: 'success', data: product });
  } catch (error) { next(error); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) { next(error); }
};

exports.getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $match: {
          averageRating: {
            $gte: 4.5,
          },
        },
      },

      {
        $group: {
          _id: "$category",

          numProducts: {
            $sum: 1,
          },

          numRatings: {
            $sum: "$numberOfRatings",
          },

          avgRating: {
            $avg: "$averageRating",
          },

          avgPrice: {
            $avg: "$price",
          },

          minPrice: {
            $min: "$price",
          },

          maxPrice: {
            $max: "$price",
          },
        },
      },

      {
        $sort: {
          avgPrice: 1,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

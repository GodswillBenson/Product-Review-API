const Product = require('../models/productModel');
const QueryFeatures = require('../utils/queryFeatures');

exports.getProducts = async (req, res, next) => {
  try {
    const features = new QueryFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .limitResults();
    const products = await features.query;
    res.status(200).json({ status: 'success', data: products });
  } catch (error) { next(error); }
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

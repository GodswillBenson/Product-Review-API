const User = require('../models/userModel');
const QueryFeatures = require('../utils/queryFeatures');

exports.getUsers = async (req, res, next) => {
  try {
    const features = new QueryFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .limitResults();
    const users = await features.query;
    res.status(200).json({ status: 'success', data: users });
  } catch (error) { next(error); }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    res.status(200).json({ status: 'success', data: user });
  } catch (error) { next(error); }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ status: 'success', data: user });
  } catch (error) { next(error); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    res.status(200).json({ status: 'success', data: user });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
    res.status(204).json({ status: 'success', data: null });
  } catch (error) { next(error); }
};

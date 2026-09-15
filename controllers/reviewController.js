const Review = require("../models/reviewModel");
const ApiFeatures = require("../utils/apiFeatures");

exports.getReviews = async (req, res, next) => {
  try {
    const features = new ApiFeatures(Review.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .limitResults()
      .paginate();
    const reviews = await features.query.populate("userId productId");
    res
      .status(200)
      .json({ status: "success", results: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.aliasRecentReviews = (req, res, next) => {
  req.query.limit = "10";
  req.query.sort = "-dateCreated";
  req.query.fields = "title,comment,rating,dateCreated";
  next();
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate(
      "userId productId",
    );
    if (!review)
      return res
        .status(404)
        .json({ status: "error", message: "Review not found" });
    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    next(error);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    let review = await Review.create(req.body);
    review = await Review.populate(review, { path: "userId productId" });
    res.status(201).json({ status: "success", data: review });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("userId productId");
    if (!review)
      return res
        .status(404)
        .json({ status: "error", message: "Review not found" });
    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review)
      return res
        .status(404)
        .json({ status: "error", message: "Review not found" });
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};

//Review Stats
exports.getReviewStats = async (req, res, next) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: { rating: { $gte: 1 } },
      },
      {
        $group: {
          _id: "$productId",
          numReviews: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
      {
        $sort: { avgRating: -1 },
      },
    ]);
    res.status(200).json({ status: "success", data: stats });
  } catch (error) {
    next(error);
  }
};

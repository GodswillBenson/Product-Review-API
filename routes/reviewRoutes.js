const express = require('express');
const { getReviews, aliasRecentReviews, getReviewStats, getReview, createReview, updateReview, deleteReview } = require('../controllers/reviewController');

const router = express.Router();

// router.route("/top-5").get(aliasTopReviews, getReviews);
router.route("/review-stats").get(getReviewStats);
router.route("/recent-10").get(aliasRecentReviews, getReviews);
router.route('/').get(getReviews).post(createReview);
router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;

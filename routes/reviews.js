const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const reviewsController = ('../controllers/reviews');
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor
} = require("../utilities/middleware");


// Review Create
router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewsController.create)
);

// Review Delete
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsController.delete)
);

module.exports = router;

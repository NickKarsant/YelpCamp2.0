const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const reviewsController = "../controllers/reviews";
const Campground = require("../models/campground");
const Review = require("../models/review");

const {
  isLoggedIn,
  validateReview,
  isReviewAuthor
} = require("../utilities/middleware");

// Review Create
router.post("/", isLoggedIn, validateReview, async (req, res, next) => {
  try {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  } catch (err) {
    next(err);
  }
});

// Review Delete
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
  try {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/yelpcamp/campgrounds/${id}`);
  } catch(err) {
    next(err);
  }
});

module.exports = router;

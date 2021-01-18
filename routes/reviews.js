const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewsSchema } = require("../validationSchemas");

const validateReview = (req, res, next) => {
  const { error } = reviewsSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Review Create
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    console.log(req.params);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', "Created new review");
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  })
);

// Review Delete
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Review successfully deleted");
    res.redirect(`/yelpcamp/campgrounds/${id}`);
  })
);

module.exports = router;

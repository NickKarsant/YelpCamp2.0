const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const reviewsController = "../controllers/reviews";
const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require('../utilities/ExpressError');


const {
  isLoggedIn,
  validateReview,
  isReviewAuthor
} = require("../utilities/middleware");

// Review Create

// This does NOT work
// router.post("/", isLoggedIn, validateReview, catchAsync(reviewsController.create));



// THIS WORKS
router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  })
);




// Review Delete
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/yelpcamp/campgrounds/${id}`);
})
);

module.exports = router;

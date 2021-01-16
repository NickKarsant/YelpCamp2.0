const express = require("express");
const router= express.Router();
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");
const Review = require("../models/review");
const { reviewsSchema } = require('../validationSchemas');


const validateReview = (req, res,next) => {
  const { error } = reviewsSchema.validate(req.body);
  if (error) {
    console.log(error)
    const msg = error.details.map(el => el.message). join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}



// Review Create
router.post("/reviews", validateReview, catchAsync(async(req,res) =>{
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
}));

// Review Delete
router.delete('/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/yelpcamp/campgrounds/${id}`);
}));



module.exports = router;
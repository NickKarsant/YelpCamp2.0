const Campground = require("../models/campground");
const ExpressError = require("../utilities/ExpressError");
const { campgroundSchema } = require("../validationSchemas");
const Review = require("../models/review");
const { reviewsSchema } = require("../validationSchemas");

// validation middleware
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// isloggedin? middleware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to do that.");
    return res.redirect("/yelpcamp/auth/login");
  }
  next();
};

// isUserThe Campground Author? middleware
module.exports.isCampAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user.id)) {
    req.flash("error", "You don't have permission to do that.");
    return res.redirect(`/yelpcamp/campgrounds/${id}`);
  }
  next();
};

// isUserThe Review Author? middleware
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user.id)) {
    req.flash("error", "You don't have permission to do that.");
    return res.redirect(`/yelpcamp/campgrounds/${id}`);
  }
  next();
};

// validate reviews
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewsSchema.validate(req.body);
  if (error) {
    console.log(error);
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

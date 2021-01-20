const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");
const {
  isLoggedIn,
  isCampAuthor,
  validateCampground
} = require("../utilities/middleware");

const campController = require("../controllers/campgrounds");

// show all campgrounds on homepage
router.get("/", catchAsync(campController.index));

// add campground form page
router.get("/new", isLoggedIn, campController.renderAddForm);

// ADD  campground to database route
router.post("/", isLoggedIn, validateCampground, catchAsync(campController.add));

// SHOW single campground page
router.get("/:id", catchAsync(campController.showCamp));

// show edit page
router.get(
  "/:id/edit",
  isLoggedIn,
  isCampAuthor,
  catchAsync(campController.showEdit)
);

// UPDATE database with edits
router.put(
  "/:id",
  isLoggedIn,
  isCampAuthor,
  validateCampground,
  catchAsync(campController.update)
);

// DELETE
router.delete("/:id", isCampAuthor, catchAsync(campController.delete));

module.exports = router;

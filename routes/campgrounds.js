const express = require("express");
const router = express.Router();
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const {
  isLoggedIn,
  isCampAuthor,
  validateCampground
} = require("../utilities/middleware");

// show all campgrounds on homepage
router.get(
  "/",
  catchAsync(async (req, res) => {
    const allCamps = await Campground.find({});
    res.render("campgrounds/index", { allCamps });
  })
);

// add campground form page
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

// ADD  campground to database route
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "New campground saved");
    req.flash("error", "Campgound was not saved");
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  })
);

// SHOW single campground page
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/yelpcamp/campgrounds");
    }

    res.render("campgrounds/show", { campground });
  })
);

// show edit page
router.get(
  "/:id/edit",
  isLoggedIn,
  isCampAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/yelpcamp/campgrounds");
    }

    await Campground.findById(id);
    if (!campground.author.equals(req.user.id)) {
      req.flash("error", "You don't have permission to do that.");
      return res.redirect(`/yelpcamp/campgrounds/${id}`);
    }

    res.render("campgrounds/edit", { campground });
  })
);

// UPDATE database with edits
router.put(
  "/:id",
  isLoggedIn,
  isCampAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground
    });

    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/yelpcamp/campgrounds");
    }
    req.flash("success", "Campground updated successfully");
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  })
);

// DELETE
router.delete(
  "/:id",
  isCampAuthor,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground successfully deleted");
    res.redirect("/yelpcamp/campgrounds");
  })
);

module.exports = router;

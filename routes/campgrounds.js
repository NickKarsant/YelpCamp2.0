const express = require("express");
const router= express.Router();
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const { campgroundSchema } = require('../validationSchemas');


// validation middleware
const validateCampground = (req, res,next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message). join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}


// show all campgrounds on homepage
router.get(
  "/",
  catchAsync(async (req, res) => {
    const allCamps = await Campground.find({});
    res.render("campgrounds/index", { allCamps });
  })
);

// add campground form page
router.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// ADD  campground to database route
router.post("/", validateCampground, catchAsync(async (req, res) => {
    // console.log(`Date: ${req.requestTime}`);


    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  })
);

// SHOW single campground page
router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render("campgrounds/show", { campground });
  })
);

// show edit page
router.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// UPDATE database with edits
router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground
    });
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  })
);

// DELETE
router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/yelpcamp/campgrounds");
  })
);

module.exports = router;
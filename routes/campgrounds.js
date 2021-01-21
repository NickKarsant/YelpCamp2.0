const express = require("express");
const catchAsync = require("../utilities/catchAsync");

const router = express.Router();
const {
  isLoggedIn,
  isCampAuthor,
  validateCampground
} = require("../utilities/middleware");

const multer = require('multer');
// const { storage } = require('../cloudinary');
const upload = multer({ dest: 'uploads/' });

const campController = require("../controllers/campgrounds");

// show all campgrounds on homepage
router.get("/", catchAsync(campController.index));

// add campground form page
router.get("/new", isLoggedIn, campController.renderAddForm);

// ADD  campground to database route
// router.post("/", isLoggedIn, validateCampground, catchAsync(campController.add));
router.post("/", upload.array("image"), (req, res) => {
  console.log(req.body)
  console.log(req.file)
  console.log(req.files)
  res.send(req.image)
});

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

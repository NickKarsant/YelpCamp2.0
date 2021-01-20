const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const allCamps = await Campground.find({});
  res.render("campgrounds/index", { allCamps });
}

module.exports.renderAddForm = (req, res) => {
  res.render("campgrounds/new");
}


module.exports.add = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "New campground saved");
  req.flash("error", "Campgound was not saved");
  res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
}


module.exports.showCamp = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/yelpcamp/campgrounds");
  }

  res.render("campgrounds/show", { campground });
}


module.exports.showEdit = async (req, res) => {
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
}


module.exports.update = async (req, res) => {
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
}


module.exports.delete = async (req, res) => {
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Campground successfully deleted");
  res.redirect("/yelpcamp/campgrounds");
}


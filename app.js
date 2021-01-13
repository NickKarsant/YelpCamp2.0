const express = require("express");
const app = express();
const Joi = require("joi");
const path = require("path");

const User = require("./models/user");
const flash = require("connect-flash");
const { campgroundSchema } = require('./validationSchema');
const ejsMate = require("ejs-mate");
const Comment = require("./models/comment");
const mongoose = require("mongoose");

const Campground = require("./models/campground");
const bodyParser = require("body-parser");
const catchAsync = require("./utilities/catchAsync");

const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/yelpcamp", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("YelpCamp database connected");
  })
  .catch(err => {
    console.log("OH NO ERROR!");
    console.log(err);
  });

// App Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// App Tools
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


const validateCampground = (req, res,next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message). join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}




// Widget app goes here
app.get("/", (req, res) => {
  res.send("React app goes here");
});

// landing page
app.get("/yelpcamp", (req, res) => {
  res.render("landing");
});

// show all campgrounds on homepage
app.get(
  "/yelpcamp/campgrounds",
  catchAsync(async (req, res) => {
    const allCamps = await Campground.find({});
    res.render("campgrounds/index", { allCamps });
  })
);

// add campground form page
app.get("/yelpcamp/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

// ADD  campground to database route
app.post("/yelpcamp/campgrounds", validateCampground, catchAsync(async (req, res) => {
    // console.log(`Date: ${req.requestTime}`);


    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  })
);

// SHOW single campground page
app.get(
  "/yelpcamp/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

// show edit page
app.get("/yelpcamp/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

// UPDATE database with edits
app.put("/yelpcamp/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground
    });
    res.redirect(`/yelpcamp/campgrounds/${campground._id}`);
  })
);

// DELETE
app.delete("/yelpcamp/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/yelpcamp/campgrounds");
  })
);

// AUTH
// display pages
app.get("/yelpcamp/login", (req, res) => {
  res.render("login");
});

app.get("/yelpcamp/register", (req, res) => {
  res.render("register");
});

// post routes
app.post(
  "/yelpcamp/login",
  catchAsync(async (req, res) => {
    res.render("login");
  })
);

app.post(
  "/yelpcamp/register",
  catchAsync(async (req, res) => {
    res.render("register");
  })
);

// 404
app.all("*", (req, res, next) => {
  next(new ExpressError("You got lost in the wilderness", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (!err.message) err.message = "Oh no, It appears you have gotten lost. ";
  if (statusCode === 404) {
    res.status(statusCode).render("404");
  } else {
    res.status(statusCode).render("error", { err });
  }
});

app.listen(3000, () => {
  console.log("on port 3000");
});

const express = require("express");
const app = express();
require('dotenv').config()

const Joi = require("joi");
const path = require("path");
const User = require("./models/user");
const flash = require("connect-flash");

const ejsMate = require("ejs-mate");
const session = require("express-session");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const passport = require("passport")
const LocalStrategy = require("passport-local");
const catchAsync = require("./utilities/catchAsync");


const cookieParser = require("cookie-parser");
const ExpressError = require("./utilities/ExpressError");
const methodOverride = require("method-override");

// routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');


// database connection
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
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));




const sessionConfig = {
  secret: "a not-so-secret secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60,
    maxAge: 1000 * 60 * 60
  }
}
app.use(session(sessionConfig));

app.use(flash());

app.use((req,res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(passport.initialize());
// has to come AFTER "app.use(session(sessionconfig)"
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// route files
app.use("/yelpcamp/campgrounds", campgrounds)
app.use("/yelpcamp/campgrounds/:id/reviews", reviews)
app.use("/yelpcamp/auth", auth)



// Widget app goes here
app.get("/", (req, res) => {
  res.send("React app goes here");
});

// landing page
app.get("/yelpcamp", (req, res) => {
  res.render("landing");
});




// 404
// app.all("*", (req, res, next) => {
//   next(new ExpressError("You got lost in the wilderness", 404));
// });

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

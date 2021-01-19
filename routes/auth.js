const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const User = require("../models/user");
const passport = require("passport");

// router.use(passport.initialize());

// display form pages
router.get("/login", (req, res) => {
  res.render("./users/login");
});

router.get("/register", async (req, res) => {
  res.render("./users/register");
});

// POST routes
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/yelpcampÎ/auth/login"
  }),
  (req, res) => {
    req.flash("success", "Welcome to YelpCamp");
    const redirectURL = req.session.returnTo || '/yelpcamp/campgrounds';
    res.redirect(redirectURL);
  }
);

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);

      req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash("success", "Welcome to YelpCamp!");
        return res.redirect("/yelpcamp/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/yelpcamp/auth/register");
    }
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out.");
  res.redirect("/yelpcamp/campgrounds");
});

module.exports = router;

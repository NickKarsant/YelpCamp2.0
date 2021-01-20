const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const usersController = require("../controllers/users");

router.use(passport.initialize());

// display form pages
router.get("/login", usersController.renderLogin);

router.get("/register", usersController.renderRegister);

// POST routes
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/yelpcampÎ/auth/login"
  }),
  usersController.login
);

router.post(
  "/register",
  catchAsync(usersController.register)
);

router.get("/logout", usersController.logout);

module.exports = router;

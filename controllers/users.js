const User = require("../models/user");

module.exports.renderLogin = (req, res) => {
  res.render("./users/login");
};

module.exports.renderRegister = async (req, res) => {
  res.render("./users/register");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome to YelpCamp");
  const redirectURL = req.session.returnTo || "/yelpcamp/campgrounds";
  res.redirect(redirectURL);
};

module.exports.register = async (req, res) => {
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
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out.");
  res.redirect("/yelpcamp/campgrounds");
};

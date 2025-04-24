const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.createUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({
      email,
      username,
    });

    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (er) => {
      if (er) {
        return next(er);
      }
      req.flash("success", "welcome to StayNest!");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "welcome back to StayNest!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You logged out successfully!");
    res.redirect("/listings");
  });
};

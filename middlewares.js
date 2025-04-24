let Listing = require("./models/listing");
let Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

// Server side schema validation (listings)
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(" ");
    return next(new ExpressError(400, errMsg));
  } else {
    next();
  }
};

// Server side schema validation (Reviews)
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(" ");
    return next(new ExpressError(400, errMsg));
  } else {
    next();
  }
};

// checks whether the user is logged in or not
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to add your Property.");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const checkOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not authorized to edit this listing.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

const checkReviewOwner = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to delete this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports = {
  isLoggedIn,
  saveRedirectUrl,
  checkOwner,
  validateListing,
  validateReview,
  checkReviewOwner,
};

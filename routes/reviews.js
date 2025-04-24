const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  validateReview,
  isLoggedIn,
  checkReviewOwner,
} = require("../middlewares.js");

const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  checkReviewOwner,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;

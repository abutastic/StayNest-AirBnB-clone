const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const {
  isLoggedIn,
  checkOwner,
  validateListing,
} = require("../middlewares.js");

const listingController = require("../controllers/listings.js");

// The router.route("path") --> method ensures no same path is written multiple times,
// when same path is used with different http verbs
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// get new listing (the /new should be before /:d, otherwise it will interprete /new as some id)
router.get("/new", isLoggedIn, listingController.newListingForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    checkOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  );

// index route
// router.get("/", wrapAsync(listingController.index));

// create listing route
// router.post(
//   "/",
//   validateListing,
//   isLoggedIn,
//   wrapAsync(listingController.createListing)
// );

// show individual listing
// router.get("/:id", wrapAsync(listingController.showListing));

// edit form render
router.get(
  "/:id/edit",
  isLoggedIn,
  checkOwner,
  wrapAsync(listingController.editForm)
);

// update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   checkOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

// Delete route
router.delete(
  "/:id/delete",
  isLoggedIn,
  checkOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;

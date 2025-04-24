const Listing = require("../models/listing");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const fetch = require("node-fetch");

// module.exports.index = async (req, res) => {
//   const { category } = req.query;

//   let listings;
//   if (category) {
//     listings = await Listing.find({ category: category });
//   } else {
//     listings = await Listing.find();
//   }

//   res.render("listings/index.ejs", { allListings: listings });
// };

module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  // 🔍 Multi-field search logic
  if (search) {
    const regex = new RegExp(escapeRegex(search), "i"); // case-insensitive

    filter.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
      { country: regex },
      { category: regex },
      { price: isNaN(search) ? undefined : Number(search) }, // handle number input for price
    ].filter(Boolean); // removes `undefined` if price isn't a number
  }

  // 🏷️ Category filter (in combination with search)
  if (category) {
    filter.category = category;
  }

  const listings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings: listings });
};

// 🚨 Escaping regex special characters
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

// module.exports.createListing = async (req, res, next) => {
//   let url = req.file.path;
//   let filename = req.file.filename;
//   const newListing = new Listing(req.body.listing);
//   newListing.image = { url, filename };
//   // console.log(req.user);
//   newListing.owner = req.user._id;
//   await newListing.save();
//   req.flash("success", "New listing created successfully!");
//   res.redirect("/listings");
// };

module.exports.createListing = async (req, res, next) => {
  try {
    const { location } = req.body.listing;

    // 🌐 Call Nominatim API to get coordinates
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}`
    );
    const geoData = await geoResponse.json();

    if (!geoData.length) {
      throw new ExpressError("Location not found", 400);
    }

    const latitude = parseFloat(geoData[0].lat);
    const longitude = parseFloat(geoData[0].lon);
    const country = geoData[0].display_name.split(",").pop().trim();

    // 🌄 Handle image
    let url = req.file?.path || "";
    let filename = req.file?.filename || "";

    // 🏠 Create the listing object
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    newListing.owner = req.user._id;
    newListing.geometry = {
      type: "Point",
      coordinates: [longitude, latitude], // Important: [lng, lat]
    };
    newListing.country = country;

    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return next(new ExpressError(400, "Invalid listing ID"));
  }
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The listing you requested for does not exist.");
    res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.editForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The listing you want to edit does not exist");
    res.redirect("/listings");
  }
  let originalImgUrl = listing.image.url;
  let modifiedUrl = originalImgUrl.replace("/upload", "/upload/,h_250,w_250");
  res.render("listings/edit.ejs", { listing, modifiedUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "listing edited successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};

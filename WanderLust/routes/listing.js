const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New Route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});
//show route
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
});

//create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Successfully made a new listing!");
    res.redirect("/listings");
  }),
);

//Edit Route
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  req.flash("success", "Successfully edited the listing!");
  if (!listing) {
    req.flash("error", "Cannot find that listing!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
});

//Update Route
router.put("/:id", validateListing, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
  });
  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listings/${listing._id}`);
});

//delete route
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing!");
  res.redirect("/listings");
});

module.exports = router;
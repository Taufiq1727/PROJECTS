const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");

const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing");
const Review = require("../models/review");


const validateReview = (req, res, next) => {
  if (!req.body.review && req.body.rating && req.body.comment) {
    req.body.review = {
      rating: req.body.rating,
      comment: req.body.comment,
    };
    delete req.body.rating;
    delete req.body.comment;
  }

  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};


//reviews
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    const newReview = new Review(req.body.review);

    await newReview.save();

    listing.reviews.push(newReview._id);

    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  }),
);

//delete review route
router.delete(
  "/reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);    


module.exports = router;
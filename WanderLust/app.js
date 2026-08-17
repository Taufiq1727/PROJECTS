const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3014;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review");
const { reviewSchema } = require("./schema.js");

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hi root");
});

const validateListing = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//new Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//show route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", { listing });
});

//create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);
  }),
);

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", validateListing, async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
  });
  res.redirect(`/listings/${listing._id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

//reviews
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    const newReview = new Review(req.body);

    await newReview.save();

    listing.reviews.push(newReview._id);

    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  }),
);

//delete review route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
  }),
);    

// app.get("/testListing", async (req, res) => {
//   try {
//     const sampleListing = new Listing({
//       title: "Sample Listing",
//       description: "This is a sample listing for testing purposes.",
//       image: {
//         filename: "listingimage",
//         url: "",
//       },
//       price: 100,
//       location: "Bangalore",
//       country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample listing saved to the database.");
//     res.send("Sample listing created and saved to the database.");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("Something went wrong while creating the listing.");
//   }
// });a

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  res.render("error.ejs", { statusCode, message });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

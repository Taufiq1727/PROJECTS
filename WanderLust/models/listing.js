const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    set : (v) => v === "" ? "https://unsplash.com/photos/man-cliff-diving-into-clear-blue-ocean-water-1h86IGwVWrs" : v,
  },
  price: Number,
  location: String,
  country: String,
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;

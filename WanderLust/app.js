const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3014;
const Listing = require("./models/listing");


main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("Hi root");
});

app.get("/testListing", async (req, res) => {
  try {
    const sampleListing = new Listing({
      title: "Sample Listing",
      description: "This is a sample listing for testing purposes.",
      image: {
        filename: "listingimage",
        url: "",
      },
      price: 100,
      location: "Bangalore",
      country: "India",
    });

    await sampleListing.save();
    console.log("Sample listing saved to the database.");
    res.send("Sample listing created and saved to the database.");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong while creating the listing.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

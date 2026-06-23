const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3014;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
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
app.use(methodOverride("_method"));
app.get("/", (req, res) => {
  res.send("Hi root");
});

app.get("/listings", async (req, res) => {
   const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})
    
  });


  
//new Route
app.get("/listings/new", (req, res) => {
res.render("listings/new.ejs");
});
//show route 
app.get("/listings/:id", async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
   res.render("listings/show.ejs",{listing})
});

//create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  console.log(listing);
});

//Edit Route 
app.get("/listings/:id/edit", async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing})
});

//Update Route
app.put("/listings/:id", async (req, res) => {
  const {id} = req.params;
  const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {new:true});
  res.redirect(`/listings/${listing._id}`);
});

//delete route
app.delete("/listing/:id", async (req, res) => {
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});



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
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3014;
const listing = require("./models/listing");


main()
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

app.get("/", (req, res) => {
res.send("Hi root");
});
app.get("/TestListing", async (req,res)=>{
    let sampleListing = new listing({
        title: "Sample Listing",
        description: "This is a sample listing for testing purposes.",
        image: "",
        price: 100,
        location: "Bangalore",
        country: "India"

    
});
await sampleListing.save();
console.log("Sample listing saved to the database.");
res.send("Sample listing created and saved to the database.");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

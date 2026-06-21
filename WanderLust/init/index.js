const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Database initialized with sample data.");
};

main()
  .then(async () => {
    console.log("Connected to MongoDB");
    await initDB();
  })
  .catch((err) => {
    console.log(err);
  });

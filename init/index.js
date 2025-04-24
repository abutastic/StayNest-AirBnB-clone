const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/staynest";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((er) => {
    console.log(er);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const insertData = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6802002653a7c753799c2e58",
  }));
  await Listing.insertMany(initData.data);

  console.log("Data was fed into DB :)");
};

insertData();

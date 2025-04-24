// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//     image: "",
//   });

//   await sampleListing.save();
//   console.log("sample data was saved!");
//   res.send("The data was saved");
// });

let obj = {
  name: "bilal",
  id: 123,
};

console.log({ ...obj });

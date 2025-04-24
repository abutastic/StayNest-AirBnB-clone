var map = L.map("map").setView(
  [listing.geometry.coordinates[1], listing.geometry.coordinates[0]],
  13
); // Change to your location

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

L.marker([listing.geometry.coordinates[1], listing.geometry.coordinates[0]])
  .addTo(map)
  .bindPopup(listing.location)
  .openPopup();

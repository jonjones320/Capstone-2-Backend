// Amadeus API SDK initialization

require("dotenv").config();
const Amadeus = require("amadeus");

console.log("AMADEUS_CLIENT_ID:", process.env.AMADEUS_CLIENT_ID);
console.log("AMADEUS_CLIENT_SECRET:", process.env.AMADEUS_CLIENT_SECRET);


const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  logLevel: "debug",
  hostname: process.env.NODE_ENV === "production" ? "production" : undefined,
});

console.log(amadeus.client);

module.exports = amadeus;

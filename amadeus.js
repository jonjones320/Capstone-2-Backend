const Amadeus = require("amadeus");
require("dotenv").config();

// Simple client initialization with basic error handling
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  hostname: process.env.NODE_ENV === "test"
});

module.exports = amadeus;
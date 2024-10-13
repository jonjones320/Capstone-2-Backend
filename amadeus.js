// Amadeus API SDK initialization

require("dotenv").config();
const Amadeus = require("amadeus");

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  hostname: 'test' // Current Amadeus ID and SECRET are for test environment only.
});


module.exports = amadeus;

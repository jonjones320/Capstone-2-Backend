// Amadeus API SDK initialization

const Amadeus = require("amadeus");
require("dotenv").config();


const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  logLevel: 'debug',
  hostname: process.env.NODE_ENV === "production" ? "production" : undefined,
});

module.exports = amadeus;

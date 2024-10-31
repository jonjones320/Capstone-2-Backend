require("dotenv").config();
const Amadeus = require("amadeus");

// Verify required environment variables.
if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error('Missing required Amadeus API credentials in environment variables');
}

/** Initialize the Amadeus client.
 *  
 *  This is the ambassador between Ranner and Amadeus SDK.
 */
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  hostname: 'test'  // current Amadeus token is for test use only.
});

// Log available API interfaces for reference.
console.log('Amadeus SDK initialized with interfaces:', {
  referenceData: Object.keys(amadeus.referenceData || {}),
  shopping: Object.keys(amadeus.shopping || {}),
  booking: Object.keys(amadeus.booking || {}),
  travel: Object.keys(amadeus.travel || {})
});

module.exports = amadeus;
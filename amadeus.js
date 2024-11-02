require("dotenv").config();
const Amadeus = require("amadeus");

class AmadeusClient {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  initializeClient() {
    if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
      throw new Error('Missing Amadeus API credentials in environment variables');
    }

    try {
      this.client = new Amadeus({
        clientId: process.env.AMADEUS_CLIENT_ID,
        clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        hostname: process.env.NODE_ENV === 'production' ? 'production' : 'test',
        logLevel: 'debug'  // Enable detailed logging
      });

      console.log('[Amadeus] Client initialized successfully');

    } catch (error) {
      console.error("Failed to initialize Amadeus client:", error);
      throw error;
    }
  }

  // Helper method to format error messages
  formatErrorMessage(error) {
    const amadeusError = error.response?.data?.errors?.[0];
    if (!amadeusError) {
      return "An unknown error occurred";
    }

    switch (amadeusError.code) {
      case 141:
        return "The flight search service is temporarily unavailable. Please try again in a few minutes.";
      case 4926:
        return "No flights available for these dates and locations.";
      case 572:
        return "Please check your travel dates and try again.";
      case 575:
        return "Please check your airport codes and try again.";
      default:
        return amadeusError.detail || amadeusError.title || "An error occurred while searching for flights";
    }
  }
}

// Create and export a singleton instance
const amadeus = new AmadeusClient();
module.exports = amadeus;
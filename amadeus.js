const Amadeus = require("amadeus");
require("dotenv").config();

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
        hostname: 'test',
        logLevel: 'debug'  // Enable detailed logging.
      });

      console.log('[Amadeus] Client initialized successfully');

    } catch (error) {
      console.error("Failed to initialize Amadeus client:", error);
      throw error;
    }
  }

  // Wrapper for flight search with retries.
  async searchFlights(params) {
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Amadeus] Searching flights (attempt ${attempt}/${maxRetries})`, params);
        
        // Ensure the client is initialized.
        if (!this.client) {
          this.initializeClient();
        }
        
        const response = await this.client.shopping.flightOffersSearch.get(params);
        console.log(`[Amadeus] Flight search successful on attempt ${attempt}`);
        
        return response;
      } catch (error) {
        lastError = error;
        console.error(`[Amadeus] Flight search attempt ${attempt} failed:`, {
          status: error?.response?.status,
          code: error?.response?.data?.errors?.[0]?.code,
          message: error?.response?.data?.errors?.[0]?.detail || error.message
        });
        
        // Only retry on specific error codes.
        if (error?.response?.data?.errors?.[0]?.code === 141 || 
            error?.response?.status === 401) {  // Retry on unauthorized (token expired).
          if (attempt < maxRetries) {
            const delay = attempt * 1000; // Increasing delay between retries.
            console.log(`[Amadeus] Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // If unauthorized, try to reinitialize the client.
            if (error?.response?.status === 401) {
              console.log('[Amadeus] Reinitializing client due to authentication error');
              this.initializeClient();
            }
            
            continue;
          }
        }
        break;
      }
    }

    throw lastError;
  }

  // Helper method to format error messages.
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
const amadeusClient = new AmadeusClient();
module.exports = amadeusClient;
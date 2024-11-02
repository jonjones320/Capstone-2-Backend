class AmadeusClient {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  initializeClient() {
    console.log('[Amadeus] Initializing client in test environment');

    try {
      this.client = new Amadeus({
        clientId: process.env.AMADEUS_CLIENT_ID,
        clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        hostname: 'test', // Explicitly set to test environment while using test-keys.
        logLevel: 'debug'  // Keep debug logging enabled.
      });

      console.log('[Amadeus] Client initialized successfully');
      
      // Verify the client was initialized properly.
      this.verifyClient();

    } catch (error) {
      console.error("[Amadeus] Failed to initialize client:", error);
      throw error;
    }
  }

  async verifyClient() {
    try {
      // Try a simple API call to verify credentials.
      const response = await this.client.referenceData.urls.checkinLinks.get({
        airlineCode: 'BA'
      });
      console.log('[Amadeus] Client verification successful');
    } catch (error) {
      console.error('[Amadeus] Client verification failed:', {
        error: error.response?.result?.errors?.[0] || error,
        status: error.response?.statusCode
      });
      throw error;
    }
  }

  async searchFlights(params) {
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Amadeus] Searching flights (attempt ${attempt}/${maxRetries})`, {
          ...params,
          clientId: 'REDACTED', // Don't log credentials.
          clientSecret: 'REDACTED'
        });
        
        const response = await this.client.shopping.flightOffersSearch.get({
          ...params,
          nonStop: false, // Add this to get more flight results in test environment.
          max: 250 // Increase max results for testing.
        });

        console.log('[Amadeus] Flight search successful:', {
          results: response?.result?.data?.length || 0
        });
        
        return response;

      } catch (error) {
        lastError = error;
        const errorDetails = {
          code: error.response?.result?.errors?.[0]?.code,
          status: error.response?.statusCode,
          message: error.response?.result?.errors?.[0]?.detail
        };
        console.error(`[Amadeus] Flight search attempt ${attempt} failed:`, errorDetails);

        if (attempt < maxRetries) {
          const delay = attempt * 1000;
          console.log(`[Amadeus] Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        break;
      }
    }

    throw lastError;
  }
}

// Create and export a singleton instance
const amadeus = new AmadeusClient();
module.exports = amadeus;
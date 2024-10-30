// Amadeus API SDK initialization

const Amadeus = require("amadeus");
require("dotenv").config();

class AmadeusClient {
  constructor() {
    this.client = null;
    this.initializeClient();
  }

  initializeClient() {
    try {
      this.client = new Amadeus({
        clientId: process.env.AMADEUS_CLIENT_ID,
        clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        hostname: 'test',
        logger: {
          log: (message, data) => console.log(`[Amadeus] ${message}`, data),
          error: (message, data) => console.error(`[Amadeus Error] ${message}`, data),
          debug: (message, data) => console.debug(`[Amadeus Debug] ${message}`, data)
        }
      });

      // Add request interceptor to monitor traffic.
      this.client.client.interceptors.request.use(
        config => {
          console.log('[Amadeus] Making request:', {
            method: config.method,
            url: config.url,
            params: config.params
          });
          return config;
        },
        error => {
          console.error('[Amadeus] Request Error:', error);
          return Promise.reject(error);
        }
      );

      // Add response interceptor to monitor or handle responses.
      this.client.client.interceptors.response.use(
        response => {
          console.log('[Amadeus] Response received:', {
            status: response.status,
            data: response.data
          });
          return response;
        },
        error => {
          console.error('[Amadeus] Response Error:', error?.response?.data || error);
          return Promise.reject(error);
        }
      );

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
        const response = await this.client.shopping.flightOffersSearch.get(params);
        return response;
      } catch (error) {
        lastError = error;
        console.error(`[Amadeus] Flight search attempt ${attempt} failed:`, error?.response?.data || error);
        
        // Only retry on specific error codes
        if (error?.response?.data?.errors?.[0]?.code === 141) {
          if (attempt < maxRetries) {
            const delay = attempt * 1000; // Increasing delay between retries
            console.log(`[Amadeus] Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        break;
      }
    }

    throw lastError;
  }
}

// Create and export a single instance.
const amadeusClient = new AmadeusClient();
module.exports = amadeusClient;
"use strict";

/** Routes for flights. */

const express = require("express");
const router = new express.Router();
const amadeusClient = require("../amadeus"); // Access the Amadeus SDK
const { BadRequestError } = require("../expressError");
const { ensureCorrectUserOrAdmin, 
        ensureAdmin, 
        ensureLoggedIn, 
        authenticateJWT 
      } = require("../middleware/auth");
const { validateFlightNew, 
        validateFlightUpdate, 
        validateFlightSearch 
      } = require('../middleware/validateSchema');
const formatDate = require("../helpers/date");
const Flight = require("../models/flight")


// POST Create flight
router.post('/', authenticateJWT, ensureLoggedIn, validateFlightNew, async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);
    return res.status(201).json({ flight });
  } catch (err) {
    return next(err);
  }
});

// GET Search flights with filters
router.get('/', ensureLoggedIn, async (req, res, next) => {
  try {
    console.log("flight.js - filters: ", req.query);
    const filters = {
      id : req.query.id,
      tripId : req.query.tripId
    };
    
    let flights;
    try {
      flights = await Flight.findAll(filters);
      console.log("flight.js - flights: ", flights);
      
      if (flights.length === 0) {
        return res.status(404).json({ error: "No flight found with the given ID" });
      }
      
      return res.json({ flight: flights[0] });
    } catch (findError) {
      console.error("Error in Flight.findAll:", findError);
      throw findError;
    }
  } catch (err) {
    console.error("Error in flight route handler:", err);
    return next(err);
  }
});

// GET Flights associated with a Trip Id
router.get('/trip/:tripId', async function (req, res, next) {
  try {
    const flights = await Flight.getFlightsByTrip(req.params.tripId)
    return res.json({ flights });
  } catch (err) {
    return next(err);
  }
});

// DELETE /flights/:id: delete a single flight by id
router.delete('/:id', authenticateJWT, ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    await Flight.remove(req.params.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
});

/**                           */
/** AMADEUS FLIGHT ENDPOINTS */
/**                         */

// GET Flight Offers Search
router.get("/offers", validateFlightSearch, async function (req, res, next) {
  console.log("Flights.js - req.query: ", req.query);
  try {
    const { 
      originLocationCode, 
      destinationLocationCode, 
      departureDate, 
      returnDate, 
      adults = 1 
    } = req.query;

    // Prepare the search params.
    const searchParams = {
      originLocationCode: originLocationCode.toUpperCase(),
      destinationLocationCode: destinationLocationCode.toUpperCase(),
      departureDate,
      returnDate,
      adults: Number(adults),
      currencyCode: 'USD',
      max: 20
    };

    try {
      const response = await amadeusClient.searchFlights(searchParams);
      console.log("Flight.js - response: ", response);
      if (response?.result?.data && Array.isArray(response.result.data)) {
        console.log(`Found ${response.result.data.length} flight offers`);
        return res.json(response.result);
      } else {
        return res.status(404).json({
          error: {
            message: "No flights found for these search criteria",
            code: "NO_FLIGHTS_FOUND",
            status: 404
          }
        });
      }
    } catch (amadeusError) {
      // Extract error details from Amadeus response.
      const error = amadeusError.response?.result?.errors?.[0] || {};
      const status = error.status || 500;
      const code = error.code || 'UNKNOWN_ERROR';

      return res.status(status).json({
        error: {
          message: error.detail || "An error occurred while searching for flights",
          code,
          status,
          details: process.env.NODE_ENV === 'development' ? error : undefined
        }
      });
    }
  } catch (error) {
    console.error("Flight search route error:", error);
    return next(error);
  }
});

// Airports and City Search (autocomplete)
// Find all the cities and airports starting by a keyword
router.get('/airport-suggestions', async (req, res, next) => {
  const { keyword } = req.query; // Extract the keyword from query parameters

  if (!keyword) {
    return res.status(400).json({ error: "keyword query parameter is required" });
  }

  try {
    // Amadeus API call to get airport suggestions
    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: 'AIRPORT,CITY',
      'page[offset]': 0,
      'page[limit]': 5
    });
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching airport suggestions:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Flight Inspiration Search
router.get("/destinations", async function (req, res, next) {
try {
  const response = await amadeus.shopping.flightDestinations.get({
    origin: req.query.origin
  });
  return res.json(response.data);
} catch (error) {
  console.error("Error fetching flight destinations", error);
  return res.status(500).json({ error: error.message });
}
});

// GET Flight Date Search
router.get("/dates", validateFlightSearch, async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightDates.get({
      origin: req.query.origin,
      destination: req.query.destination
    });
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching flight dates", error);
    return res.status(500).json({ error: error.message });
  }
});

// POST Flight Offers Search //
// Creates an Amadeus order for a flight.
router.post("/offers", validateFlightSearch, async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.post(JSON.stringify(req.body));
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching flight offers", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET Flight Offers Price //
// Used to verify that the price hasn't changed since the order was created.
// This verification is required before booking a flight.
router.get("/offers/price", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: req.query.origin,
      destinationLocationCode: req.query.destination,
      departureDate: req.query.departureDate,
      adults: req.query.adults,
      currencyCode: currencyCode || 'USD' // Use USD as default if not provided
    });
    const pricingResponse = await amadeus.shopping.flightOffers.pricing.post(
      JSON.stringify({
        'data': {
          'type': 'flight-offers-pricing',
          'flightOffers': [response.data[0]]
        }
      })
    );
    return res.json(pricingResponse.data);
  } catch (error) {
    console.error("Error fetching flight offers price", error);
    return res.status(500).json({ error: error.message });
  }
});

// POST Flight Offers Price with additional parameters
router.post("/offers/price", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffers.pricing.post(JSON.stringify(req.body), { include: 'bags' });
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching flight offers price", error);
    return res.status(500).json({ error: error.message });
  }
});

// POST Flight Create Orders //
// Books a flight with Amadeus
router.post("/orders", async function (req, res, next) {
  try {
    const response = await amadeus.booking.flightOrders.post(JSON.stringify(req.body));
    return res.json(response.data);
  } catch (error) {
    console.error("Error creating flight orders", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET Retrieve flight order with ID 'XXX'
router.get("/orders/:id", async function (req, res, next) {
  try {
    const response = await amadeus.booking.flightOrder(req.params.id).get();
    return res.json(response.data);
  } catch (error) {
    console.error("Error retrieving flight order", error);
    return res.status(500).json({ error: error.message });
  }
});

// DELETE Cancel flight order with ID 'XXX'
router.delete("/orders/:id", async function (req, res, next) {
  try {
    const response = await amadeus.booking.flightOrder(req.params.id).delete();
    return res.json(response.data);
  } catch (error) {
    console.error("Error canceling flight order", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET Flight SeatMap Display
router.get("/seatmaps", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: req.query.origin,
      destinationLocationCode: req.query.destination,
      departureDate: req.query.departureDate,
      adults: req.query.adults
    });
    const seatmapResponse = await amadeus.shopping.seatmaps.post(
      JSON.stringify({
        'data': [response.data[0]]
      })
    );
    return res.json(seatmapResponse.data);
  } catch (error) {
    console.error("Error fetching flight seatmaps", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET Retrieve the seat map for flight order with ID 'XXX'
router.get("/orders/:id/seatmap", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.seatmaps.get({
      'flight-orderId': req.params.id
    });
    return res.json(response.data);
  } catch (error) {
    console.error("Error retrieving flight seatmap", error);
    return res.status(500).json({ error: error.message });
  }
});

// POST Flight Availabilities Search
router.post("/availabilities", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.availability.flightAvailabilities.post(JSON.stringify(req.body));
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching flight availabilities", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET Flight Checkin Links
router.get("/airline/checkinLinks", async function (req, res, next) {
  try {
    const response = await amadeus.referenceData.urls.checkinLinks.get({
      airlineCode: req.query.airlineCode
    });
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching check-in links", error);
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;

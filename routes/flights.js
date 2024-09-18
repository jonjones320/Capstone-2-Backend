"use strict";

/** Routes for flights. */

const express = require("express");
const router = new express.Router();
const amadeus = require("../amadeus"); // Access the Amadeus SDK
const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { validateFlightNew, 
        validateFlightUpdate, 
        validateFlightSearch 
      } = require('../middleware/validateSchema');


  
// GET Flight Offers Search
router.get("/offers", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: req.query.originCode,
      destinationLocationCode: req.query.destinationCode,
      departureDate: req.query.dateOfDeparture,
      adults: req.query.adults,
      max: '10'
    });
    if (response.result) {
      return res.json(response.result);
    } else {
      throw new BadRequestError("No flights found");
    }
  } catch (error) {
    console.error("Error fetching flight offers", error);
    return res.status(500).json({ error: error.message });
  }
});

// Flight Inspiration Search
router.get("/destinations", validateFlightSearch, async function (req, res, next) {
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

// Flight Date Search
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


// POST Flight Offers Search
router.post("/offers", validateFlightSearch, async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.post(JSON.stringify(req.body));
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching flight offers", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET Flight Offers Price
router.get("/offers/price", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: req.query.origin,
      destinationLocationCode: req.query.destination,
      departureDate: req.query.departureDate,
      adults: req.query.adults
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

// POST Flight Create Orders
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

// POST Branded Fares Upsell
router.post("/offers/upselling", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffers.upselling.post(JSON.stringify(req.body));
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching branded fares", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET Flight Choice Prediction
router.get("/offers/prediction", async function (req, res, next) {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: req.query.origin,
      destinationLocationCode: req.query.destination,
      departureDate: req.query.departureDate,
      adults: req.query.adults
    });
    const predictionResponse = await amadeus.shopping.flightOffers.prediction.post(
      JSON.stringify(response)
    );
    return res.json(predictionResponse.data);
  } catch (error) {
    console.error("Error fetching flight choice prediction", error);
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

// GET On-Demand Flight Status
router.get("/status", async function (req, res, next) {
  try {
    const response = await amadeus.schedule.flights.get({
      carrierCode: req.query.carrierCode,
      flightNumber: req.query.flightNumber,
      scheduledDepartureDate: req.query.scheduledDepartureDate
    });
    return res.json(response.data);
  } catch (error) {
    console.error("Error fetching flight status", error);
    return res.status(500).json({ error: error.message });
  }
});

// GET Flight Busiest Traveling Period
router.get("/busiestPeriod", async function (req, res, next) {
  try {
      const response = await amadeus.travel.analytics.airTraffic.busiestPeriod.get({
          cityCode: req.query.cityCode,
          period: req.query.period,
          direction: amadeus.direction.arriving
      });
      return res.json(response.data);
  } catch (error) {
      console.error("Error fetching busiest traveling period", error);
      return res.status(500).json({ error: error.message });
  }
});


module.exports = router;

"use strict";

/** Routes for airports. */

const express = require("express");
const router = express.Router({ mergeParams: true });
const amadeus = require("../amadeus"); // Access the Amadeus SDK



// GET Flight Busiest Traveling Period
router.get("/airTraffic/busiestPeriod", async function (req, res, next) {
    try {
        const response = await amadeus.travel.analytics.airTraffic.busiestPeriod.get({
            cityCode: req.query.cityCode,
            period: req.query.period,
            direction: Amadeus.direction.arriving
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching busiest traveling period", error);
        return res.status(500).json({ error: error.message });
    }
});

// POST Trip Parser API V3
router.post("/tripParser", async function (req, res, next) {
    try {
        const response = await amadeus.travel.tripParser.post(JSON.stringify(req.body));
        return res.json(response.data);
    } catch (error) {
        console.error("Error parsing trip information", error);
        return res.status(500).json({ error: error.message });
    }
});

//Airport Routes 
router.get("/airport/directDestinations", async function (req, res, next) {
    try {
        const response = await amadeus.airport.directDestinations.get({
            departureAirportCode: req.query.departureAirportCode,
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching direct destinations", error);
        return res.status(500).json({ error: error.message });
    }
});

// Airports and City Search (autocomplete)
// Find all the cities and airports starting by a keyword
router.get("/referenceData/locations", async function (req, res, next) {
    try {
        const response = await amadeus.referenceData.locations.get({
            keyword: req.query.keyword,
            subType: Amadeus.location.any
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching locations", error);
        return res.status(500).json({ error: error.message });
    }
});

// Get a specific city or airport based on its id
router.get("/referenceData/location/:id", async function (req, res, next) {
    try {
        const response = await amadeus.referenceData.location(req.params.id).get();
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching location", error);
        return res.status(500).json({ error: error.message });
    }
});

// Airport Nearest Relevant Airport
router.get("/referenceData/locations/airports", async function (req, res, next) {
    try {
        const response = await amadeus.referenceData.locations.airports.get({
            longitude: req.query.longitude,
            latitude: req.query.latitude
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching nearest airports", error);
        return res.status(500).json({ error: error.message });
    }
});

// Flight Most Booked Destinations
router.get("/travel/analytics/airTraffic/booked", async function (req, res, next) {
    try {
        const response = await amadeus.travel.analytics.airTraffic.booked.get({
            originCityCode: req.query.originCityCode,
            period: req.query.period
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching most booked destinations", error);
        return res.status(500).json({ error: error.message });
    }
});

// Flight Most Traveled Destinations
router.get("/travel/analytics/airTraffic/traveled", async function (req, res, next) {
    try {
        const response = await amadeus.travel.analytics.airTraffic.traveled.get({
            originCityCode: req.query.originCityCode,
            period: req.query.period
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching most traveled destinations", error);
        return res.status(500).json({ error: error.message });
    }
});

// City Search API
// finds cities that match a specific keyword
router.get("/referenceData/locations/cities", async function (req, res, next) {
    try {
        const response = await amadeus.referenceData.locations.cities.get({
            keyword: req.query.keyword
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching cities", error);
        return res.status(500).json({ error: error.message });
    }
});

// Airport On-time Performance
// Get the percentage of on-time flight departures from an airport
router.get("/airport/predictions/onTime", async function (req, res, next) {
    try {
        const response = await amadeus.airport.predictions.onTime.get({
            airportCode: req.query.airportCode,
            date: req.query.date
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching on-time performance", error);
        return res.status(500).json({ error: error.message });
    }
});

"use strict";

/** Routes for airlines. */

const express = require("express");
const router = express.Router({ mergeParams: true });
const amadeus = require("../amadeus"); // Access the Amadeus SDK


// GET find all destinations served by a given airline
router.get("/airline/destinations", async function (req, res, next) {
    try {
        const { airlineCode } = req.query;
        const response = await amadeus.airline.destinations.get({
            airlineCode,
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching airline destinations", error);
        return res.status(500).json({ error: error.message });
    }
});

// GET Airline Code Lookup
router.get("/airline/:code", async function (req, res, next) {
    try {
        const { code } = req.params;
        const response = await amadeus.referenceData.airlines.get({
            airlineCodes: code,
        });
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching airline information", error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;

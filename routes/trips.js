"use strict";

/** Routes for trips. */

const express = require('express');
const router = new express.Router();
const amadeus = require("../amadeus"); // Access the Amadeus SDK
const Trip = require('../models/trip');

const { ensureCorrectUserOrAdmin, 
        ensureAdmin, 
        ensureLoggedIn, 
        authenticateJWT 
      } = require("../middleware/auth");
const { validateTripNew, 
        validateTripUpdate, 
        validateTripSearch 
      } = require('../middleware/validateSchema');


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

// POST /trips: create a new trip
router.post('/', authenticateJWT, ensureLoggedIn, validateTripNew, async (req, res, next) => {
  try {
    const trip = await Trip.create(req.body);
    return res.status(201).json({ trip });
  } catch (err) {
    return next(err);
  }
});

// PATCH /trips/:id: update a trip
router.patch('/:id', ensureCorrectUserOrAdmin, validateTripUpdate, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;

    if (startDate) req.body.startDate = new Date(startDate);
    if (endDate) req.body.endDate = new Date(endDate);

    const trip = await Trip.update(req.params.id, req.body);
    
    return res.status(201).json({ trip });
  } catch (err) {
    return next(err);
  }
});

// GET /trips: get all trips (with optional filtering)  
router.get('/', ensureLoggedIn, async (req, res, next) => {
  try {
    // Collect filters from query parameters
    const filters = {
      name: req.query.name,
      username: req.query.username,
      origin: req.query.origin,
      destination: req.query.destination,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      passengers: req.query.passengers
    };

    const trips = await Trip.findAll(filters);
    return res.json({ trips });
  } catch (err) {
    return next(err);
  }
});

// GET /trips/user/:username: get all trips for a user
router.get('/user/:username', ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const trips = await Trip.findAll({ username: req.params.username });
    return res.json({ trips });
  } catch (err) {
    return next(err);
  }
});

// GET /trips/:id: get a single trip by id
router.get('/:id', ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    const trip = await Trip.get(req.params.id);
    return res.json({ trip });
  } catch (err) {
    console.debug("trips.js - GET /trips/:id - CATCH ERR: ", err);
    return next(err);
  }
});   

// DELETE /trips/:id: delete a single trip by id
router.delete('/:id', ensureCorrectUserOrAdmin, async (req, res, next) => {
  try {
    await Trip.remove(req.params.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
const express = require('express');
const router = new express.Router();
const Trip = require('../models/trip');
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn, authenticateJWT } = require("../middleware/auth");
const { validateTripNew, 
        validateTripUpdate, 
        validateTripSearch 
      } = require('../middleware/validateSchema');

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

// GET /trips: get all trips  
router.get('/', ensureAdmin, async (req, res, next) => {
  try {
    const trips = await Trip.findAll(req.query);
    return res.json({ trips });
  } catch (err) {
    return next(err);
  }
});

// GET /trips/:username: get all trips for a user
router.get('/:username', ensureCorrectUserOrAdmin, async (req, res, next) => {
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
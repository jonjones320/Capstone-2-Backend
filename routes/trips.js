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
    // console.log("trips.js - post/trips: REQ.BODY", req.body);
    const trip = await Trip.create(req.body);
    return res.status(201).json({ trip });
  } catch (err) {
    // console.log("trips.js - post/trips - catch: ERR", err);
    return next(err);
  }
});

// PATCH /trips/:id: update a trip
router.patch('/:id', ensureCorrectUserOrAdmin, validateTripUpdate, async (req, res, next) => {
  try {
    const trip = await Trip.update(req.body);
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

// GET /trips/:id: get a single trip by id
router.get('/:id', ensureCorrectUserOrAdmin, validateTripSearch, async (req, res, next) => {
  try {
    const trip = await Trip.findOne(req.params.id);
    return res.json({ trip });
  } catch (err) {
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
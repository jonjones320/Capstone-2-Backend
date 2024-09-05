const express = require('express');
const router = new express.Router();
const Trip = require('../models/trip');

// POST /trips: create a new trip
router.post('/', async (req, res, next) => {
  try {
    const trip = await Trip.create(req.body);
    return res.status(201).json({ trip });
  } catch (err) {
    return next(err);
  }
});

// PATCH /trips/:id: update a trip
router.patch('/:id', async (req, res, next) => {
  try {
    const trip = await Trip.update(req.body);
    return res.status(201).json({ trip });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
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

// GET /trips: get all trips  
router.get('/', async (req, res, next) => {
  try {
    const trips = await Trip.findAll(req.query);
    return res.json({ trips });
  } catch (err) {
    return next(err);
  }
});

// GET /trips/:id: get a single trip by id
router.get('/:id', async (req, res, next) => {
  try {
    const trip = await Trip.findOne(req.params.id);
    return res.json({ trip });
  } catch (err) {
    return next(err);
  }
});   

// DELETE /trips/:id: delete a single trip by id
router.delete('/:id', async (req, res, next) => {
  try {
    await Trip.remove(req.params.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
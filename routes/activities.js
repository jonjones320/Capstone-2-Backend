"use strict";

/** Routes for activities. */

const express = require("express");
const router = express.Router({ mergeParams: true });
const amadeus = require("../amadeus"); // Access the Amadeus SDK

// GET Points of Interest
router.post('/pointsOfInterest', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const response = await amadeus.referenceData.locations.pointsOfInterest.get({
            latitude,
            longitude
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Points of Interest by Square
router.post('/pointsOfInterestBySquare', async (req, res) => {
    try {
        const { north, west, south, east } = req.body;
        const response = await amadeus.referenceData.locations.pointsOfInterest.bySquare.get({
            north,
            west,
            south,
            east
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Point of Interest by ID
router.post('/pointOfInterest', async (req, res) => {
    try {
        const { poiId } = req.body;
        const response = await amadeus.referenceData.locations.pointOfInterest(poiId).get();
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Location Score
router.post('/locationScore', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const response = await amadeus.location.analytics.categoryRatedAreas.get({
            latitude,
            longitude
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Tours and Activities
router.post('/toursAndActivities', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const response = await amadeus.shopping.activities.get({
            latitude,
            longitude
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Tours and Activities by Square
router.post('/toursAndActivitiesBySquare', async (req, res) => {
    try {
        const { north, west, south, east } = req.body;
        const response = await amadeus.shopping.activities.bySquare.get({
            north,
            west,
            south,
            east
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Activity by ID
router.post('/activity', async (req, res) => {
    try {
        const { activityId } = req.body;
        const response = await amadeus.shopping.activity(activityId).get();
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
const request = require('supertest');
const app = require('../app');
const db = require('../db');

describe('Ranner Backend Smoke Tests', () => {
  const testUser = {
    username: 'smoke_test_user',
    password: 'smoketest123',
    firstName: 'Smoke',
    lastName: 'Test',
    email: 'smoke@test.com'
  };

  let authToken;

  beforeAll(async () => {
    // Clean up any existing test data before any test runs.
    try {
      await db.query('DELETE FROM flights WHERE trip_id IN (SELECT trip_id FROM trips WHERE username = $1)', 
        [testUser.username]);
      await db.query('DELETE FROM trips WHERE username = $1', [testUser.username]);
      await db.query('DELETE FROM users WHERE username = $1', [testUser.username]);
    } catch (err) {
      console.error('Cleanup error:', err);
    }
  });

  // Closes the database after testing is complete.
  afterAll(async () => {
    await db.end();
  });

  describe('API Health', () => {
    test('Health check endpoint is working', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'healthy' });
    });
  });

  describe('Authentication API', () => {
    test('Can register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send(testUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      authToken = response.body.token;
    });

    test('Can login with created user', async () => {
      const response = await request(app)
        .post('/auth/token')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Trip API', () => {
    test('Can create and retrieve a trip', async () => {
      // Create trip.
      const createResponse = await request(app)
        .post('/trips')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Smoke Test Trip',
          username: testUser.username,
          origin: 'SFO',
          destination: 'JFK',
          startDate: '2025-01-01',
          endDate: '2025-01-07',
          passengers: 2
        });

      expect(createResponse.status).toBe(201);
      const tripId = createResponse.body.trip.tripId;

      // Retrieve trip.
      const getResponse = await request(app)
        .get(`/trips/${tripId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.trip.tripId).toBe(tripId);
    });
  });

  describe('Flight Search API', () => {
    test('Can search for airports', async () => {
      // Not testing Amadeus SDK so the request is direct.
      const response = await request(app)
        .get('/flights/airport-suggestions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ keyword: 'San Fran' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('Can search for flights', async () => {
      const response = await request(app)
        .get('/flights/offers')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          originLocationCode: 'SFO',
          destinationLocationCode: 'JFK',
          departureDate: '2025-01-01',
          adults: 2
        });

      expect(response.status).toBe(200);
    });
  });
});
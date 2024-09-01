"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Trip = require("../models/trip");
const Flight = require("../models/flight");
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  // Truncate tables to remove all existing rows and reset primary keys
  await db.query("TRUNCATE accommodations, flights, trips, users RESTART IDENTITY CASCADE");

  // // noinspection SqlWithoutWhere
  // await db.query("DELETE FROM flights");
  // // noinspection SqlWithoutWhere
  // await db.query("DELETE FROM trips");
  // // noinspection SqlWithoutWhere
  // await db.query("DELETE FROM users");

  await User.register(
      {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "user1@user.com",
        password: "password1",
        isAdmin: false,
      });
  await User.register(
      {
        username: "u2",
        firstName: "U2F",
        lastName: "U2L",
        email: "user2@user.com",
        password: "password2",
        isAdmin: false,
      });
  await User.register(
      {
        username: "u3",
        firstName: "U3F",
        lastName: "U3L",
        email: "user3@user.com",
        password: "password3",
        isAdmin: false,
      });

  await Trip.create(
      {
        name: "Trip 1",
        username: "u1",
        location_id: 1,
        start_date: "2025-01-01",
        end_date: "2025-01-15",
        budget: 1000,
      });
  await Trip.create(
      {
        name: "Trip 2",
        username: "u2",
        location_id: 2,
        start_date: "2025-02-01",
        end_date: "2025-02-15",
        budget: 2000,
      });
  await Trip.create(
      {
        name: "Trip 3",
        username: "u3",
        location_id: 3,
        start_date: "2025-03-01",
        end_date: "2025-03-15",
        budget: 3000,
      });

  await Flight.create({ flightNumber: "A123", trip_id: 1, origin: 'RDU', destination: 'NYC' });
  await Flight.create({ flightNumber: "B123", trip_id: 2, origin: 'SEA', destination: 'DEN' });
  await Flight.create({ flightNumber: "C123", trip_id: 3, origin: 'LAX', destination: 'SYD' });

  const accommodationData = {
    tripId: 1,
    name: "Accommodation 1",
    checkIn: "2025-01-01",
    checkOut: "2025-01-05",
  };

  await Accommodation.create(accommodationData);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
};

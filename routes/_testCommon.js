"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Trip = require("../models/trip");
const Flight = require("../models/flight");
const { createToken } = require("../helpers/tokens");
const { start } = require("repl");

const testFlightIds = [];

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM trips");

  await Trip.create(
      {
        trip_id: 1,
        user_id: 1,
        location_id: 1,
        start_date: "2025-01-01",
        end_date: "2025-01-15",
        budget: 1000,
      });
  await Trip.create(
      {
        trip_id: 2,
        user_id: 2,
        location_id: 2,
        start_date: "2025-02-01",
        end_date: "2025-02-15",
        budget: 2000,
      });
  await Trip.create(
      {
        trip_id: 3,
        user_id: 3,
        location_id: 3,
        start_date: "2025-03-01",
        end_date: "2025-03-15",
        budget: 3000,
      });

  const flightData = { flightNumber: "A000", trip_id: 1, origin: 'RDU', destination: 'NYC' };
  testFlightIds[0] = (await Flight.create(flightData)).id;
  testFlightIds[1] = (await Flight.create(flightData)).id;
  testFlightIds[2] = (await Flight.create(flightData)).id;

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
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
  testFlightIds,
  u1Token,
  u2Token,
  adminToken,
};

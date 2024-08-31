"use strict";

const db = require("../db");
const Flight = require("./flight");
const { NotFoundError } = require("../expressError");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testFlightIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newFlight = {
    flightNumber: "D123",
    tripId: "3",
    origin: "LAX",
    destination: "ORD",
  };

  test("works", async function () {
    let flight = await Flight.create(newFlight);
    expect(flight).toEqual({
      flightNumber: "D123",
      tripId: "3",
      origin: "LAX",
      destination: "ORD",
    });

    const result = await db.query(
      `SELECT flight_number, trip_id, origin, destination
       FROM flights
       WHERE flight_number = 'D123'`
    );
    expect(result.rows).toEqual([
      {
        flight_number: "D123",
        trip_id: "3",
        origin: "LAX",
        destination: "ORD",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let flight = await Flight.get(testFlightIds[0]);
    expect(flight).toEqual({
      flightNumber: "A000",
      tripId: "1",
      origin: "RDU",
      destination: "NYC",
    });
  });

  test("not found if no such flight", async function () {
    try {
      await Flight.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    origin: "SFO",
    destination: "BOS",
  };

  test("works", async function () {
    let flight = await Flight.update(testFlightIds[0], updateData);
    expect(flight).toEqual({
      flightNumber: "A000",
      tripId: "1",
      origin: "SFO",
      destination: "BOS",
    });

    const result = await db.query(
      `SELECT flight_number, trip_id, origin, destination
       FROM flights
       WHERE flight_number = 'A000'`
    );
    expect(result.rows).toEqual([
      {
        flight_number: "A000",
        trip_id: "1",
        origin: "SFO",
        destination: "BOS",
      },
    ]);
  });

  test("not found if no such flight", async function () {
    try {
      await Flight.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Flight.remove(testFlightIds[0]);
    const res = await db.query(
      "SELECT * FROM flights WHERE flight_number='A000'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such flight", async function () {
    try {
      await Flight.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
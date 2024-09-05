"use strict";

const db = require("../db");
const Trip = require("./trip");
const { NotFoundError } = require("../expressError");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newTrip = {
    name: "Trip4",
    username: "u1",
    location: "14",
    startDate: new Date("2026-04-01T07:00:00.000Z").toISOString(),
    endDate: new Date("2026-04-10T07:00:00.000Z").toISOString(),
    budget: "4000.00",
  };

  test("works", async function () {
    let trip = await Trip.create(newTrip);

    // Remove tripId from newTrip for comparison
    const { tripId, ...tripWithoutId } = trip;

    // Convert dates to ISO string format for comparison
    tripWithoutId.startDate = new Date(tripWithoutId.startDate).toISOString();
    tripWithoutId.endDate = new Date(tripWithoutId.endDate).toISOString();

    expect(tripWithoutId).toEqual(newTrip);

    const result = await db.query(
      `SELECT trip_id AS "tripId", 
              name, 
              username, 
              location AS "location", 
              start_date AS "startDate", 
              end_date AS "endDate", 
              budget
       FROM trips
       WHERE trip_id = $1`,
      [tripId]
    );

    const dbTrip = result.rows[0];
    // Convert dates to ISO string format for comparison
    dbTrip.startDate = new Date(dbTrip.startDate).toISOString();
    dbTrip.endDate = new Date(dbTrip.endDate).toISOString();

    expect(dbTrip).toEqual({
      tripId,
      name: newTrip.name,
      username: newTrip.username,
      location: newTrip.location,
      startDate: newTrip.startDate,
      endDate: newTrip.endDate,
      budget: newTrip.budget,
    });
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let trip = await Trip.get(1);
    expect(trip).toEqual({
      tripId: 1,
      name: "Trip1",
      username: "u1",
      location: "l1",
      startDate: new Date("2026-01-01T08:00:00.000Z"),
      endDate: new Date("2026-01-10T08:00:00.000Z"),
      budget: "1000.00",
    });
  });

  test("not found if no such trip", async function () {
    try {
      await Trip.get(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "NewTrip1",
    startDate: new Date("2026-01-05T08:00:00.000Z"),
    endDate: new Date("2026-01-15T08:00:00.000Z"),
    budget: "1500.00",
  };

  test("works", async function () {
    let trip = await Trip.update(1, updateData);
    expect(trip).toEqual({
      tripId: 1,
      username: "u1",
      location: "l1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT trip_id AS "tripId", 
              name, 
              username, 
              location AS "location", 
              start_date AS "startDate", 
              end_date AS "endDate", 
              budget
       FROM trips
       WHERE trip_id = '1'`
    );
    expect(result.rows).toEqual([
      {
        tripId: 1,
        name: "NewTrip1",
        username: "u1",
        location: "l1",
        startDate: new Date("2026-01-05T08:00:00.000Z"),
        endDate: new Date("2026-01-15T08:00:00.000Z"),
        budget: "1500.00",
      },
    ]);
  });

  test("not found if no such trip", async function () {
    try {
      await Trip.update(9999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Trip.remove(1);
    const res = await db.query(
      "SELECT * FROM trips WHERE trip_id='1'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such trip", async function () {
    try {
      await Trip.remove(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
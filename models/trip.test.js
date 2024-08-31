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
    trip_id: "4",
    name: "Trip4",
    username: "u1",
    location_id: "l4",
    start_date: "2022-04-01",
    end_date: "2022-04-10",
    budget: 4000,
  };

  test("works", async function () {
    let trip = await Trip.create(newTrip);
    expect(trip).toEqual(newTrip);

    const result = await db.query(
      `SELECT trip_id, name, username, location_id, start_date, end_date, budget
       FROM trips
       WHERE trip_id = '4'`
    );
    expect(result.rows).toEqual([
      {
        trip_id: "4",
        name: "Trip4",
        username: "u1",
        location_id: "l4",
        start_date: "2022-04-01",
        end_date: "2022-04-10",
        budget: 4000,
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let trip = await Trip.get("1");
    expect(trip).toEqual({
      trip_id: "1",
      name: "Trip1",
      username: "u1",
      location_id: "l1",
      start_date: "2022-01-01",
      end_date: "2022-01-10",
      budget: 1000,
    });
  });

  test("not found if no such trip", async function () {
    try {
      await Trip.get("nope");
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
    start_date: "2022-01-05",
    end_date: "2022-01-15",
    budget: 1500,
  };

  test("works", async function () {
    let trip = await Trip.update("1", updateData);
    expect(trip).toEqual({
      trip_id: "1",
      username: "u1",
      location_id: "l1",
      ...updateData,
    });

    const result = await db.query(
      `SELECT trip_id, name, username, location_id, start_date, end_date, budget
       FROM trips
       WHERE trip_id = '1'`
    );
    expect(result.rows).toEqual([
      {
        trip_id: "1",
        name: "NewTrip1",
        username: "u1",
        location_id: "l1",
        start_date: "2022-01-05",
        end_date: "2022-01-15",
        budget: 1500,
      },
    ]);
  });

  test("not found if no such trip", async function () {
    try {
      await Trip.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Trip.remove("1");
    const res = await db.query(
      "SELECT * FROM trips WHERE trip_id='1'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such trip", async function () {
    try {
      await Trip.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
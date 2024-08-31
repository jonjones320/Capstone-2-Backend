"use strict";

const db = require("../db");
const Accommodation = require("./accommodations");
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
  const newAccommodation = {
    tripId: 1,
    name: "Hotel California",
    checkIn: "2022-01-01",
    checkOut: "2022-01-10",
  };

  test("works", async function () {
    let accommodation = await Accommodation.create(newAccommodation);
    expect(accommodation).toEqual({
      accommodationId: expect.any(Number),
      tripId: 1,
      name: "Hotel California",
      checkIn: new Date("2022-01-01T08:00:00.000Z"),
      checkOut: new Date("2022-01-10T08:00:00.000Z"),
    });

    const result = await db.query(
      `SELECT accommodation_id AS "accommodationId", 
              trip_id AS "tripId", 
              name,
              check_in AS "checkIn", 
              check_out AS "checkOut"
       FROM accommodations
       WHERE trip_id = '1' AND name = 'Hotel California'`
    );
    expect(result.rows).toEqual([
      {
        accommodationId: expect.any(Number),
        tripId: 1,
        name: "Hotel California",
        checkIn: new Date("2022-01-01T08:00:00.000Z"),
        checkOut: new Date("2022-01-10T08:00:00.000Z"),
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let accommodation = await Accommodation.get(1);
    expect(accommodation).toEqual({
      accommodationId: 1,
      tripId: 1,
      name: "Hotel California",
      checkIn: new Date("2022-01-01T08:00:00.000Z"),
      checkOut: new Date("2022-01-10T08:00:00.000Z"),
    });
  });

  test("not found if no such accommodation", async function () {
    try {
      await Accommodation.get(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "Updated Hotel",
    checkIn: "2022-01-05",
    checkOut: "2022-01-15",
  };

  test("works", async function () {
    let accommodation = await Accommodation.update(1, updateData);
    expect(accommodation).toEqual({
      accommodationId: 1,
      tripId: 1,
      ...updateData,
    });

    const result = await db.query(
      `SELECT accommodation_id AS "accommodationId", 
              trip_id AS "tripId", 
              name, check_in AS "checkIn", 
              check_out AS "checkOut"
       FROM accommodations
       WHERE accommodation_id = 1`
    );
    expect(result.rows).toEqual([
      {
        accommodationId: 1,
        tripId: 1,
        name: "Updated Hotel",
        checkIn: new Date("2022-01-01T08:00:00.000Z"),
        checkOut: new Date("2022-01-10T08:00:00.000Z"),
      },
    ]);
  });

  test("not found if no such accommodation", async function () {
    try {
      await Accommodation.update(9999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Accommodation.remove(1);
    const res = await db.query(
      "SELECT * FROM accommodations WHERE accommodation_id=1"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such accommodation", async function () {
    try {
      await Accommodation.remove(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
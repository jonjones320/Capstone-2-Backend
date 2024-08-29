"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /flight/destinations */

describe("GET /flight/destinations", function () {
  test("works for users", async function () {
    const resp = await request(app)
        .get("/flight/destinations")
        .query({ origin: "NYC" })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/flight/destinations")
        .query({ origin: "NYC" });
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /flight/dates */

describe("GET /flight/dates", function () {
  test("works for users", async function () {
    const resp = await request(app)
        .get("/flight/dates")
        .query({ origin: "NYC", destination: "LAX" })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      // Expected response structure
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/flight/dates")
        .query({ origin: "NYC", destination: "LAX" });
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /flight/offers */

describe("GET /flight/offers", function () {
  test("works for users", async function () {
    const resp = await request(app)
        .get("/flight/offers")
        .query({
          origin: "NYC",
          destination: "LAX",
          departureDate: "2025-12-01",
          adults: 1
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual(expect.any(Array)); // Adjust this based on the expected response structure
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
        .get("/flight/offers")
        .query({
          origin: "NYC",
          destination: "LAX"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/flight/offers")
        .query({
          origin: "NYC",
          destination: "LAX",
          departureDate: "2025-12-01",
          adults: 1
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("handles errors gracefully", async function () {
    const resp = await request(app)
        .get("/flight/offers")
        .query({
          origin: "INVALID",
          destination: "LAX",
          departureDate: "2025-12-01",
          adults: 1
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
    expect(resp.body.error).toEqual(expect.any(String));
  });
});

/************************************** POST /flight/offers */

describe("POST /flight/offers", function () {
  test("works for users", async function () {
    const resp = await request(app)
        .post("/flight/offers")
        .send({
          origin: "NYC",
          destination: "LAX",
          departureDate: "2025-12-01",
          adults: 1
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual(expect.any(Array)); // Adjust this based on the expected response structure
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
        .post("/flight/offers")
        .send({
          origin: "NYC",
          destination: "LAX"
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/flight/offers")
        .send({
          origin: "NYC",
          destination: "LAX",
          departureDate: "2025-12-01",
          adults: 1
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("handles errors gracefully", async function () {
    const resp = await request(app)
        .post("/flight/offers")
        .send({
          origin: "INVALID",
          destination: "LAX",
          departureDate: "2025-12-01",
          adults: 1
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
    expect(resp.body.error).toEqual(expect.any(String));
  });
});

/************************************** POST /flight/orders */

describe("POST /flight/orders", function () {
  test("works for users", async function () {
    const resp = await request(app)
        .post("/flight/orders")
        .send({
          data: {
            type: "flight-order",
            flightOffers: [/* flight offer data */],
            travelers: [/* traveler data */]
          }
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual(expect.any(Object)); // Adjust this based on the expected response structure
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
        .post("/flight/orders")
        .send({
          data: {
            type: "flight-order"
          }
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/flight/orders")
        .send({
          data: {
            type: "flight-order",
            flightOffers: [/* flight offer data */],
            travelers: [/* traveler data */]
          }
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("handles errors gracefully", async function () {
    const resp = await request(app)
        .post("/flight/orders")
        .send({
          data: {
            type: "flight-order",
            flightOffers: [/* invalid flight offer data */],
            travelers: [/* traveler data */]
          }
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
    expect(resp.body.error).toEqual(expect.any(String));
  });
});
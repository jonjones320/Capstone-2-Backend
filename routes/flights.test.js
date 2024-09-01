"use strict";

const request = require("supertest");
const db = require("../db");
const app = require("../app");
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, adminToken } = require("./_testCommon");
const amadeus = require("../amadeus");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

jest.mock("../amadeus");

describe("GET /flight/destinations", function () {
  test("works for admin", async function () {
    amadeus.shopping.flightDestinations.get.mockResolvedValue({
      data: [{ destination: "JFK" }, { destination: "LAX" }]
    });

    const resp = await request(app)
      .get("/flight/destinations?origin=SFO")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([{ destination: "JFK" }, { destination: "LAX" }]);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get("/flight/destinations?origin=SFO");
    expect(resp.statusCode).toEqual(401);
  });

  test("fails with invalid origin", async function () {
    amadeus.shopping.flightDestinations.get.mockRejectedValue(new Error("Invalid origin"));

    const resp = await request(app)
      .get("/flight/destinations?origin=INVALID")
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(500);
    expect(resp.body.error.message).toEqual("Invalid origin");
  });
});
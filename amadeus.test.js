// amadeus.test.js

require("dotenv").config();
const Amadeus = require("amadeus");
const amadeus = require("./amadeus");

describe("Amadeus SDK Initialization", () => {
  it("should initialize Amadeus with correct credentials", () => {
    expect(amadeus).toBeInstanceOf(Amadeus);
    expect(amadeus.client.clientId).toBe(process.env.AMADEUS_CLIENT_ID);
    expect(amadeus.client.clientSecret).toBe(process.env.AMADEUS_CLIENT_SECRET);
  });

  it("should set log level to debug", () => {
    expect(amadeus.client.logLevel).toBe("debug");
  });

  it("should set hostname based on NODE_ENV", () => {
    if (process.env.NODE_ENV === "production") {
      expect(amadeus.client.hostname).toBe("production");
    } else {
      expect(amadeus.client.hostname).toBeUndefined();
    }
  });
});
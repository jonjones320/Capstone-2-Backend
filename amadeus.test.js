// amadeus.test.js

const Amadeus = require("amadeus");
const amadeus = require("./amadeus");

describe("Amadeus SDK Initialization", () => {
  it("should initialize Amadeus with correct credentials", () => {
    expect(amadeus).toBeInstanceOf(Amadeus);
    expect(amadeus.clientId).toBe(process.env.AMADEUS_CLIENT_ID);
    expect(amadeus.clientSecret).toBe(process.env.AMADEUS_CLIENT_SECRET);
  });

  it("should set log level to debug", () => {
    expect(amadeus.logLevel).toBe("debug");
  });

  it("should set hostname based on NODE_ENV", () => {
    if (process.env.NODE_ENV === "production") {
      expect(amadeus.hostname).toBe("production");
    } else {
      expect(amadeus.hostname).toBeUndefined();
    }
  });
});
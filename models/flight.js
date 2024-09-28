"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Flight {
  /** Create a flight (from data), update db, return new flight data.
   *
   * data should be { tripId, flightOfferId, outboundFlightNumber, inboundFlightNumber }
   *
   * Returns { id, ...flight }
   **/
  static async create(data) {
    const result = await db.query(
      `INSERT INTO flights (trip_id,
                            flight_offer_id,
                            outbound_flight_number,
                            inbound_flight_number)
               VALUES ($1, $2, $3, $4, $5, $6)
               RETURNING  trip_id AS "tripId", 
                            flight_offer_id AS flightOfferId, 
                            outbound_flight_num AS "outboundFlightNumber", 
                            inbound_flight_number AS "inboundFlightNumber"`,
            [
              data.tripId,
              data.flightOfferId,
              data.outboundFlightNumber,
              data.inboundFlightNumber
            ]);
    let flight = result.rows[0];

    return flight;
  }

  /** Find all flights (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - flightNumber
   * - tripId
   * - origin
   * - destination
   *
   * Returns [{ flightNumber, tripId, origin, destination }, ...]
   * */
  static async findAll({ flightNumber, tripId, origin, destination } = {}) {
    let query = `SELECT flight_number AS "flightNumber",
                        trip_id AS "tripId",
                        origin,
                        destination
                 FROM flights`;
    let whereExpressions = [];
    let queryValues = [];

    if (tripId !== undefined) {
      queryValues.push(tripId);
      whereExpressions.push(`trip_id = $${queryValues.length}`);
    };
    if (flightNumber !== undefined) {
        queryValues.push(flightNumber);
        whereExpressions.push(`flight_number = $${queryValues.length}`);
    };
    if (origin !== undefined) {
      queryValues.push(origin);
      whereExpressions.push(`origin = $${queryValues.length}`);
    };
    if (destination !== undefined) {
      queryValues.push(destination);
      whereExpressions.push(`destination = $${queryValues.length}`);
    };
    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    };

    query += " ORDER BY flight_number";
    const flightsRes = await db.query(query, queryValues);
    return flightsRes.rows;
  }

  /** Given a flight number, return data about flight.
   *
   * Returns { flightNumber, tripId, origin, destination }
   *
   * Throws NotFoundError if not found.
   **/
  static async get(flightNumber) {
    const flightRes = await db.query(
              `SELECT flight_number AS "flightNumber",
                      trip_id AS "tripId",
                      origin,
                      destination
               FROM flights
               WHERE flight_number = $1`, [flightNumber]);

    const flight = flightRes.rows[0];

    if (!flight) throw new NotFoundError(`No flight: ${flightNumber}`);

    return flight;
  }

  /** Update flight data with `data`.
   *
   * This is a "partial update" --- only changes provided fields.
   *
   * Data can include: { tripId, origin, destination }
   *
   * Returns { flightNumber, tripId, origin, destination }
   *
   * Throws NotFoundError if not found.
   */
  static async update(flightNumber, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          origin: "origin",
          destination: "destination"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE flights 
                          SET ${setCols} 
                          WHERE flight_number = ${idVarIdx} 
                          RETURNING flight_number AS "flightNumber", 
                                    trip_id AS "tripId",
                                    origin,
                                    destination`;
    const result = await db.query(querySql, [...values, flightNumber]);
    const flight = result.rows[0];

    if (!flight) throw new NotFoundError(`No flight: ${flightNumber}`);

    return flight;
  }

  /** Delete given flight from database; returns undefined.
   *
   * Throws NotFoundError if flight not found.
   **/
  static async remove(flightNumber) {
    const result = await db.query(
          `DELETE
           FROM flights
           WHERE flight_number = $1
           RETURNING flight_number`, [flightNumber]);
    const flight = result.rows[0];

    if (!flight) throw new NotFoundError(`No flight: ${flightNumber}`);
  }
}

module.exports = Flight;
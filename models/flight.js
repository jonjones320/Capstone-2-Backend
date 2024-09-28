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
   * - id
   * - tripId
   * - flightOfferId
   * - outboundFlightNumber
   * - inboundFlightNumber
   *
   * Returns [{ id, tripId, flightOfferId, outboundFlightNumber, inboundFlightNumber }, ...]
   * */
  static async findAll({ id, tripId, flightOfferId, outboundFlightNumber, inboundFlightNumber } = {}) {
    let query = `SELECT id,
                        trip_id AS "tripId",
                        flight_offer_id AS flightOfferId,
                        outbound_flight_number AS outboundFlightNumber,
                        inbound_flight_number AS inboundFlightNumber
                 FROM flights`;
    let whereExpressions = [];
    let queryValues = [];

    if (id !== undefined) {
        queryValues.push(id);
        whereExpressions.push(`id = $${queryValues.length}`);
    };
    if (tripId !== undefined) {
      queryValues.push(tripId);
      whereExpressions.push(`trip_id = $${queryValues.length}`);
    };
    if (flightOfferId !== undefined) {
      queryValues.push(flightOrfferId);
      whereExpressions.push(`flightOrderId = $${queryValues.length}`)
    }
    if (outboundFlightNumber !== undefined) {
      queryValues.push(outboundFlightNumber);
      whereExpressions.push(`outboundFlightNumber = $${queryValues.length}`);
    };
    if (inboundFlightNumber !== undefined) {
      queryValues.push(inboundFlightNumber);
      whereExpressions.push(`inboundFlightNumber = $${queryValues.length}`);
    };

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    };

    query += " ORDER BY id";
    const flightsRes = await db.query(query, queryValues);
    return flightsRes.rows;
  }

  /** Given a flight id, return data about flight.
   *
   * Returns { id, tripId, flightOfferId, outboundFlightNumber, inboundFlightNumber }
   *
   * Throws NotFoundError if not found.
   **/
  static async get(id) {
    const flightRes = await db.query(
              `SELECT id,
                      trip_id AS "tripId",
                      flight_offer_id AS "flightOfferId",
                      outboundFlightNumber,
                      inboundFlightNumber
               FROM flights
               WHERE id = $1`, [id]);

    const flight = flightRes.rows[0];

    if (!flight) throw new NotFoundError(`No flight information: ${id}`);

    return flight;
  }

  /** Update flight data with `data`.
   *
   * This is a "partial update" --- only changes provided fields.
   *
   * Data can include: { tripId, outboundFlightNumber, inboundFlightNumber }
   *
   * Returns { flightNumber, tripId, outboundFlightNumber, inboundFlightNumber }
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          outboundFlightNumber: "outboundFlightNumber",
          inboundFlightNumber: "inboundFlightNumber"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE flights 
                          SET ${setCols} 
                          WHERE id = ${idVarIdx} 
                          RETURNING id, 
                                    trip_id AS "tripId",
                                    flight_offer_id AS "flightOfferId",
                                    outboundFlightNumber,
                                    inboundFlightNumber`;
    const result = await db.query(querySql, [...values, id]);
    const flight = result.rows[0];

    if (!flight) throw new NotFoundError(`No flight: ${id}`);

    return flight;
  }

  /** Delete given flight from database; returns undefined.
   *
   * Throws NotFoundError if flight not found.
   **/
  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM flights
           WHERE id = $1
           RETURNING id`, [id]);
    const flight = result.rows[0];

    if (!flight) throw new NotFoundError(`No flight: ${id}`);
  }
}

module.exports = Flight;
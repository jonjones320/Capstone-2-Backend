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
  static async create({ tripId, amadeusOrderId, flightDetails }) {
    const result = await db.query(
      `INSERT INTO flights (trip_id, 
                            amadeus_order_id, 
                            flight_details)
       VALUES ($1, $2, $3)
       RETURNING id, 
                trip_id AS "tripId", 
                amadeus_order_id AS "amadeusOrderId", 
                flight_details AS "flightDetails"`,
      [tripId, amadeusOrderId, flightDetails]
    );
    return result.rows[0];
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
  static async findAll({ id, tripId, amadeusOrderId } = {}) {
    let query = `SELECT id,
                        trip_id AS "tripId",
                        amadeus_order_id AS "amadeusOrderId",
                        flight_details AS "flightDetails"
                 FROM flights`;
    let whereExpressions = [];
    let queryValues = [];
  
    if (id !== undefined) {
      queryValues.push(id);
      whereExpressions.push(`id = $${queryValues.length}`);
    }
    if (tripId !== undefined) {
      queryValues.push(tripId);
      whereExpressions.push(`trip_id = $${queryValues.length}`);
    }
    if (amadeusOrderId !== undefined) {
      queryValues.push(amadeusOrderId);
      whereExpressions.push(`amadeus_order_id = $${queryValues.length}`);
    }
  
    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }
    query += " ORDER BY id";
  
    const flightsRes = await db.query(query, queryValues);
    return flightsRes.rows;
  }

  /** Given a trip id, return data about that trip's flights.
   *
   * Returns { id, tripId, flightOfferId, outboundFlightNumber, inboundFlightNumber }
   *
   * Throws NotFoundError if not found.
   **/
  static async getFlightsByTrip(tripId) {
    const result = await db.query(
      `SELECT id, 
              trip_id AS "tripId", 
              amadeus_order_id AS "amadeusOrderId", 
              flight_details AS "flightDetails"
       FROM flights
       WHERE trip_id = $1`,
      [tripId]
    );
    return result.rows;
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
          outboundFlightNumber: "outbound_flight_number",
          inboundFlightNumber: "inbound_flight_number"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE flights 
                          SET ${setCols} 
                          WHERE id = ${idVarIdx} 
                          RETURNING id, 
                                    trip_id AS "tripId",
                                    flight_offer_id AS "flightOfferId",
                                    outbound_flight_number AS "outboundFlightNumber",
                                    inbound_flight_number AS "inboundFlightNumber"`;
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
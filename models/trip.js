"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for trips. */

class Trip {
  /** Create a trip (from data), update db, return new trip data.
   *
   * data should be { username, origin, destination, startDate, endDate, budget }
   *
   * Returns { tripId, username, origin, destination, startDate, endDate, budget }
   **/
  static async create({ name, username, origin, destination, startDate, endDate, budget }) {
    // console.log("trip.js - Trip.create: NAME: ", name);
    const result = await db.query(
          `INSERT INTO trips (name,
                              username,
                              origin,
                              destination,
                              start_date,
                              end_date,
                              budget)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING trip_id AS "tripId", 
                      name, 
                      username, 
                      origin,
                      destination, 
                      start_date AS "startDate", 
                      end_date AS "endDate", 
                      budget`,
        [name, username, origin, destination, startDate, endDate, budget]);
    let trip = result.rows[0];
    
    return trip;
  }

  /** Find all trips (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - name
   * - username
   * - origin
   * - destination
   *
   * Returns [{ tripId, username, origin, destination, startDate, endDate, budget }, ...]
   * */
  static async findAll({ name, username, origin, destination, startDate, endDate } = {}) {
    let query = `SELECT name,
                        trip_id AS "tripId",
                        username,
                        origin,
                        destination,
                        start_date AS "startDate",
                        end_date AS "endDate",
                        budget
                 FROM trips`;
    let whereExpressions = [];
    let queryValues = [];

    if (name) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }
    if (username) {
      queryValues.push(`%${username}%`);
      whereExpressions.push(`username ILIKE $${queryValues.length}`);
    }
    if (origin) {
      queryValues.push(`%${origin}%`);
      whereExpressions.push(`location ILIKE $${queryValues.length}`);
    }
    if (destination) {
      queryValues.push(`%${destination}%`);
      whereExpressions.push(`location ILIKE $${queryValues.length}`);
    }
    if (startDate) {
      queryValues.push(startDate);
      whereExpressions.push(`start_date >= $${queryValues.length}`);
    }
    if (endDate) {
      queryValues.push(endDate);
      whereExpressions.push(`end_date <= $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    query += " ORDER BY start_date";
    const tripsRes = await db.query(query, queryValues);
    return tripsRes.rows;
  }

  /** Given a trip id, return data about trip.
   *
   * Returns { tripId, name, username, origin, destination, startDate, endDate, budget }
   *
   * Throws NotFoundError if not found.
   **/
  static async get(id) {
    const tripRes = await db.query(
          `SELECT trip_id AS "tripId",
                  name,
                  username,
                  origin,
                  destination,
                  start_date AS "startDate",
                  end_date AS "endDate",
                  budget
           FROM trips
           WHERE trip_id = $1`, [id]);

    const trip = tripRes.rows[0];

    if (!trip) throw new NotFoundError(`No trip: ${id}`);

    return trip;
  }

  /** Update trip data with `data`.
   *
   * This is a "partial update" --- only changes provided fields.
   *
   * Data can include: { name, origin, destination, startDate, endDate, budget }
   *
   * Returns { tripId, name, username, origin, destination, startDate, endDate, budget }
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          origin: "origin",
          destination: "destination",
          startDate: "start_date",
          endDate: "end_date"
        });
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE trips
                      SET ${setCols} 
                      WHERE trip_id = ${idVarIdx}
                      RETURNING trip_id AS "tripId",
                                name,
                                username,
                                origin,
                                destination,
                                start_date AS "startDate",
                                end_date AS "endDate",
                                budget`;
    const result = await db.query(querySql, [...values, id]);
    const trip = result.rows[0];

    if (!trip) throw new NotFoundError(`No trip: ${id}`);

    return trip;
  }

  /** Delete given trip from database; returns undefined.
   *
   * Throws NotFoundError if trip not found.
   **/
  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM trips
           WHERE trip_id = $1
           RETURNING trip_id`, [id]);
    const trip = result.rows[0];

    if (!trip) throw new NotFoundError(`No trip: ${id}`);
  }
}

module.exports = Trip;
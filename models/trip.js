"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for trips. */

class Trip {
  /** Create a trip (from data), update db, return new trip data.
   *
   * data should be { username, locationId, startDate, endDate, budget }
   *
   * Returns { tripId, username, locationId, startDate, endDate, budget }
   **/
  static async create(data) {
    const result = await db.query(
          `INSERT INTO trips (name,
                              username,
                              location_id,
                              start_date,
                              end_date,
                              budget)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING trip_id AS "tripId", username, location_id AS "locationId", start_date AS "startDate", end_date AS "endDate", budget`,
        [
          data.name,
          data.username,
          data.locationId,
          data.startDate,
          data.endDate,
          data.budget,
        ]);
    let trip = result.rows[0];

    return trip;
  }

  /** Find all trips (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - name
   * - username
   * - locationId
   *
   * Returns [{ tripId, username, locationId, startDate, endDate, budget }, ...]
   * */
  static async findAll({ name, username, locationId } = {}) {
    let query = `SELECT name,
                        trip_id AS "tripId",
                        username,
                        location_id AS "locationId",
                        start_date AS "startDate",
                        end_date AS "endDate",
                        budget
                 FROM trips`;
    let whereExpressions = [];
    let queryValues = [];

    if (name !== undefined) {
      queryValues.push(name);
      whereExpressions.push(`name = $${queryValues.length}`);
    }

    if (username !== undefined) {
      queryValues.push(username);
      whereExpressions.push(`username = $${queryValues.length}`);
    }

    if (locationId !== undefined) {
      queryValues.push(locationId);
      whereExpressions.push(`location_id = $${queryValues.length}`);
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
   * Returns { tripId, name, username, locationId, startDate, endDate, budget }
   *
   * Throws NotFoundError if not found.
   **/
  static async get(id) {
    const tripRes = await db.query(
          `SELECT trip_id AS "tripId",
                  name,
                  username,
                  location_id AS "locationId",
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
   * Data can include: { name, locationId, startDate, endDate, budget }
   *
   * Returns { tripId, name, username, locationId, startDate, endDate, budget }
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE trips
                      SET ${setCols} 
                      WHERE trip_id = ${idVarIdx}
                      RETURNING trip_id AS "tripId",
                                name,
                                username,
                                location_id AS "locationId",
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
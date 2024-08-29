"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for trips. */

class Trip {
  /** Create a trip (from data), update db, return new trip data.
   *
   * data should be { userId, locationId, startDate, endDate, budget }
   *
   * Returns { tripId, userId, locationId, startDate, endDate, budget }
   **/
  static async create(data) {
    const result = await db.query(
          `INSERT INTO trips (user_id,
                              location_id,
                              start_date,
                              end_date,
                              budget)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING trip_id AS "tripId", user_id AS "userId", location_id AS "locationId", start_date AS "startDate", end_date AS "endDate", budget`,
        [
          data.userId,
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
   * - userId
   * - locationId
   *
   * Returns [{ tripId, userId, locationId, startDate, endDate, budget }, ...]
   * */
  static async findAll({ userId, locationId } = {}) {
    let query = `SELECT trip_id AS "tripId",
                        user_id AS "userId",
                        location_id AS "locationId",
                        start_date AS "startDate",
                        end_date AS "endDate",
                        budget
                 FROM trips`;
    let whereExpressions = [];
    let queryValues = [];

    if (userId !== undefined) {
      queryValues.push(userId);
      whereExpressions.push(`user_id = $${queryValues.length}`);
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
   * Returns { tripId, userId, locationId, startDate, endDate, budget }
   *
   * Throws NotFoundError if not found.
   **/
  static async get(id) {
    const tripRes = await db.query(
          `SELECT trip_id AS "tripId",
                  user_id AS "userId",
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
   * Data can include: { locationId, startDate, endDate, budget }
   *
   * Returns { tripId, userId, locationId, startDate, endDate, budget }
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
                                user_id AS "userId", 
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
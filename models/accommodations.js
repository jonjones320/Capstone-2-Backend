"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for accommodations. */

class Accommodation {
  /** Create an accommodation (from data), update db, return new accommodation data.
   *
   * data should be { tripId, name, checkIn, checkOut }
   *
   * Returns { accommodationId, tripId, name, checkIn, checkOut }
   **/
  static async create(data) {
    const result = await db.query(
          `INSERT INTO accommodations (trip_id,
                                       name,
                                       check_in,
                                       check_out)
           VALUES ($1, $2, $3, $4)
           RETURNING accommodation_id AS "accommodationId", trip_id AS "tripId", name, check_in AS "checkIn", check_out AS "checkOut"`,
        [
          data.tripId,
          data.name,
          data.checkIn,
          data.checkOut,
        ]);
    let accommodation = result.rows[0];

    return accommodation;
  }

  /** Find all accommodations (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - tripId
   *
   * Returns [{ accommodationId, tripId, name, checkIn, checkOut }, ...]
   * */
  static async findAll({ tripId } = {}) {
    let query = `SELECT accommodation_id AS "accommodationId",
                        trip_id AS "tripId",
                        name,
                        check_in AS "checkIn",
                        check_out AS "checkOut"
                 FROM accommodations`;
    let whereExpressions = [];
    let queryValues = [];

    if (tripId !== undefined) {
      queryValues.push(tripId);
      whereExpressions.push(`trip_id = $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    query += " ORDER BY name";
    const accommodationsRes = await db.query(query, queryValues);
    return accommodationsRes.rows;
  }

  /** Given an accommodation id, return data about accommodation.
   *
   * Returns { accommodationId, tripId, name, checkIn, checkOut }
   *
   * Throws NotFoundError if not found.
   **/
  static async get(id) {
    const accommodationRes = await db.query(
          `SELECT accommodation_id AS "accommodationId",
                  trip_id AS "tripId",
                  name,
                  check_in AS "checkIn",
                  check_out AS "checkOut"
           FROM accommodations
           WHERE accommodation_id = $1`, [id]);

    const accommodation = accommodationRes.rows[0];

    if (!accommodation) throw new NotFoundError(`No accommodation: ${id}`);

    return accommodation;
  }

  /** Update accommodation data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { name, checkIn, checkOut }
   *
   * Returns { accommodationId, tripId, name, checkIn, checkOut }
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE accommodations 
                      SET ${setCols} 
                      WHERE accommodation_id = ${idVarIdx} 
                      RETURNING accommodation_id AS "accommodationId", 
                                trip_id AS "tripId", 
                                name, 
                                check_in AS "checkIn", 
                                check_out AS "checkOut"`;
    const result = await db.query(querySql, [...values, id]);
    const accommodation = result.rows[0];

    if (!accommodation) throw new NotFoundError(`No accommodation: ${id}`);

    return accommodation;
  }

  /** Delete given accommodation from database; returns undefined.
   *
   * Throws NotFoundError if accommodation not found.
   **/
  static async remove(id) {
    const result = await db.query(
          `DELETE
           FROM accommodations
           WHERE accommodation_id = $1
           RETURNING accommodation_id`, [id]);
    const accommodation = result.rows[0];

    if (!accommodation) throw new NotFoundError(`No accommodation: ${id}`);
  }
}

module.exports = Accommodation;
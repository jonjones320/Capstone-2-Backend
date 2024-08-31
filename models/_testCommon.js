const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM accommodations");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM flights");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM trips");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO users(username,
                      password,
                      first_name,
                      last_name,
                      email,
                      is_admin)
    VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com', false),
           ('u2', $2, 'U2F', 'U2L', 'u2@email.com', false),
           ('a1', $3, 'A1F', 'A1L', 'a1@email.com', true)
    RETURNING username`,
  [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
  ]);

  await db.query(`
    INSERT INTO trips(trip_id, 
                      name, 
                      username, 
                      location_id, 
                      start_date, 
                      end_date, 
                      budget)
    VALUES ('1', 'Trip1', 'u1', 'l1', '2026-01-01', '2026-01-10', 1000),
           ('2', 'Trip2', 'u1', 'l2', '2026-02-01', '2026-02-10', 2000),
           ('3', 'Trip3', 'u2', 'l3', '2026-03-01', '2026-03-10', 3000)`);

  await db.query(`
    INSERT INTO flights (flight_number, trip_id, origin, destination)
    VALUES ('A123', '1', 'SFO', 'JFK'), 
           ('B456', '1', 'RDU', 'SEA'),
           ('C789', '2', 'DEN', 'LAX')
    RETURNING flight_number`);

  await db.query(`
    INSERT INTO accommodations (accommodation_id, trip_id, name, check_in, check_out)
    VALUES (91, 1, 'Hotel1', '2026-01-01', '2026-01-10'),
           (92, 2, 'Hotel2', '2026-01-01', '2026-01-10'),
           (93, 3, 'Hotel3', '2026-02-01', '2026-02-10')`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};
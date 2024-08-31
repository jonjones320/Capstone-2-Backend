const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");


async function commonBeforeAll() {
  // Truncate tables to remove all existing rows and reset primary keys
  await db.query("TRUNCATE flights, trips, users RESTART IDENTITY CASCADE");

  // Insert users
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

  // Insert trips
  await db.query(`
    INSERT INTO trips(name, 
                      username, 
                      location_id, 
                      start_date, 
                      end_date, 
                      budget)
    VALUES ('Trip1', 'u1', 'l1', '2026-01-01', '2026-01-10', 1000),
           ('Trip2', 'u1', 'l2', '2026-02-01', '2026-02-10', 2000),
           ('Trip3', 'u2', 'l3', '2026-03-01', '2026-03-10', 3000)`);

  // Insert flights
  await db.query(`
    INSERT INTO flights (flight_number, trip_id, origin, destination)
    VALUES ('A123', '1', 'SFO', 'JFK'), 
           ('B456', '2', 'RDU', 'SEA'),
           ('C789', '3', 'DEN', 'LAX')
    RETURNING flight_number`);

  // Insert accommodations
  await db.query(`
    INSERT INTO accommodations (trip_id, name, check_in, check_out)
    VALUES (1, 'Hotel1', '2026-01-01', '2026-01-10'),
           (2, 'Hotel2', '2026-01-01', '2026-01-10'),
           (3, 'Hotel3', '2026-02-01', '2026-02-10')`);
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
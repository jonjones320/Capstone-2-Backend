const bcrypt = require("bcrypt");
const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM trips");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM flights");

  await db.query(`
    INSERT INTO trips(trip_id, 
                      name, 
                      username, 
                      location_id, 
                      start_date, 
                      end_date, 
                      budget)
    VALUES ('t1', 'Trip1', 'u1', 'l1', '2022-01-01', '2022-01-10', 1000),
           ('t2', 'Trip2', 'u1', 'l2', '2022-02-01', '2022-02-10', 2000),
           ('t3', 'Trip3', 'u2', 'l3', '2022-03-01', '2022-03-10', 3000)`);

  await db.query(`
    INSERT INTO flights (flight_number, trip_id, origin, destination)
    VALUES ('A123', 't1', 'SFO', 'JFK'), 
           ('B456', 't1', 'RDU', 'SEA'),
           ('C789', 't2', 'DEN', 'LAX')
    RETURNING flight_number`);

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
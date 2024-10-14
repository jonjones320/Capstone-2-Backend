// Migrates the database from local to externally hosted.

const db = require('./db');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const sqlFile = fs.readFileSync(path.join(__dirname, 'ranner-schema.sql'), 'utf8');
  try {
    await db.query(sqlFile);
    console.log('Migrations completed successfully');
  } catch (err) {
    console.error('Error running migrations:', err);
  } finally {
    await db.end();
  }
}

runMigrations();
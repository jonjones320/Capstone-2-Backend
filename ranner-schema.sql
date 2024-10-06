-- Initialize Ranner database --

-- User Table
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50), 
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Trip Table
CREATE TABLE trips (
    trip_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) REFERENCES users(username) ON DELETE CASCADE,
    origin VARCHAR(50),
    destination VARCHAR(50),
    start_date VARCHAR(35) NOT NULL,
    end_date VARCHAR(35) NOT NULL,
    passengers INTEGER,
    CHECK (start_date < end_date)
);

-- Flight Table
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(trip_id) ON DELETE CASCADE,
    amadeus_order_id VARCHAR(255) NOT NULL,
    flight_details JSONB
);

-- Accommodation Table
CREATE TABLE accommodations (
    accommodation_id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(trip_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    check_in DATE,
    check_out DATE
);

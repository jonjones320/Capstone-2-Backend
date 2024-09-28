-- Testing seed for Ranner


-- both test users have the password "password"
INSERT INTO users (username, password, first_name, last_name, email, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'joel@joelburton.com',
        FALSE),
        ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'joel@admin.com',
        TRUE);


INSERT INTO trips (name, username, origin, destination, start_date, end_date, passengers)
VALUES ('New York Trip', 'testuser', 'NYC', 'RDU', '2025-01-01', '2025-01-10', 1),
       ('Los Angeles Trip', 'testuser', 'LAX', 'SLC', '2025-02-01', '2025-02-05', 1),
       ('San Francisco Trip', 'testadmin', 'SFO', 'JFK', '2025-03-01', '2025-03-07', 2);


INSERT INTO flights (trip_id, flight_offer_id, outbound_flight_number, inbound_flight_number )
VALUES (1, 1, 'AA123', 'AA321' ),
       (2, 2, 'AA789', 'AA987' ),
       (3, 3, 'DL456', 'DL654');

INSERT INTO accommodations (trip_id, name, check_in, check_out)
VALUES (1, 'Hotel 1', '2025-01-01', '2025-01-10'),
       (2, 'Hotel 2', '2025-02-01', '2025-02-05'),
       (3, 'Hotel 3', '2025-03-01', '2025-03-07');

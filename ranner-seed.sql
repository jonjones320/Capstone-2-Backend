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


INSERT INTO trips (name, username, origin, destination, start_date, end_date, budget)
VALUES ('New York Trip', 'testuser', 'NYC', 'RDU', '2025-01-01', '2025-01-10', 1000.00),
       ('Los Angeles Trip', 'testuser', 'LAX', 'SLC', '2025-02-01', '2025-02-05', 1500.00),
       ('San Francisco Trip', 'testadmin', 'SFO', 'JFK', '2025-03-01', '2025-03-07', 2000.00);


INSERT INTO flights (flight_number, trip_id, origin, destination)
VALUES ('AA123', 1, 'JFK', 'LAX'),
       ('AA124', 2, 'LAX', 'JFK'),
       ('DL456', 3, 'LAX', 'SFO');

INSERT INTO accommodations (trip_id, name, check_in, check_out)
VALUES (1, 'Hotel 1', '2025-01-01', '2025-01-10'),
       (2, 'Hotel 2', '2025-02-01', '2025-02-05'),
       (3, 'Hotel 3', '2025-03-01', '2025-03-07');

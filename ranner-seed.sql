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

INSERT INTO flights (trip_id, amadeus_order_id, flight_details)
VALUES (1, 
        'eJzTd9f3NjIJMna3BAA8vgQ1', 
        '{
          "type": "flight-order", 
          "id": "eJzTd9f3NjIJMna3BAA8vgQ1", 
          "queuingOfficeId": "NCE4D31AB", 
          "associatedRecords": [{
            "reference": "ABCDEF", 
            "creationDate": "2023-06-14T12:00:00", 
            "originSystemCode": "GDS", 
            "flightOfferId": "1"
            }], 
          "flightOffers": [{
            "type": "flight-offer", 
            "id": "1", 
            "source": "GDS", 
            "instantTicketingRequired": false, 
            "nonHomogeneous": false, 
            "oneWay": false, 
            "lastTicketingDate": "2025-01-01", 
            "numberOfBookableSeats": 2, 
            "itineraries": [{
              "duration": "PT5H20M", 
              "segments": [{
                "departure": {
                  "iataCode": "NYC", 
                  "terminal": "4", "at": "2025-01-01T08:00:00"
                  }, 
                "arrival": {
                  "iataCode": "RDU", 
                  "terminal": "2", "at": "2025-01-01T13:20:00"
                  }, 
                "carrierCode": "AA", 
                "number": "123", 
                "aircraft": {"code": "321"}, 
                "operating": {"carrierCode": "AA"}, 
                "duration": "PT5H20M", 
                "id": "1", 
                "numberOfStops": 0, 
                "blacklistedInEU": false
                }]
              }], 
            "price": {
              "currency": "USD", 
              "total": "364.00", 
              "base": "300.00", 
              "fees": [
              {"amount": "0.00", "type": "SUPPLIER"}, 
              {"amount": "0.00", "type": "TICKETING"}
              ], 
              "grandTotal": "364.00"
              }, 
            "pricingOptions": {
              "fareType": ["PUBLISHED"], 
              "includedCheckedBagsOnly": true
              }, 
            "validatingAirlineCodes": ["AA"], 
            "travelerPricings": [{
              "travelerId": "1", 
              "fareOption": "STANDARD", 
              "travelerType": "ADULT", 
              "price": {
                "currency": "USD", 
                "total": "364.00", 
                "base": "300.00"
                }, 
              "fareDetailsBySegment": [{
                "segmentId": "1", 
                "cabin": "ECONOMY", 
                "fareBasis": "YLRTRNF", 
                "brandedFare": "ECONOMY", 
                "class": "Y", 
                "includedCheckedBags": {"quantity": 1}
                }]
              }]
            }]
          }'
        ),
       (2, 
        'eJzTd9f3NjIJMna3BAA8vgQ2', 
        '{
          "type": "flight-order", 
          "id": "eJzTd9f3NjIJMna3BAA8vgQ2", 
          "queuingOfficeId": "NCE4D31AB", 
          "associatedRecords": [{
            "reference": "GHIJKL", 
            "creationDate": "2023-06-14T13:00:00", 
            "originSystemCode": "GDS", 
            "flightOfferId": "2"
            }], 
          "flightOffers": [{
            "type": "flight-offer", 
            "id": "2", 
            "source": "GDS", 
            "instantTicketingRequired": false, 
            "nonHomogeneous": false, 
            "oneWay": false, 
            "lastTicketingDate": "2025-02-01", 
            "numberOfBookableSeats": 1, 
            "itineraries": [{
              "duration": "PT2H30M", 
              "segments": [{
                "departure": {"iataCode": "LAX", "terminal": "4", "at": "2025-02-01T10:00:00"}, 
                "arrival": {"iataCode": "SLC", "terminal": "2", "at": "2025-02-01T12:30:00"}, 
                "carrierCode": "DL", 
                "number": "789", 
                "aircraft": {"code": "737"}, 
                "operating": {"carrierCode": "DL"}, 
                "duration": "PT2H30M", 
                "id": "2", 
                "numberOfStops": 0, 
                "blacklistedInEU": false
                }]
              }], 
              "price": {
                "currency": "USD", 
                "total": "250.00", 
                "base": "200.00", 
                "fees": [
                  {"amount": "0.00", "type": "SUPPLIER"}, 
                  {"amount": "0.00", "type": "TICKETING"}
                  ], 
                "grandTotal": "250.00"
                }, 
              "pricingOptions": {
                "fareType": ["PUBLISHED"], 
                "includedCheckedBagsOnly": true
                }, 
              "validatingAirlineCodes": ["DL"], 
              "travelerPricings": [{
                "travelerId": "1", 
                "fareOption": "STANDARD", 
                "travelerType": "ADULT", 
                "price": {
                  "currency": "USD", 
                  "total": "250.00", 
                  "base": "200.00"
                  }, 
                "fareDetailsBySegment": [{
                  "segmentId": "2", 
                  "cabin": "ECONOMY", 
                  "fareBasis": "KLRTRNF", 
                  "brandedFare": "ECONOMY", 
                  "class": "K", 
                  "includedCheckedBags": {"quantity": 1}
                  }]
                }]
              }]
            }'
          ),
       (3, 
        'eJzTd9f3NjIJMna3BAA8vgQ3', 
        '{
          "type": "flight-order", 
          "id": "eJzTd9f3NjIJMna3BAA8vgQ3", 
          "queuingOfficeId": "NCE4D31AB", 
          "associatedRecords": [{
            "reference": "MNOPQR", 
            "creationDate": "2023-06-14T14:00:00", 
            "originSystemCode": "GDS", 
            "flightOfferId": "3"
            }], 
          "flightOffers": [{
            "type": "flight-offer", 
            "id": "3", 
            "source": "GDS", 
            "instantTicketingRequired": false, 
            "nonHomogeneous": false, 
            "oneWay": false, 
            "lastTicketingDate": "2025-03-01", 
            "numberOfBookableSeats": 2, 
            "itineraries": [{
              "duration": "PT6H20M", 
              "segments": [{
                "departure": {"iataCode": "SFO", "terminal": "2", "at": "2025-03-01T09:00:00"}, 
                "arrival": {"iataCode": "JFK", "terminal": "4", "at": "2025-03-01T15:20:00"}, 
                "carrierCode": "UA", 
                "number": "456", 
                "aircraft": {"code": "777"}, 
                "operating": {"carrierCode": "UA"}, 
                "duration": "PT6H20M", 
                "id": "3", 
                "numberOfStops": 0, 
                "blacklistedInEU": false
                }]
              }], 
            "price": {
              "currency": "USD", 
              "total": "450.00", 
              "base": "400.00", 
              "fees": [
                {"amount": "0.00", "type": "SUPPLIER"}, 
                {"amount": "0.00", "type": "TICKETING"}
                ], 
              "grandTotal": "450.00"
              }, 
            "pricingOptions": {
              "fareType": ["PUBLISHED"], 
              "includedCheckedBagsOnly": true}, 
              "validatingAirlineCodes": ["UA"], 
              "travelerPricings": [{
                "travelerId": "1", 
                "fareOption": "STANDARD", 
                "travelerType": "ADULT", 
                "price": {
                  "currency": "USD", 
                  "total": "450.00", 
                  "base": "400.00"
                  }, 
                "fareDetailsBySegment": [{
                  "segmentId": "3", 
                  "cabin": "ECONOMY", 
                  "fareBasis": "WLRTRNF", 
                  "brandedFare": "ECONOMY", 
                  "class": "W", 
                  "includedCheckedBags": {"quantity": 1}
                  }]
                }]
              }]
            }'
          );

INSERT INTO accommodations (trip_id, name, check_in, check_out)
VALUES (1, 'Hotel 1', '2025-01-01', '2025-01-10'),
       (2, 'Hotel 2', '2025-02-01', '2025-02-05'),
       (3, 'Hotel 3', '2025-03-01', '2025-03-07');
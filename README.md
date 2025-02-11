******** cinema-tickets-javascript task ********

This project contains a working implementation of a `TicketService` that:

- Considers all the business rules, constraints & assumptions.

- Calculates the correct amount for the requested tickets and makes a payment request to the `TicketPaymentService`.

- Calculates the correct no of seats to reserve and makes a seat reservation request to the `SeatReservationService`.

- Rejects any invalid ticket purchase requests.


********** TESTING ************

Run `npm install`: to get all the dependencies needed to test the application.


Run `npm test`


After every test, log data can be found in `app.log` file under `log` directory.


Test Scenarios:

    √ should throw an error for an invalid account ID


    √ should throw an error if noOfTickets is 0


    √ should throw an error if noOfTickets is not an integer


    √ should throw an error if noOfTickets is negative


    √ should throw an error if an invalid ticket request is passed


    √ should throw an error if more than 25 tickets are purchased


    √ should throw an error if either an infant or child ticket is purchased without an adult ticket


    √ should throw an error if the number of infant tickets purchased is higher than adult tickets


    √ should call ticketPaymentService with correct amount
    
               
    √ should call SeatReservationService with correct number of seats
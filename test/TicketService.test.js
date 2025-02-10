import TicketService from "../src/pairtest/TicketService";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException";

// mock ticket payment and seat reservation services
const mockTicketPaymentService = { makePayment: jest.fn() };
const mockSeatReservationService = { reserveSeat: jest.fn() };

// create a new TicketService instance
const ticketService = new TicketService(mockTicketPaymentService, mockSeatReservationService);


describe('TicketService', ()=> {

    // reset mocks before each test
    beforeEach(()=> {
        jest.clearAllMocks();
    });


    // Test for validateAccountId method
    test('should throw an error for an invalid account ID', () => {

        const request = new TicketTypeRequest('ADULT', 1);

        expect(() => ticketService.purchaseTickets(-6, request))
            .toThrow(new InvalidPurchaseException("INVALID_ACCOUNT_ID"));

        expect(() => ticketService.purchaseTickets(0, request))
            .toThrow(new InvalidPurchaseException("INVALID_ACCOUNT_ID"));

        expect(() => ticketService.purchaseTickets('vic', request))
            .toThrow(new InvalidPurchaseException("INVALID_ACCOUNT_ID"));
    });


    // Test for when noOfTickets is 0
    test('should throw an error if noOfTickets is 0', () => {

        expect(() => new TicketTypeRequest('ADULT', 0))
          .toThrow(new InvalidPurchaseException("INVALID_TICKET_COUNT"));
      });

      // Test for when noOfTickets is not an integer
    test('should throw an error if noOfTickets is not an integer', () => {

        expect(() => new TicketTypeRequest('ADULT', 'vic'))
          .toThrow(new InvalidPurchaseException("INVALID_TICKET_COUNT"));
      });

      // Test for when noOfTickets is negative
    test('should throw an error if noOfTickets is negative', () => {

        expect(() => new TicketTypeRequest('ADULT', -5))
          .toThrow(new InvalidPurchaseException("INVALID_TICKET_COUNT"));
      });



    // Test for validateTicketRequestFormatTicket method
    test('should throw an error if an invalid ticket request is passed', () => {
        expect(() => ticketService.purchaseTickets(25, { type: 'ADULT', noOfTickets: 2 }))
        .toThrow(new InvalidPurchaseException("INVALID_TICKET_REQUEST"));
    });


    // Test for validateTicketLimit method
    test('should throw an error if more than 25 tickets are purchased', ()=> {
        const requests = [new TicketTypeRequest('ADULT', 26)];

        expect(()=> ticketService.purchaseTickets(25, ...requests))
            .toThrow(new InvalidPurchaseException("MAX_TICKET_LIMIT"));
    })


    // Test for validateAdultRequirement method
    test('should throw an error if either an infant or child ticket is purchased without an adult ticket', ()=> {
        const infantRequest = new TicketTypeRequest('INFANT', 3);
        const childRequest = new TicketTypeRequest('CHILD', 4);

        expect(()=> ticketService.purchaseTickets(25, infantRequest, childRequest))
            .toThrow(new InvalidPurchaseException("ADULT_REQUIRED"));
    })


    // Test for validateInfantAndAdultTicket method
    test('should throw an error if the number of infant tickets purchased is higher than adult tickets', ()=> {
        const infantRequest = new TicketTypeRequest('INFANT', 13);
        const adultRequest = new TicketTypeRequest('ADULT', 4);

        expect(()=> ticketService.purchaseTickets(25, infantRequest, adultRequest))
            .toThrow(new InvalidPurchaseException("INVALID_INFANT_ADULT_PAIR"));
    })

    
    // Test for successful payment processing with correct amount
    test('should call ticketPaymentService with correct amount', ()=> {
        const requests = [
            new TicketTypeRequest('ADULT', 4), //£100
            new TicketTypeRequest('CHILD', 2), //£30
            new TicketTypeRequest('INFANT', 2) //£0
        ];
        ticketService.purchaseTickets(25, ...requests);

        expect(mockTicketPaymentService.makePayment).toHaveBeenCalledWith(25, 130)
    })
    

    // Test to validate correct seat reservations
    test('should call SeatReservationService with correct number of seats', ()=> {
        const requests = [
            new TicketTypeRequest('ADULT', 4), //4 seats
            new TicketTypeRequest('CHILD', 2), //2 seats
            new TicketTypeRequest('INFANT', 2) //0 seat
        ];
        ticketService.purchaseTickets(25, ...requests);

        expect(mockSeatReservationService.reserveSeat).toHaveBeenCalledWith(25, 6);
    })

})

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
            .toThrow("Invalid account ID. ID must be an integer and greater than 0");

        expect(() => ticketService.purchaseTickets(0, request))
            .toThrow("Invalid account ID. ID must be an integer and greater than 0");

        expect(() => ticketService.purchaseTickets('vic', request))
            .toThrow("Invalid account ID. ID must be an integer and greater than 0");
    });



    // Test for validateTicketRequestFormatTicket method
    test('should throw an error if an invalid ticket request is passed', () => {
        expect(() => ticketService.purchaseTickets(12345, { type: 'ADULT', count: 2 }))
        .toThrow(new InvalidPurchaseException("invalid ticket request format"));
    });


    // Test for validateTicketLimit method
    test('should throw an error if more than 25 tickets are purchased', ()=> {
        const requests = [new TicketTypeRequest('ADULT', 26)];

        expect(()=> ticketService.purchaseTickets(25, ...requests))
            .toThrow(new InvalidPurchaseException("cannot purchase more than 25 tickets"));
    })


    // Test for validateAdultRequirement method
    test('should throw an error if either an infant or child ticket is purchased without an adult ticket', ()=> {
        const infantRequest = new TicketTypeRequest('INFANT', 3);
        const childRequest = new TicketTypeRequest('CHILD', 4);
        const adultRequest = new TicketTypeRequest('ADULT', 0);

        expect(()=> ticketService.purchaseTickets(25, infantRequest, childRequest, adultRequest))
            .toThrow(new InvalidPurchaseException("child or infant tickets cannot be purchased without purchasing an adult ticket"))
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

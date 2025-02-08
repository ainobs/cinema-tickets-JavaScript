import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  
  constructor(ticketPaymentService, seatReservationService) {
    this.ticketPaymentService = ticketPaymentService;
    this.seatReservationService = seatReservationService;
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {

    //validate account ID
    this.#validateAccountId(accountId);

    // ensure all ticket requests are instances of TicketTypeRequest
    this.#validateTicketRequestFormat(ticketTypeRequests);

    //initialise counters
    let infantTickets = 0;
    let childTickets = 0;
    let adultTickets = 0;
    let totalTickets = 0;
    let totalAmountToPay = 0;

    ticketTypeRequests.map(request => {
      switch(request.getTicketType()) {
          case 'INFANT':
            infantTickets += request.getNoOfTickets();
            break;

          case 'CHILD':
            childTickets += request.getNoOfTickets();
            totalAmountToPay += request.getNoOfTickets() * 15;
            break;

          case 'ADULT':
            adultTickets += request.getNoOfTickets();
            totalAmountToPay += request.getNoOfTickets() * 25;
            break;
      }
      totalTickets = request.getNoOfTickets();
    });

    //validate business rules
    this.#validateTicketLimit(totalTickets);
    this.#validateAdultRequirement(infantTickets, childTickets, adultTickets);

    //process payment
    this.ticketPaymentService.makePayment(accountId, totalAmountToPay);

    //reserve seat
    const totalSeatsToAllocate = childTickets + adultTickets;
    this.seatReservationService.reserveSeat(accountId, totalSeatsToAllocate);

  }


  // method to validate account ID
  #validateAccountId (accountId) {
    if(!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("Invalid account ID. ID must be an integer and greater than 0")
    }
  }

   // method to validate ticket request format
  #validateTicketRequestFormat(ticketTypeRequests) {
    ticketTypeRequests.map(request => {
      if (!(request instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException("invalid ticket request format");
      }
    });
  }

  // method to check if totalTickets is above 25
  #validateTicketLimit(totalTickets) {
    if(totalTickets > 25) {
      throw new InvalidPurchaseException("cannot purchase more than 25 tickets");
    }
  }

  // method to check if there is at least one adult ticket when purchasing either infant or child tickets
  #validateAdultRequirement(infantTickets, childTickets, adultTickets) {
    if(adultTickets === 0 && (childTickets > 0 || infantTickets > 0)) {
      throw new InvalidPurchaseException("child or infant tickets cannot be purchased without purchasing an adult ticket")
    }
  }
}

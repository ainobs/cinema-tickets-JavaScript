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
            totalAmountToPay += childTickets * 15;
            break;

          case 'ADULT':
            adultTickets += request.getNoOfTickets();
            totalAmountToPay += adultTickets * 25;
            break;

          default:
              throw new InvalidPurchaseException(`${INVALID_TICKET_REQUEST}: ${request.getTicketType()}`);
      }
      totalTickets = request.getNoOfTickets();
    });

    //validate business rules
    this.#validateTicketLimit(totalTickets);
    this.#validateAdultRequirement(infantTickets, childTickets, adultTickets);
    this.#validateInfantAndAdultTicket(infantTickets, adultTickets);

    //process payment
    this.ticketPaymentService.makePayment(accountId, totalAmountToPay);

    //reserve seat
    const totalSeatsToAllocate = childTickets + adultTickets;
    this.seatReservationService.reserveSeat(accountId, totalSeatsToAllocate);

  }


  // method to validate account ID
  #validateAccountId (accountId) {
    if(!Number.isInteger(accountId) || accountId <= 0) {
      throw new InvalidPurchaseException("INVALID_ACCOUNT_ID");
    }
  }

   // method to validate ticket request format
  #validateTicketRequestFormat(ticketTypeRequests) {
    ticketTypeRequests.map(request => {
      if (!(request instanceof TicketTypeRequest)) {
        throw new InvalidPurchaseException("INVALID_TICKET_REQUEST");
      }
    });
  }

  // method to check if totalTickets is above 25
  #validateTicketLimit(totalTickets) {
    if(totalTickets > 25) {
      throw new InvalidPurchaseException("MAX_TICKET_LIMIT");
    }
  }

  // method to check if there is at least one adult ticket when purchasing either infant or child tickets
  #validateAdultRequirement(infantTickets, childTickets, adultTickets) {
    if(adultTickets === 0 && (childTickets > 0 || infantTickets > 0)) {
      throw new InvalidPurchaseException("ADULT_REQUIRED");
    }
  }

  // method to check if the number of infant tickets is higher than adult tickets
  #validateInfantAndAdultTicket(infantTickets, adultTickets) {
    if(infantTickets > adultTickets) {
      throw new InvalidPurchaseException("INVALID_INFANT_ADULT_PAIR");
    }
  }
}

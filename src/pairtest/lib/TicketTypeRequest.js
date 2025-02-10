/**
 * Immutable Object.
 */

import InvalidPurchaseException from './InvalidPurchaseException.js';

export default class TicketTypeRequest {
  #type;

  #noOfTickets;

  constructor(type, noOfTickets) {
    if (!TicketTypeRequest.#Type.includes(type)) {
      throw new InvalidPurchaseException(`type must be ${TicketTypeRequest.#Type.slice(0, -1).join(', ')}, or ${TicketTypeRequest.#Type.slice(-1)}`);
    }

    if (!Number.isInteger(noOfTickets) || noOfTickets <= 0) {
      throw new InvalidPurchaseException('INVALID_TICKET_COUNT');
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
  }

  getNoOfTickets() {
    return this.#noOfTickets;
  }

  getTicketType() {
    return this.#type;
  }

  static #Type = ['ADULT', 'CHILD', 'INFANT'];
}

export default class ErrorMessageHandler {
    static messages = {
      INVALID_TICKET_REQUEST: "Invalid ticket request format.",
      MAX_TICKET_LIMIT: "Cannot purchase more than 25 tickets.",
      ADULT_REQUIRED: "Child or Infant tickets cannot be purchased without purchasing an Adult ticket.",
      INVALID_TICKET_COUNT: "Number of tickets must be a positive integer greater than 0.",
      INVALID_ACCOUNT_ID: "Invalid account ID. ID must be an integer and greater than 0.",
      INVALID_INFANT_ADULT_PAIR: "Number of infants tickets cannot be more than adult tickets. Each infant will be sitting on an Adult's lap."
    };
  
    static getMessage(key) {
      return this.messages[key] || "An unknown error occurred.";
    }
  }
  
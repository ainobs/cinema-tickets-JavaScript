import ErrorMessageHandler from "./ErrorMessageHandler.js";

export default class InvalidPurchaseException extends Error {
    constructor(messageKey) {
        super(ErrorMessageHandler.getMessage(messageKey));
        this.name = 'InvalidPurchaseException';
    }

}

/**
 * Represents an error which is expected to occur during application flow.
 * Extends the built-in Error class.
 */
export default class ExpectedError extends Error {

    /**
     * Constructor for creating an ExpectedError object with a message and error code.
     *
     * @param {string} message - The error message to be displayed.
     * @param {string} code - The error code associated with the error.
     *
     * @return {ExpectedError} - A new ExpectedError object with the provided message and code.
     */
    constructor(message, code) {

        super(message);

        this.code = code;
        this.name = 'ExpectedError';
    }
}

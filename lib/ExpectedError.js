export default class ExpectedError extends Error {

    constructor(message, code) {

        super(message);

        this.code = code;
        this.name = 'ExpectedError';
    }
}

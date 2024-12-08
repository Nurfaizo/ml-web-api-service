// src/errors/inputError.js
class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InputError";
        this.statusCode = 422;
    }
}

module.exports = InputError;

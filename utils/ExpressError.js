// class ExpressError extends Error{
//     constructor(message, statusCode){
//         super();
//         this.message = message;
//         this.statusCode = statusCode;

//     }
// }

class ExpressError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;
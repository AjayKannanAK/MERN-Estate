//but there are some situationns where there is o error in the system, but we need to throw an error for ex.(password is not long enough)
//so we need to create a function which handles the error which we manually throw

export const errorHandler = (statusCode, message) => {
    const error = new Error(); //The Error object is a built-in JavaScript object that represents an error. 
    error.statusCode = statusCode;
    error.message = message;
    return error;
}
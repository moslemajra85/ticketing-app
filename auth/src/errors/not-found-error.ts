import { CustomError } from "./custom-error.js";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Not Found Route');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: "Not Found ",
      },
    ];
  }
}

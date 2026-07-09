import type { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super();
    // because we are extending a  javascript built-in calss
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serilizeError() {
    return this.errors.map((error) => {
      if (error.type === "field") {
        return {
          message: error.msg,
          field: error.path,
        };
      }

      return {
        message: error.msg,
      };
    });
  }
}

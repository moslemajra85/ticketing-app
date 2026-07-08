import type { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();
    // because we are extending a  javascript built-in calss
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }



}

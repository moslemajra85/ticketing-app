import type { Request, Response, NextFunction } from "express";

import { RequestValidationError } from "../errors/request-validation-error.js";
import { DatabaseConnectionError } from "../errors/database-connection-error.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let formattedErrors = [];
  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({
      errors: err.serilizeError(),
    });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({
      errors: err.serilizeError(),
    });
  }

  res.status(500).send({
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  });
};

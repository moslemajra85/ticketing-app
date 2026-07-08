import type { Request, Response, NextFunction } from "express";

import { RequestValidationError } from "../errors/request-validation-error.js";
import { DatabaseConnectionError } from "../errors/database-connection-error.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof RequestValidationError) {
    return res.status(400).send({
      reason: [...err.errors],
    });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(400).send({
      reason: err.reason,
    });
  }

  res.status(400).send({
    message: "Something went wrong",
  });
};

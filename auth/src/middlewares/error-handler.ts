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
    const formattedErrors = err.errors.map((error) => {
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

    return res.status(400).send({
      errors: formattedErrors,
    });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(500).send({
      errors: [
        {
          message: err.reason,
        },
      ],
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

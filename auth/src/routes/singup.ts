import type { Request, Response } from "express";
import express from "express";
import { validationResult, body } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error.js";
import { DatabaseConnectionError } from "../errors/database-connection-error.js";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({
        min: 4,
        max: 20,
      })
      .withMessage("Password length must be between 4 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    console.log("creating user");
    throw new DatabaseConnectionError();
    res.status(200).send({});
  },
);

export { router as signupRouter };

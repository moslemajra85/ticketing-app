import type { Request, Response } from "express";
import express from "express";
import { validationResult, body } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error.js";
import {BadRequestError} from "../errors/bad-request-error.js"
import { User } from "../models/user.js";

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
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
  
       throw new BadRequestError('Email In User')
     }

    const user = User.build({
      email,
      password,
    });

    await user.save();

    res.status(201).send(user);
  },
);

export { router as signupRouter };
 
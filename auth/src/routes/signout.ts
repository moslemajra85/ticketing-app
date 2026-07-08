import type { Request, Response } from "express";
import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req: Request, res: Response) => {
  console.log("Hi There!");
});

export { router as signoutRouter };

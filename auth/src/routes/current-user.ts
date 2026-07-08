import type { Request, Response } from "express";
import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", (req: Request, res: Response) => {
  console.log("Hi There!");
});

export { router as currentUserRouter };

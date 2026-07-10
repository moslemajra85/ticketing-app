import express from "express";
import mongoose from "mongoose";
import { currentUserRouter } from "./routes/current-user.js";
import { signinRouter } from "./routes/signin.js";
import { signupRouter } from "./routes/signup.js";
import { signoutRouter } from "./routes/signout.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { NotFoundError } from "./errors/not-found-error.js";

const app = express();
app.use(express.json());
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("/{*splat}", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected To MongoDB!")
  } catch (error) {
    console.error("Could Not Connect To MongoDB: ", error);
  }
  app.listen(3000, () => {
    console.log("Auth Service listening on port 3000");
  });
};

start()
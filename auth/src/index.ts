import express from "express";
import { currentUserRouter } from "./routes/current-user.js";
import { signinRouter } from "./routes/singin.js";
import { signupRouter } from "./routes/singup.js";
import { signoutRouter } from "./routes/signout.js";
import {errorHandler} from "./middlewares/error-handler.js"
import {NotFoundError} from "./errors/not-found-error.js"

const app = express();
app.use(express.json());
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all("/{*splat}", () => {
  throw new NotFoundError();
});

app.use(errorHandler)

app.listen(3000, () => {
  console.log("Auth Service listening on port 3000");
});

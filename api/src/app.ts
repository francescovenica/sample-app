import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import postgraphile from "./middleware/postgraphile";
import firebaseMiddleware from "./middleware/firebase";
import loggerMiddleware from "./middleware/logger";
import authMiddleware from "./middleware/auth";

const app = express();

app.use(express.urlencoded({ extended: false }));

// Init firebase
app.use(firebaseMiddleware);

// Overwrite the logger with the user id
app.use(loggerMiddleware);

// Parse user token
app.use(authMiddleware);

// Init postgrepahile
app.use(postgraphile);

// Error handling
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  const logger = req.logger("app");

  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};

  logger.error(error.message);

  // render the error page
  res.status(error.status || 500);
  return res.send({
    // In production we probably want to change this with a generic error
    message: error.message
  });
});

export default app;

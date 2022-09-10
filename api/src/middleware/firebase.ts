import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import config from "../config";

const firebase = admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
});

export default (req: Request, res: Response, next: NextFunction) => {
  req.firebase = firebase;
  return next();
};

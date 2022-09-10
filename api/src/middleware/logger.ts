import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export default (req: Request, res: Response, next: NextFunction) => {
  req.logger = (module: string) =>
    logger(req.headers, req?.account?.uuid, module);
  return next();
};

import { Request, Response, NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  // here we get the authorization token
  const authorization: string | undefined = req?.headers.authorization;

  const token = authorization?.split(" ")?.[1];

  if (!token) {
    return next(new Error("Missing authorization token"));
  }

  try {
    /**
     * here we check the token validity, the second argument check if the token is revoked or not
     */
    req.session = await req.firebase.auth().verifySessionCookie(token, true);
  } catch (error) {
    return next(error);
  }

  return next();
};

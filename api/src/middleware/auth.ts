import { Request, Response, NextFunction } from "express";
import { getDbPool } from "../db";

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

    // let's get the db pool in order to query the current account
    const pool = await getDbPool();

    await pool.query("BEGIN");
    await pool.query(`set role editor`, []);
    await pool.query(
      `select set_config('app.current_account_email', $1, true)`,
      [req.session.email]
    );

    const { rows: users } = await pool.query(
      "SELECT * FROM account WHERE email = $1",
      [req.session.email]
    );

    await pool.query("COMMIT");

    if (users.length) {
      req.account = {
        uuid: users[0].uuid,
        firstName: users[0].first_name,
        lastName: users[0].last_name,
        email: users[0].email,
        createdAt: users[0].created_at,
        updatedAt: users[0].updated_at,
      };
    }
  } catch (error) {
    return next(error);
  }

  return next();
};

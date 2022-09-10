import * as admin from "firebase-admin";
import { CookieSerializeOptions } from "cookie";
import config from "./config";

const { NODE_ENV } = process.env;

export const cookieOptions: CookieSerializeOptions = {
  secure: NODE_ENV === "production",
  maxAge: new Date(-1),
  SameSite: "Lax",
  httpOnly: true,
  path: "/"
};
let auth;

const firebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(config.firebaseAdmin),
    });
  }

  if (!auth) {
    auth = admin.auth();
  }

  return auth as admin.auth.Auth;
};

export default firebase;

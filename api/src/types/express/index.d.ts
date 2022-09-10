declare module Express {
  export interface Request {
    account: Partial<import("../../generated/types").Account>;
    session: import("firebase-admin").auth.DecodedIdToken;
    firebase: import("firebase-admin").app.App;
    logger: (module: string) => import("winston").Logger;
  }
}

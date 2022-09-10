type PostGraphileContext = {
  account: Partial<import("../generated/types").Account>;
  session: import("firebase-admin").auth.DecodedIdToken;
  firebase: import("firebase-admin").app.App;
  pgClient: import("pg").Client;
  logger: (module: string) => import("winston").Logger;
};

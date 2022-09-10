import { Request, Response } from "express";
import { PostGraphileOptions } from "postgraphile";
import { ServiceAccount } from "firebase-admin";

// Here some more possible postgraphile configurations: https://www.graphile.org/postgraphile/usage-library/
const postgraphile: PostGraphileOptions<Request, Response> = {
  subscriptions: false,
  watchPg: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  exportGqlSchemaPath: "schema.graphql",
  graphiql: true,
  enhanceGraphiql: true,
  enableQueryBatching: true,
  legacyRelations: "omit",
  ownerConnectionString: process.env.DATABASE_OWNER_URL,
  allowExplain: true,
};

const firebase: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // replace `\` and `n` character pairs w/ single `\n` character
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

export default {
  postgraphile,
  firebase,
};

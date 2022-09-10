import { ServiceAccount } from "firebase-admin";
import { FirebaseOptions } from "firebase/app";

/**
 * I like to have a config file with all the configuration of the app
 */
const firebaseAdmin: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // replace `\` and `n` character pairs w/ single `\n` character
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

type Config = {
  firebaseClient: FirebaseOptions;
  firebaseAdmin: ServiceAccount;
};

const firebaseClient: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

const config: Config = {
  firebaseClient,
  firebaseAdmin,
};

export default config;

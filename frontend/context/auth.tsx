import React, {
  Dispatch,
  useState,
  createContext,
  SetStateAction,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  setPersistence,
  inMemoryPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  IdTokenResult,
} from "firebase/auth";
import { FirebaseApp, initializeApp } from "firebase/app";

import config from "../config";

export type Authentication = {
  account: AccountByEmailQuery["accountByEmail"];
  session: IdTokenResult;
} | null;

type Credential = {
  email: string;
  password: string;
};

type Props = {
  value: Authentication;
  children: React.ReactNode;
} | null;

export const UserContext = createContext<
  Authentication & {
    setAuthentication: Dispatch<SetStateAction<Authentication>>;
    signUp: (credential: Credential) => void;
    signIn: (credential: Credential) => void;
    signOut: () => void;
  }
>(null);

let app: FirebaseApp;

if (!app) {
  app = initializeApp(config.firebaseClient);
  setPersistence(getAuth(app), inMemoryPersistence);
}

// Helper to access the context
export const useAuthContext = () => React.useContext(UserContext);

const UserContextWrapper = ({ value, children }: Props) => {
  const { push } = useRouter();
  const [authentication, setAuthentication] = useState<Authentication>(value);

  /**
   *
   * Here we signin or signup and then we create the session sending a request
   * to /api/auth/signup
   *
   * @param credential
   * @param isLogin
   */
  const completeLoginRegistration = async (credential: Credential, isLogin) => {
    let firebaseResult;
    const { email, password, ...rest } = credential;

    const auth = getAuth();

    if (isLogin) {
      firebaseResult = await signInWithEmailAndPassword(auth, email, password);
      console.log("signInWithEmailAndPassword");
    } else {
      firebaseResult = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    }

    const idToken = await firebaseResult.user.getIdToken();

    const res = await fetch(`/api/auth/${isLogin ? "signin" : "signup"}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ email, password, ...rest }),
    });

    const data = await res.json();

    setAuthentication((prev) => ({
      ...prev,
      account: data.account,
      session: data.session,
    }));

    push("/todos");
  };

  const signIn = (data) => completeLoginRegistration(data, true);
  const signUp = (data) => completeLoginRegistration(data, false);

  const signOut = async () => {
    /**
     * Here we delete the session cookie
     */
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    /**
     * Here we delete the react state
     */
    setAuthentication({
      account: null,
      session: null,
    });
  };

  // To avoid useless re-renders
  const context = useMemo(
    () => ({
      ...authentication,
      setAuthentication,
      signUp,
      signIn,
      signOut,
    }),
    [authentication]
  );

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

export default UserContextWrapper;

import {
  getAuth,
  confirmPasswordReset as confirmPasswordResetFireBase,
  applyActionCode,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

type Credential = {
  email: string;
  password: string;
};

const auth = getAuth();

export const handleVerifyEmail = (actionCode) => {
  applyActionCode(auth, actionCode);
};
export const confirmPasswordReset = async (actionCode, password) =>
  confirmPasswordResetFireBase(auth, actionCode, password);

export const signIn = async ({
  email,
  password,
}: Credential): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return await userCredential.user;
};

export const signUp = async ({
  email,
  password,
}: Credential): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return await userCredential.user;
};

export const signOut = async () => {
  auth.signOut();
  
  await fetch("/api/auth/logout", {
    method: "POST",
  });
};

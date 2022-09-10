import auth, { cookieOptions } from "../../../lib/firebase-admin";
import { setCookie } from "../../../lib/cookies";

import { initializeApollo } from "../../../lib/apolloClient";
import { CreateAccountDocument } from "../../../generated/hooks";

// Cookie expiration value
const expiresIn = 60 * 60 * 24 * 5 * 1000;

const SignUp = async (req, res) => {
  /**
   * We need to initialize apollo
   */
  const apolloClient = await initializeApollo(null, {
    req,
    res,
  });

  const { authorization } = req.headers;
  const idToken = authorization.split(" ")?.[1];
  const { firstName = "", lastName = "" }: AccountInput = JSON.parse(req.body);

  try {
    /**
     * we need to verify if the token is valid
     */

    const session = await auth().verifyIdToken(idToken, true);

    if (session) {
      /**
       * We can now create a session token to send to the api
       */
      const sessionCookie = await auth().createSessionCookie(idToken, {
        expiresIn,
      });

      /**
       * Here we create the new account, in the api we check if it has already
       * been created, in that case the resolver will return the user
       */
      const {
        data: { createAccount },
      } = await apolloClient.mutate<
        CreateAccountMutation,
        CreateAccountMutationVariables
      >({
        mutation: CreateAccountDocument,
        context: {
          headers: { authorization: `Bearer ${sessionCookie}` },
        },
        variables: {
          input: {
            account: {
              email: session.email,
              firstName,
              lastName,
            },
          },
        },
      });

      /**
       * We can now create the cookie
       */
      setCookie(res, "session", sessionCookie, {
        ...cookieOptions,
        maxAge: expiresIn,
      });

      return res.json({
        session,
        account: createAccount.account,
      });
    }
  } catch (error) {
    console.log("Error during user SignUp:", error.message);

    return res.json({
      error: error.message,
    });
  }
};

export default SignUp;

import auth, { cookieOptions } from "../../../lib/firebase-admin";
import { setCookie } from "../../../lib/cookies";

import { initializeApollo } from "../../../lib/apolloClient";
import { AccountByEmailDocument } from "../../../generated/hooks";

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

      const {
        data: { accountByEmail },
      } = await apolloClient.query<
        AccountByEmailQuery,
        AccountByEmailQueryVariables
      >({
        query: AccountByEmailDocument,
        context: {
          headers: { authorization: `Bearer ${sessionCookie}` },
        },
        variables: {
          email: session.email,
        },
      });

      /**
       * We can now create the cookie
       */
      setCookie(res, "session", sessionCookie, {
        ...cookieOptions,
        maxAge: expiresIn
      });

      return res.json({
        session,
        account: accountByEmail,
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

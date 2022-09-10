import merge from "lodash.merge";
import { GetServerSideProps } from "next";
import { initializeApollo, addApolloState } from "../apolloClient";
import { AccountByEmailDocument } from "../../generated/hooks";
import { deleteCookie, getCookie } from "../cookies";
import auth from "../firebase-admin";

const withAuthMiddleware =
  (getServerSidePropsFunc?: GetServerSideProps) =>
  async (context: ContextWithAuth) => {
    let session = null;
    const { req, res, resolvedUrl: fullResolvedUrl } = context;

    // Parse the cookie to get the session
    const { session: sessionCookie } = getCookie(req);

    const apolloClient = initializeApollo(null, { ...context });

    const resolvedUrl =
      fullResolvedUrl.indexOf("?") !== -1
        ? fullResolvedUrl.split("?")[0]
        : fullResolvedUrl;

    try {
      session = await auth().verifySessionCookie(sessionCookie, false);

      /**
       * Here we can fatch the user based on the session email in order 
       * to pass it to the getServerSideProps
       */
      const { data } = await apolloClient.query<
        AccountByEmailQuery,
        AccountByEmailQueryVariables
      >({
        query: AccountByEmailDocument,
        variables: { email: session.email },
      });

      /**
       * this function help to pass some variables by default to the page component
       * without having to pass them manually getServerSideProps in the getServerSideProps
       */
      return merge(
        await getServerSidePropsFunc({
          ...context,
          apolloClient,
          account: data.accountByEmail,
          session,
        } as ContextWithAuth),
        {
          props: {
            account: data.accountByEmail,
            session,
          },
        }
      );
    } catch (error) {

      /**
       * If we have an authentication error we delete the session and redirect to the login page, 
       * in a real world we will probably want to handle this better
       */
      if (error.codePrefix === "auth") {
        deleteCookie(res, "session");

        // Let's avoid loops :) (even if in this case we are not using this middleware in the home page...)
        if (resolvedUrl !== "/") {
          res.statusCode = 401;
          return {
            redirect: {
              permanent: false,
              destination: "/",
            },
          };
        }
      }

      return {
        props: {
          error: "oops",
        },
      };
    }
  };

export default withAuthMiddleware;

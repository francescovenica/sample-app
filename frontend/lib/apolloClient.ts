import { useMemo } from "react";
import cloneDeep from "lodash.clonedeep";
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import omitDeep from "omit-deep";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";
import { onError } from "@apollo/client/link/error";
import { ApolloLink } from "@apollo/client/link/core";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { setContext } from "@apollo/client/link/context";

const { NEXT_PUBLIC_BASE_URL } = process.env;

let apolloClient;

const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

const createApolloClient = (ctx): ApolloClient<NormalizedCacheObject> => {
  const isBrowser = typeof window !== "undefined";

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        // eslint-disable-next-line no-console
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    // eslint-disable-next-line no-console
    if (networkError) {
      console.log(`[Network error]: ${JSON.stringify(networkError)}`);
    }
  });

  const cleanTypeName = new ApolloLink((operation, forward) => {
    const clonedOperation = operation;

    if (clonedOperation.variables) {
      clonedOperation.variables = omitDeep(
        cloneDeep(clonedOperation.variables),
        "__typename"
      );
    }
    return forward(clonedOperation).map((data) => data);
  });

  const authLink = setContext(async (request, context) => {
    return {
      headers: {
        ...context.headers,
        /**
         * This session will be available only on server side, on client side
         * we will send the cookie to our graphql endpoint that will convert
         * the cookie in the auth token
         */
        ...(ctx?.req?.cookies?.session && {
          authorization: `Bearer ${ctx.req.cookies.session}`,
        }),
      },
    };
  });

  const batchLink = new BatchHttpLink({
    uri: `${NEXT_PUBLIC_BASE_URL}/api/graphql`,
    batchMax: 5, // No more than 5 operations per batch
    batchInterval: 50, // Wait no more than 20ms after first batched operation
  });

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: ApolloLink.from([cleanTypeName, errorLink, authLink, batchLink]),
    /**
     * by default Apollo use the id field to manage the cache
     * I like to use uuid so we need to change the key used by 
     * apollo to manage the cache
     */
    cache: new InMemoryCache({
      typePolicies: {
        Account: {
          keyFields: ["uuid"],
        },
        Todo: {
          keyFields: ["uuid"],
        },
      },
    }),
    credentials: "same-origin",
  });
};

export const initializeApollo = (
  initialState,
  ctx
): ApolloClient<NormalizedCacheObject> => {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export const useApollo = (pageProps: any, context: any = {}) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () => initializeApollo(state, context),
    [state, context]
  );
  return store;
};

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

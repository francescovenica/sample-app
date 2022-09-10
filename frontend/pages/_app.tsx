import React from "react";

import { ApolloProvider } from "@apollo/client";
import AuthContextWrapper from "../context/auth";
import { useApollo } from "../lib/apolloClient";

import "../styles.css";

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <AuthContextWrapper
        value={{
          session: pageProps?.session,
          account: pageProps?.account,
        }}
      >
        <Component {...pageProps} />
      </AuthContextWrapper>
    </ApolloProvider>
  );
}

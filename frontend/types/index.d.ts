type GetServerSidePropsContext = import("next").GetServerSidePropsContext;
type ParsedUrlQuery = import("querystring").ParsedUrlQuery;
type FirebaseIdToken = import("firebase/app").default.FirebaseIdToken;

interface ContextWithAuth extends GetServerSidePropsContext {
  req: NextApiRequestWithToken;
  session: User;
  apolloClient: import("@apollo/client").ApolloClient<NormalizedCacheObject>;
}

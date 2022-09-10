# Front End

Let's create our simple front end in NextJS, I keep for granted that you already have worked with React.

This articles will have some code snippets/images to get a better experience in both desktop and mobile, if you want to see the full code you can find the link to the repo at the end of the guide.

We are going to use part of the code from the official NextJS repo `with-apollo`:
https://github.com/vercel/next.js/tree/canary/examples/with-apollo

We are going to use the `lib/apolloClient.js` file but we'll do some changes, the first one is to include an authenticatino link in order to add the Authentication token to the Authorization header, then will pass the down to all the function another parameter that we call `context`, this object contains the request object which we'll use to extract the session cookie and attach it to all our apollo requests. We'have added also a Batch link to be able to send multiple queries/mutation in one request:

```

const createApolloClient = (ctx): ApolloClient<NormalizedCacheObject> => {
  ...

  const authLink = setContext(async (request, context) => {
    return {
      headers: {
        ...context.headers,
        ...(ctx?.req?.cookies.session && {
          authorization: `Bearer ${ctx.req.cookies.session}`,
        }),
      },
    };
  });

  const batchLink = new BatchHttpLink({
    uri: NEXT_PUBLIC_BASE_URL,
    batchMax: 5, // No more than 5 operations per batch
    batchInterval: 50, // Wait no more than 20ms after first batched operation
  });


  eturn new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser,
    link: ApolloLink.from([errorLink, authLink, batchLink]),
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

}

export const initializeApollo = (initialState, ctx): ApolloClient<NormalizedCacheObject> => {
  const _apolloClient = apolloClient ?? createApolloClient(ctx);
  ...
}


export const useApollo = (pageProps, context = {}) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(
    () => initializeApollo(state, context),
    [state, context]
  );
  return store;
};
```

Now we can wrap our app with the Apollo provider:

```
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
```

as you can see we've added also an AuthContextWrapper, this is where we manage the authentication on client side:

```
let app: FirebaseApp;

if (!app) {
  app = initializeApp(config.firebase);
  setPersistence(getAuth(app), inMemoryPersistence);
}

export const useAuthContext = () => React.useContext(UserContext);

const UserContextWrapper = ({ value, children }: Props) => {
  const { push } = useRouter();
  const [authentication, setAuthentication] = useState<Authentication>(value);

  const completeLoginRegistration = async (credential: Credential, isLogin) => {
    let signInResult;
    const { email, password } = credential;

    const auth = getAuth();

    if (isLogin) {
      signInResult = await signInWithEmailAndPassword(auth, email, password);
    } else {
      signInResult = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
    }

    const idToken = await signInResult.user.getIdToken();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        authorization: idToken,
      },
      body: JSON.stringify({ email, password }),
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
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setAuthentication({
      account: null,
      session: null,
    });
  };

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
```

`signInWithEmailAndPassword` and `createUserWithEmailAndPassword` are firebase functions that let you login or ceate a new user in Firebase db. After login in Firebase we need to create or fetch the user from our db and create the session cookie to persist the user session, in order to do that we'll create an api endpoint in NextJS that will send a request to our api:

```
const SignUp = async (req, res) => {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const apolloClient = await initializeApollo(null, {
    req,
    res,
  });

  const { authorization } = req.headers;
  const { firstName = "", lastName = "" }: AccountInput = req.body;

  try {
    const session = await auth().verifyIdToken(authorization, true);

    if (session) {
      const sessionCookie = await auth().createSessionCookie(authorization, {
        expiresIn,
      });

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

      setCookie(res, "session", sessionCookie, {
        ...cookieOptions,
        maxAge: expiresIn,
        SameSite: "Lax",
      });

      return res.json({
        session,
        account: createAccount.account,
      });
    }
  } catch (error) {
    console.log("Error during user SignUp:", error.message);

    throw error;
  }
};

export default SignUp;
```

in this code we initialise Apollo, we grab the authorization token, we create a session token, we send the mutation with the auth token, we create the cookie and then we return back the account and session object, these will be stored in the React context. If you look in the repo the `createAccount` mutation check if we already have a user with this email, if we have it we just return it without create anything. I'm sure you are trying to understand what `CreateAccountMutation`, `CreateAccountMutationVariables` and `CreateAccountDocument` are, these are 2 types and one GraphQl query autogenerated by Codegen, this tool is a very powerful tool that parse all the file searching for graphql mutation/queries and create types/hooks for all the mutation/queries, we can then use the in React, if you are interested you can give have a look to the `codegen.yml` file and the `generate` script in the package.json.

We can now create a form in the home page and create our first user:

```
const HomeContainer = () => {
  const { signIn, signUp } = useAuthContext();
  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.signin}>
          <Form
            formName="signin"
            onSubmit={signIn}
            fields={signInFields}
          />
        </div>
        <div className={styles.signup}>
          <Form formName="signup" onSubmit={signUp} fields={signUpFields} />
        </div>
      </div>
    </Layout>
  );
};
```

this code is not 100% complete, to understand all the components I've used I suggest to check the repo where you can see everything.

We can now create a new page for the todos, let's start with the server side part:

```
export const getServerSideProps = withAuth(
  async ({ apolloClient }: ContextWithAuth) => {
    await apolloClient.query<TodosQuery, TodosQueryVariables>({
      query: TodosDocument,
    });

    return addApolloState(apolloClient, {
      props: {},
    });
  }
);
const TODO_QUERY = gql`
  query Todos {
    allTodos(orderBy: CREATED_AT_DESC) {
      nodes {
        uuid
        done
        title
        content
        createdAt
      }
    }
  }
`;
```

the most intersting part of the code is `addApolloState`, this function is adding all the result of the query in the Apollo cache and this data can be then used in the client side of the app. Let's create the page:

```
const TodoContainer = () => {

  const { data } = useTodosQuery({
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: "network-only",
    fetchPolicy: "cache-only",
  });

  const [createTodo] = useCreateTodoMutation();

  const onSubmit = ({ uuid, ...todo }) => 
    createTodo({
      variables: {
        input: {
          todo,
        },
      },
    });

  return (
    <Layout>
      <div className={styles.form}>
        <Form
          defaultValues={selectedTodo}
          formName="login"
          onSubmit={onSubmit}
          fields={loginFields}
        />
      </div>
      <div className={styles.list}>
        <List todos={data.allTodos} />
      </div>
    </Layout>
  );
};
```

`useTodosQuery` will fetch all our todos, as you can see the fetch policy is `cache-only`, this because we already fetched the todos in the server side so we can just read the cache, the `nextFetchPolicy` is for all the future request, in that case we want don't want to use the cache as we want to have always fresh data, `notifyOnNetworkStatusChange` is very important as it will re-render the component everytime the network status change, so if we run a mutation to update a todo the hook will rerender the component with the new data. In order to update the UI we just need to add some more code, the below mutation have a new prop called `update` that will read the cache for the `TodosQuery` and it will append the result of the mutation to the list of todos rerendering the UI with the new todo:

```
const [createTodo] = useCreateTodoMutation({
  update: (cache, { data: { createTodo } }) => {
    const { allTodos } = cache.readQuery<TodosQuery>({
      query: TodosDocument,
    });
    cache.writeQuery({
      query: TodosDocument,
      data: {
        allTodos: {
          ...allTodos,
          nodes: allTodos.nodes.concat([createTodo.todo]),
        },
      },
    });
  },
  });
```

simple right? We are able to create an item and update the UI without re-fetching the data. If we update an object using a mutation that return all the field requested in the `TodosQuery`, like this one:

```
  mutation UpdateTodo($input: UpdateTodoByUuidInput!) {
    updateTodoByUuid(input: $input) {
      query {
        allTodos {
          nodes {
            uuid
            done
            title
            content
            createdAt
          }
        }
      }
    }
  }
```

using the hook in this way:

```
  const [udpateTodo] = useUpdateTodoMutation();
```

the UI will update automatically without any other line of code. The important is to return the object in the mutation with the same fields we have in the query.

Apollo give us also another way to update the UI when we create new object, in fact if other users can create/update todos in our account we probably want to have the last data without updating the cache, this is super simple as we can udpate the mutation in this way:

```
const [createTodo] = useCreateTodoMutation({
  refetchQueries:[{
    query: TodosDocument,
    variables: { foo: "bar" }  // if necessary
  }],
});
```

That's it! We have now a frontend with an authentication layer that can list and create todos.

In the next part we will learn how to isolate data between different account! If you want to receive a notification when I create new content Follow me!


Here the link to the Part 1 of the Tutorial
Here the link to the Part 3 of the Tutorial

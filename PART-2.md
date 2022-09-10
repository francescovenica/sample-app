# Front End

Let's create our simple front end in NextJS, I keep for granted that you already have worked with React.

This articles will have some code snippets/images to get a better experience in both desktop and mobile, if you want to see the full code you can find the link to the repo at the end of the guide.

We are going to use part of the code from the official NextJS repo `with-apollo`:
https://github.com/vercel/next.js/tree/canary/examples/with-apollo

We are going to use the `lib/apolloClient.js` file but we'll do some changes, the first one is to include an authentication link in order to add the auth token to the Authorization header for all the request done by Apollo, then will pass the down to all the function another parameter that we call `context`, this object contains the request object which we'll use to extract the session cookie and attach it to all our apollo requests. We'have added also a Batch link to be able to send multiple queries/mutation in one request but this is optional:

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
    batchMax: 5,
    batchInterval: 50,
  });

  // Apollo use the id key to manage the cache, as we are using the key uuid we need to tell
  // apollo to use this new key
  return new ApolloClient({
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

`signInWithEmailAndPassword` and `createUserWithEmailAndPassword` are firebase functions that let you login or ceate a new user in Firebase. After login in Firebase we need to create or fetch the user from our db and create the session cookie to persist the user session, in order to do that we'll create an api endpoint in NextJS that will send a request to our api:

```
const SignUp = async (req, res) => {
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  const apolloClient = await initializeApollo(null, {
    req,
    res,
  });

  const { authorization } = req.headers;
  const { firstName = "", lastName = "" }: AccountInput = JSON.parse(req.body);

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
        account: createAccount.account
      });
    }
  } catch (error) {
    console.log("Error during user SignUp:", error.message);

    throw error;
  }
};

export default SignUp;
```

in this code we:

- initialise Apollo
- grab the authorization token
- we create a session token
- we send the mutation with the auth token to create the user
- we create the cookie and then we return back the account and the session object that will be stored in the React context.

I'm sure you are trying to understand what `CreateAccountMutation`, `CreateAccountMutationVariables` and `CreateAccountDocument` are, these are 2 types and one GraphQl mutation autogenerated by Codegen, Codegen is a very powerful tool that parse all the files searching for graphql mutation/queries and create types/hooks for all of them, it also validate all the queries/mutation against the GraphQL schema, we can then use these in React, if you are interested you can give have a look to the `codegen.yml` file and the `generate` script in the package.json.

If you check the repo you will see a very similar endpoint for signin, the only difference is that instead of sending the mutation to create an account we just fetch it.

In this example we are not handling the case where the createAccount mutation fails, in that case we have an account in Firebase but not in our db so you will not be able to login, we can fix this in different ways but I'll let you think how we can fix it, maybe you can write your solution in the comments :)

We can now create a page with 2 forms, one for signin and one for signup:

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

I suggest you to have a look to the repo in order to understand how the components I've used works. You are now able to register a new user and login, I'm sure you are going the get an error after signup/signin as we are redirecting the user to the `todos` page that we don't have yet, let's create the page for the todos, we'll start from the server side:

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

`withAuth` is a middleware that initialize apollo client and check for the session validity, look the repo to learn more about it, the first part of the code is something you already have seen, it's a simple query to fetch all the todos, the most intersting part of the code is `addApolloState`, this function adds the result in the Apollo cache that you will be able to use in the frontend.

Now we need to create the frontend components:

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
          todo: {
            ...todo,
            authorUuid: account.uuid,
          },
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

You have probably noticed that we are not passing the todos to our page component so in this moment we don't have any object containing the todos, the reason why we have done this is becuase we are going to fetch them again using `useTodosQuery` but instead of fetching from the api we'll fetch them against the Apollo cache. Doing this we can have the todos rendered on server side and at the same time have the data on our client side store. We are passing to the query hook also other 2 more arguments, `nextFetchPolicy` and `notifyOnNetworkStatusChange`, the first argument let the hook send any request after the first one with a cache policy set to `network-only`, so for all the next requests we are not going to use the cache again but we will fetch directly the api, `notifyOnNetworkStatusChange` is telling the hook to re-render the page if the network status change, this will be useful when we run a mutation becuase it will rerender the page at the end of the request.

In this page we have added a form that on submit send a mutation to create a todo, if you try you will see that the UI wil remain the same without the new todo, in order to update the UI we just need to add some more code, the below mutation have a new prop called `update` that will read the cache for the `TodosQuery` and it will append the result of the mutation to the list of todos rerendering the UI with the new todo:

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

using this hook:

```
  const [udpateTodo] = useUpdateTodoMutation();

  const onSubmit = () =>
    udpateTodo({
      variables: {
        input: {
          uuid,
          todoPatch: todo,
        },
      },
    });
```

the UI will update automatically without any other line of code. The important is to return the object in the mutation with the same fields we are returning in the initial query.

Apollo give us also another way to update the UI when we create new object, in fact if other users can create/update todos in our account we probably want to have the last available data without updating the cache, this is super simple as we can tell the hook to refetch a query after we recieve the mutation response:

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

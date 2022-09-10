# Introduction

Hello! I'm Francesco and I'm a FullStack developer working mainly with Node/React(-Native)/Apollo/Postgres, this is my first article so please be patient :)

In this tutorial we will create a new app from the api to the frontend using Postgres as database, NodeJS + Express + PostGraphile for the api and NextJS + Apollo for the frontend:

- in the first part we will create the api
- in the second part we will create the frontend
- in the last part we will speak about data isolation

I'll take for granted that you have some experience with node, ts and a bit of knowledge on sql language.

This article will have only some code snippet, if you want to see the full code you can find the link to the repo at the end of the guide.

Let's start with the Api, why Postgraphile?
Postgraphile is a very powerfull package that convert a Postgres database in a GraphQL schema creating all the necessary resolvers for us without N+1 issues when doing queries against the db. Using Typescript and Codegen we are also able to get all the types with one simple script, cool right?

In order to create our GraphQL server we need to create the db first, let spin up a Postgres instance using docker:

```
version: "3.7"
services:
  db:
    image: postgres
    command:
      ["postgres", "-c", "log_statement=all", "-c", "log_destination=stderr"]
    environment:
      - POSTGRES_PASSWORD=my-super-long-and-difficult-password
    ports:
      - "5432:5432"
```

open the database with a client (I like TablePlus, but any other tools is perfect), create a new database and run these queries:

```
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

  CREATE OR REPLACE FUNCTION current_account_uuid ()
    RETURNS uuid
    AS $$
    SELECT
      nullif (current_setting('app.current_account_uuid', TRUE), '')::uuid;
  $$
  LANGUAGE sql
  STABLE;

  CREATE TABLE account (
    uuid uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    first_name text,
    last_name text,
    email text NOT NULL UNIQUE,
    role account_type,
    status account_status,
    provider account_provider,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE TABLE todo (
    uuid uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
    author_uuid uuid NOT NULL DEFAULT current_account_uuid () REFERENCES account (uuid),
    title text,
    content text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );

  CREATE INDEX ON todo ("created_at");
  CREATE INDEX ON todo ("author_uuid");
```

we will explain why we need the `current_account_uuid` function in the last part of the tutorial, the indexes are necessary becuase we will order the result by `created_at` and we will filter the result by `author_uuid` so having an index will be faster.

## Api

After you create an express app we need to install postgraphile, run `npm i postgraphile`, once installed we need initialize it and add the middleware in our app.js:

```
/*  src/middleware/postgraphile.ts  */
export default postgraphile(pool, "public", {
  ...config.postgraphile,
  async additionalGraphQLContextFromRequest(req: Request, res: Response) {
    return {
      foo: "Bar",
    };
  },
});

/* app.ts */
const app = express();
app.use(postgraphile);
```

where pool is the db pool created using the `pg` module. Let's run the application:
`npm run dev`

open the following url:
`http://localhost:4001/graphiql`

you will see a UI where you can run graphql queries or mutations, copy and pate this mutation in the editor and the click the play button:

```
mutation MyMutation {
  createAccount(
    input: {
      account: {
        email: "email@email.com"
        firstName: "Name"
        lastName: "Suerame"
      }
    }
  ) {
    account {
      uuid
      email
      firstName
      lastName
    }
  }
}
```

In the response you will see the account you just created. Great! We have a graphql server up and running with only few lines of code!

Postgraphile  expose also another endpoint:
`http://localhost:4001/graphql`

this is the link we need to use when requesting something from our api.

### Resolver enhance

In a real world this is not enough, in fact we will need to validate an input, or comunicate with third part services before or after saving an object in the db. We will also need some custom queries or mutation that are not related to the db. With postgraphile we can easily do that with few lines of code, let's see how we can do it:

```
const WrapPlugin = makePluginByCombiningPlugins(
  makeWrapResolversPlugin({
    Mutation: {
      createAccount: {
        async resolve(
          resolve: any,
          source,
          args: any,
          context: any,
          resolveInfo
        ) {
          return createAccount(resolve, source, args, context, resolveInfo);
        },
      },
    },
  })
);
```

`createAccount` is a normal function that receive some params as input (you can see the function below), the args input contains the input we are sending in the mutation, the context contains anything we've added when we initialized postgraphile, you can see more info on this function at this link:
https://www.graphile.org/postgraphile/make-wrap-resolvers-plugin/

```
const isEmail = (email: string) => {
  var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (email !== "" && email.match(emailFormat)) {
    return true;
  }
  return false;
};

export const createAccount = (
  resolve: any,
  source: any,
  args: any,
  context: any,
  resolveInfo: any
) => {
  if (!isEmail(args.input.account.email)) {
    throw new Error("The email doesn't have the right format");
  }

  return resolve(source, args, context, resolveInfo);
};
```

now we need to tell postgraphile to use this plugin, let's import it and add it to postgraphile's plugins list, open the file `src/middleware/postgraphile.ts` and replace the content with this code:

```
import wrapPlugin from "./plugins/wrapPlugin";
export default postgraphile(pool, "public", {
  ...config.postgraphile,
  async additionalGraphQLContextFromRequest(req: Request, res: Response) {
    return {
      foo: "Bar",
    };
  },
  appendPlugins: [
    wrapPlugin
  ],
});
```

If you try to rerun the createAccount mutation with a malformatted email you will see now an error!

### Schema extension

If we want to add a new query/mutation not related to the database we need add some types/inputs and extends the query/mutation type in the schema:

```
export const typeDefs = gql`
  input CustomQueryInput {
    message: String!
  }
  type CustomQueryResult {
    message: String!
  }
  extend type Query {
    customQuery(input: CustomQueryInput): CustomQueryResult
  }
`;
```

then we need to create a plugin to use this schema:

```
const ExtendSchemaPlugin = makeExtendSchemaPlugin((build) => ({
  typeDefs,
  resolvers: {
    Query: {
      customQuery: (parent, args, context, info) => {
        return {
          message: args.input.message,
        }
      }
    },
  },
}));
```

and finally apply the plugin:

```
import extendSchema from "./plugins/extendSchema";
export default postgraphile(pool, "public", {
  ...config.postgraphile,
  appendPlugins: [
    wrapPlugin,
    extendSchema
  ],
});
```

Let's go back to the playground at this url `http://localhost:4001/graphiql` and run the custom query:

```
query CustomQuery {
  customQuery(input: {message: "hello"}) {
    message
  }
}
```

That's it! We have created a new query and enhance a mutation created by postgraphile.

## Authentication

We can now add the authentication layer, for this we are going to use an external Identity Provider, authentication is a really delicate part in an application, sometime is better to just use external Identity Provider instead of reinventing the weel and play safe, in this app we are going to use Firebase Auth (or GCP Identity Provider), the same logic can work also with other providers like Auht0, Okta, etc....

First we need to initialise firebase:

```
/* src/middleware/firebase.ts */
const firebase = admin.initializeApp(config.firebase, "server");
export default (req: Request, res: Response, next: NextFunction) => {
  req.firebase = firebase;
  return next();
};
```

then we need to validate the authentication token using the `verifySessionCookie` function, if the second argument is `true` it will be a bit slower as it checks if the token has been revoked, if `false` it only check the validity of the token and it will be quicker becuase we don't need any additional network request:

```
/* src/middleware/auth.ts */
export default async (req: Request, res: Response, next: NextFunction) => {

  const authorization: string | undefined = req?.headers.authorization;
  const token = authorization?.split(" ")?.[1];

  if (!token) {
    return next(new Error("Missing authorization token"));
  }

  try {
    req.session = await req.firebase.auth().verifySessionCookie(token, true);
  } catch (error) {
    return next(error);
  }

  return next();
};
```

and finally we need to add our new middlewares to the app:

```
const app = express();
...
app.use(firebaseMiddleware);
app.use(authMiddleware);
app.use(postgraphile);
...
export default app;

```

If you try to open the graphiql page or if you try to run any query/mutation to the `/graphql` endpoint you will receive an error.

In the second part we will develop the frontend and we will create a new user in order to use the api again!

If you want to receive a notification when I create new content Follow me!

Here the link to the Part 2 of the Tutorial
Here the link to the Part 3 of the Tutorial

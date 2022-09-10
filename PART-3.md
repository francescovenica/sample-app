# Data Isolation

In this part we will speak about data isolation using Postgraphile, Postgress, RLS (you can find more info here: https://www.postgresql.org/docs/current/ddl-rowsecurity.html) and Roles!

If you didn't read the previous part here you have the links.
Part 1
Part 2

Before starting to explain the data isolation let's create 2 account and 2 todo in our db:

```
INSERT INTO account (email, 'admin') VALUES ('email-1@email.com');
INSERT INTO account (email, 'editor') VALUES ('email-2@email.com');

INSERT INTO todo (title, content, author_uuid) VALUES ('Title 1', 'Content 1', 'use the uuid of the account you just created - account 1');
INSERT INTO todo (title, content, author_uuid) VALUES ('Title 2', 'Content 2', 'use the uuid of the account you just created - account 2');
```

We are now ready to start!

With Postgres we can create different roles with different permissions, for example a role can read, insert or update into the todos table but it can't delete it, another role can have full access to all the todos. Here we create the 2 roles:

```
create role editor;
create role admin;
```

and then we grant:

- `select, insert, update, delete` operation to the `account` table for both the roles
- `select, insert, update` operation on the `todo` table to the `editor` and full permission to the `admin`:

```
grant select, insert, update, delete on account to editor;
grant select, insert, update, delete on account to admin;

grant select, insert, update on todo to editor;
grant select, insert, update, delete on todo to admin;
```

We need now to manage to ownership of the items, for this we are going to use RLS (Row Level Security), with these we can limit the access to the single row based on the content of the row, before proceed we need to add a new function in Postgres, I will explain later why we do this. Run this query with your favourite client:

```
CREATE OR REPLACE FUNCTION current_account_email ()
  RETURNS text
  AS $$
  SELECT
    nullif (current_setting('app.current_account_email', TRUE), '')::text;

$$
LANGUAGE sql
STABLE;
```

let's create our first RLS:

```
ALTER TABLE account ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_editor ON account FOR ALL
    TO editor
    USING (current_account_email() = email OR current_account_uuid() = uuid)
    WITH CHECK (current_account_email() = email);

CREATE POLICY policy_admin ON account FOR ALL
    TO admin
    USING (current_account_email() = email OR current_account_uuid() = uuid)
    WITH CHECK (current_account_email() = email);
```

- the first thing we are doing here is to enable RLS in the `account` table 
- then we need to limit `select/update/delete` (USING) for both the role only to the row where `current_account_email() = email` or `current_account_uuid() = uuid`
- for the insert operation (WITH CHECK) we need only `current_account_email() = email`.

I'm sure you are asking to yourself what are these 2 functions (`current_account_uuid` and `current_account_email`), in our api we are going to set some variables (user uuid and user email) in the Postgress settings valid only for the current session, so each request can have different values, these values will be used in the queries for that particular request. I'm sure you are also asking to yourself what `USING` and `WITH CHECK` means, this is the syntax used by Postgress the understand which condition it has to use for `select/update/delete/create` you can find more info here: https://www.postgresql.org/docs/current/sql-createpolicy.html

Before we proceed to update the app let's create the RLS also for the todo table:

```
ALTER TABLE todo ENABLE ROW LEVEL SECURITY;

CREATE POLICY policy_editor_select ON todo FOR SELECT
    TO editor USING (current_account_uuid() = author_uuid);

CREATE POLICY policy_editor_update ON todo FOR UPDATE
    TO editor USING (current_account_uuid() = author_uuid);

CREATE POLICY policy_editor_insert ON todo FOR INSERT
    TO editor WITH CHECK (current_account_uuid() = author_uuid);

CREATE POLICY policy_admin ON todo FOR ALL
    TO admin
    USING (true)
    WITH CHECK (true);
```

in this case we just need to check if `current_account_uuid() = author_uuid` for the editor, for the admin we used: `USING (true) WITH CHECK (true)` that means that we can do all the operetion to all the rows.

You can test now if the RLS works fine using this query:

```
BEGIN;
SET role 'editor';
SET LOCAL app.current_account_uuid TO 'uuid-account-1';
SELECT * FROM account;
RESET ROLE;
COMMIT;
```

You will see that you will be able to see only your account. The same happens for the todos

```
BEGIN;
SET role 'editor';
SET LOCAL app.current_account_uuid TO 'uuid-account-1';
UPDATE todo SET title = 'my-title' WHERE author_uuid = 'uuid-account-2';
RESET ROLE;
COMMIT;
```

You will see that nothing happens, this becuase you can't select the todo created by someone else and so you can't update it!

Let's try to cancel a todo:

```
BEGIN;
SET role 'editor';
SET LOCAL app.current_account_uuid TO 'account-1';
DELETE FROM todo WHERE author_uuid = 'account-1';
RESET ROLE;
COMMIT;
```

What do you think it's gonna happen? We'll get an error, 

```
ERROR:  permission denied for table todo
```

this because this role doesn't have permission to delete anything in the todo table!

We can now update the app to pass the right values to Postgress's settings.

In our auth middleware we need to append append to user object to the request object:

```
export default async (req: Request, res: Response, next: NextFunction) => {

  ...

  try {

    req.session = await req.firebase.auth().verifySessionCookie(token, true);

    const pool = await getDbPool();

    await pool.query("BEGIN");
    await pool.query(`set role editor`, []); // let's use the role with less permission
    await pool.query(
      `select set_config('app.current_account_email', $1, true)`,
      [req.session.email]
    );

    const { rows: users } = await pool.query(
      "SELECT * FROM account WHERE email = $1",
      [req.session.email]
    );

    await pool.query("COMMIT");

    if (users.length) {
      req.account = {
        uuid: users[0].uuid,
        firstName: users[0].first_name,
        lastName: users[0].last_name,
        email: users[0].email,
        createdAt: users[0].created_at,
        updatedAt: users[0].updated_at,
      };
    }
  } catch (error) {
    return next(error);
  }

  return next();
};
```

now that we have the user object we can set the values on postgress settings through postgraphile:

```
export default postgraphile(pool, "public", {
  ...config.postgraphile,
  async additionalGraphQLContextFromRequest(req: Request, res: Response) {
    return {
      account: req.account,
      firebase: req.firebase,
      logger: req.logger,
    } as PostGraphileContext;
  },
  pgSettings: async ({ account, session }: Request) => {
    return {
      role: account?.role || 'editor',
      "app.current_account_uuid": account?.uuid,
      "app.current_account_email": account?.email || session?.email,
    };
  },
  appendPlugins: [wrapPlugin, extendSchema],
});
```

as you can see the the current email we are using the session email if the account doesn't exists, this is necessary beacuse when we create a new user we don't have these values yet while the session is already created at this point and it will have the same email of the user in the db. We are also adding some object in Postgraphile context (`additionalGraphQLContextFromRequest`), these will be available in all the resolvers.

Obviously there are a lot of other way to achieve the same result, for example we coul use only `"app.current_account_email": account?.email` and set this value again in the resolver where we create the user, but for this guide I wanted to keep everything as simple as possible.

Great! Now you have an app fully working from Api to the Frontend with an Authentication layer and with data isolation.

If you found this tutorial useful Follow me so you will be notified for new content!

Here the link to the Part 1 of the Tutorial
Here the link to the Part 2 of the Tutorial

type Maybe<T> = T | null;
type InputMaybe<T> = Maybe<T>;
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: any;
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: any;
};

type Account = Node & {
  __typename?: 'Account';
  createdAt: Scalars['Datetime'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  /** Reads and enables pagination through a set of `Todo`. */
  todosByAuthorUuid: TodosConnection;
  updatedAt: Scalars['Datetime'];
  uuid: Scalars['UUID'];
};


type AccountTodosByAuthorUuidArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TodoCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};

/** A condition to be used against `Account` object types. All fields are tested for equality and combined with a logical ‘and.’ */
type AccountCondition = {
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `uuid` field. */
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** An input for mutations affecting `Account` */
type AccountInput = {
  createdAt?: InputMaybe<Scalars['Datetime']>;
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** Represents an update to a `Account`. Fields that are set will be updated. */
type AccountPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** A connection to a list of `Account` values. */
type AccountsConnection = {
  __typename?: 'AccountsConnection';
  /** A list of edges which contains the `Account` and cursor to aid in pagination. */
  edges: Array<AccountsEdge>;
  /** A list of `Account` objects. */
  nodes: Array<Account>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Account` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Account` edge in the connection. */
type AccountsEdge = {
  __typename?: 'AccountsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Account` at the end of the edge. */
  node: Account;
};

/** Methods to use when ordering `Account`. */
type AccountsOrderBy =
  | 'EMAIL_ASC'
  | 'EMAIL_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'UUID_ASC'
  | 'UUID_DESC';

/** All input for the create `Account` mutation. */
type CreateAccountInput = {
  /** The `Account` to be created by this mutation. */
  account: AccountInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our create `Account` mutation. */
type CreateAccountPayload = {
  __typename?: 'CreateAccountPayload';
  /** The `Account` that was created by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Account` mutation. */
type CreateAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the create `Todo` mutation. */
type CreateTodoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Todo` to be created by this mutation. */
  todo: TodoInput;
};

/** The output of our create `Todo` mutation. */
type CreateTodoPayload = {
  __typename?: 'CreateTodoPayload';
  /** Reads a single `Account` that is related to this `Todo`. */
  accountByAuthorUuid?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Todo` that was created by this mutation. */
  todo?: Maybe<Todo>;
  /** An edge for our `Todo`. May be used by Relay 1. */
  todoEdge?: Maybe<TodosEdge>;
};


/** The output of our create `Todo` mutation. */
type CreateTodoPayloadTodoEdgeArgs = {
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};

type CustomQueryInput = {
  message: Scalars['String'];
};

type CustomQueryResult = {
  __typename?: 'CustomQueryResult';
  message: Scalars['String'];
};

/** All input for the `deleteAccountByEmail` mutation. */
type DeleteAccountByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
};

/** All input for the `deleteAccountByUuid` mutation. */
type DeleteAccountByUuidInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  uuid: Scalars['UUID'];
};

/** All input for the `deleteAccount` mutation. */
type DeleteAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Account` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Account` mutation. */
type DeleteAccountPayload = {
  __typename?: 'DeleteAccountPayload';
  /** The `Account` that was deleted by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedAccountId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Account` mutation. */
type DeleteAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `deleteTodoByUuid` mutation. */
type DeleteTodoByUuidInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  uuid: Scalars['UUID'];
};

/** All input for the `deleteTodo` mutation. */
type DeleteTodoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Todo` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Todo` mutation. */
type DeleteTodoPayload = {
  __typename?: 'DeleteTodoPayload';
  /** Reads a single `Account` that is related to this `Todo`. */
  accountByAuthorUuid?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  deletedTodoId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Todo` that was deleted by this mutation. */
  todo?: Maybe<Todo>;
  /** An edge for our `Todo`. May be used by Relay 1. */
  todoEdge?: Maybe<TodosEdge>;
};


/** The output of our delete `Todo` mutation. */
type DeleteTodoPayloadTodoEdgeArgs = {
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};

/** The root mutation type which contains root level fields which mutate data. */
type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Account`. */
  createAccount?: Maybe<CreateAccountPayload>;
  /** Creates a single `Todo`. */
  createTodo?: Maybe<CreateTodoPayload>;
  /** Deletes a single `Account` using its globally unique id. */
  deleteAccount?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountByEmail?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Account` using a unique key. */
  deleteAccountByUuid?: Maybe<DeleteAccountPayload>;
  /** Deletes a single `Todo` using its globally unique id. */
  deleteTodo?: Maybe<DeleteTodoPayload>;
  /** Deletes a single `Todo` using a unique key. */
  deleteTodoByUuid?: Maybe<DeleteTodoPayload>;
  /** Updates a single `Account` using its globally unique id and a patch. */
  updateAccount?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountByEmail?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Account` using a unique key and a patch. */
  updateAccountByUuid?: Maybe<UpdateAccountPayload>;
  /** Updates a single `Todo` using its globally unique id and a patch. */
  updateTodo?: Maybe<UpdateTodoPayload>;
  /** Updates a single `Todo` using a unique key and a patch. */
  updateTodoByUuid?: Maybe<UpdateTodoPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationDeleteAccountByEmailArgs = {
  input: DeleteAccountByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationDeleteAccountByUuidArgs = {
  input: DeleteAccountByUuidInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationDeleteTodoArgs = {
  input: DeleteTodoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationDeleteTodoByUuidArgs = {
  input: DeleteTodoByUuidInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationUpdateAccountByEmailArgs = {
  input: UpdateAccountByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationUpdateAccountByUuidArgs = {
  input: UpdateAccountByUuidInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationUpdateTodoArgs = {
  input: UpdateTodoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
type MutationUpdateTodoByUuidArgs = {
  input: UpdateTodoByUuidInput;
};

/** An object with a globally unique `ID`. */
type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** Information about pagination in a connection. */
type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

/** The root query type which gives access points into the data universe. */
type Query = Node & {
  __typename?: 'Query';
  /** Reads a single `Account` using its globally unique `ID`. */
  account?: Maybe<Account>;
  accountByEmail?: Maybe<Account>;
  accountByUuid?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Account`. */
  allAccounts?: Maybe<AccountsConnection>;
  /** Reads and enables pagination through a set of `Todo`. */
  allTodos?: Maybe<TodosConnection>;
  currentAccountEmail?: Maybe<Scalars['String']>;
  currentAccountUuid?: Maybe<Scalars['UUID']>;
  customQuery?: Maybe<CustomQueryResult>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads a single `Todo` using its globally unique `ID`. */
  todo?: Maybe<Todo>;
  todoByUuid?: Maybe<Todo>;
};


/** The root query type which gives access points into the data universe. */
type QueryAccountArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
type QueryAccountByEmailArgs = {
  email: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
type QueryAccountByUuidArgs = {
  uuid: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
type QueryAllAccountsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<AccountCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
type QueryAllTodosArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TodoCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
type QueryCustomQueryArgs = {
  input?: InputMaybe<CustomQueryInput>;
};


/** The root query type which gives access points into the data universe. */
type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
type QueryTodoArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
type QueryTodoByUuidArgs = {
  uuid: Scalars['UUID'];
};

type Todo = Node & {
  __typename?: 'Todo';
  /** Reads a single `Account` that is related to this `Todo`. */
  accountByAuthorUuid?: Maybe<Account>;
  authorUuid?: Maybe<Scalars['UUID']>;
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Datetime'];
  done: Scalars['Boolean'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Datetime'];
  uuid: Scalars['UUID'];
};

/** A condition to be used against `Todo` object types. All fields are tested for equality and combined with a logical ‘and.’ */
type TodoCondition = {
  /** Checks for equality with the object’s `authorUuid` field. */
  authorUuid?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `uuid` field. */
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** An input for mutations affecting `Todo` */
type TodoInput = {
  authorUuid?: InputMaybe<Scalars['UUID']>;
  content?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Datetime']>;
  done?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** Represents an update to a `Todo`. Fields that are set will be updated. */
type TodoPatch = {
  authorUuid?: InputMaybe<Scalars['UUID']>;
  content?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Datetime']>;
  done?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** A connection to a list of `Todo` values. */
type TodosConnection = {
  __typename?: 'TodosConnection';
  /** A list of edges which contains the `Todo` and cursor to aid in pagination. */
  edges: Array<TodosEdge>;
  /** A list of `Todo` objects. */
  nodes: Array<Todo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Todo` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Todo` edge in the connection. */
type TodosEdge = {
  __typename?: 'TodosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Todo` at the end of the edge. */
  node: Todo;
};

/** Methods to use when ordering `Todo`. */
type TodosOrderBy =
  | 'AUTHOR_UUID_ASC'
  | 'AUTHOR_UUID_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'NATURAL'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC'
  | 'UUID_ASC'
  | 'UUID_DESC';

/** All input for the `updateAccountByEmail` mutation. */
type UpdateAccountByEmailInput = {
  /** An object where the defined keys will be set on the `Account` being updated. */
  accountPatch: AccountPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
};

/** All input for the `updateAccountByUuid` mutation. */
type UpdateAccountByUuidInput = {
  /** An object where the defined keys will be set on the `Account` being updated. */
  accountPatch: AccountPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  uuid: Scalars['UUID'];
};

/** All input for the `updateAccount` mutation. */
type UpdateAccountInput = {
  /** An object where the defined keys will be set on the `Account` being updated. */
  accountPatch: AccountPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Account` to be updated. */
  nodeId: Scalars['ID'];
};

/** The output of our update `Account` mutation. */
type UpdateAccountPayload = {
  __typename?: 'UpdateAccountPayload';
  /** The `Account` that was updated by this mutation. */
  account?: Maybe<Account>;
  /** An edge for our `Account`. May be used by Relay 1. */
  accountEdge?: Maybe<AccountsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Account` mutation. */
type UpdateAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `updateTodoByUuid` mutation. */
type UpdateTodoByUuidInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Todo` being updated. */
  todoPatch: TodoPatch;
  uuid: Scalars['UUID'];
};

/** All input for the `updateTodo` mutation. */
type UpdateTodoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Todo` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Todo` being updated. */
  todoPatch: TodoPatch;
};

/** The output of our update `Todo` mutation. */
type UpdateTodoPayload = {
  __typename?: 'UpdateTodoPayload';
  /** Reads a single `Account` that is related to this `Todo`. */
  accountByAuthorUuid?: Maybe<Account>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Todo` that was updated by this mutation. */
  todo?: Maybe<Todo>;
  /** An edge for our `Todo`. May be used by Relay 1. */
  todoEdge?: Maybe<TodosEdge>;
};


/** The output of our update `Todo` mutation. */
type UpdateTodoPayloadTodoEdgeArgs = {
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};

type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


type CreateAccountMutation = { __typename?: 'Mutation', createAccount?: { __typename?: 'CreateAccountPayload', account?: { __typename?: 'Account', uuid: any, email: string, lastName?: string | null, firstName?: string | null } | null } | null };

type CreateTodoMutationVariables = Exact<{
  input: CreateTodoInput;
}>;


type CreateTodoMutation = { __typename?: 'Mutation', createTodo?: { __typename?: 'CreateTodoPayload', todo?: { __typename?: 'Todo', uuid: any, done: boolean, title?: string | null, content?: string | null, createdAt: any } | null } | null };

type UpdateTodoMutationVariables = Exact<{
  input: UpdateTodoByUuidInput;
}>;


type UpdateTodoMutation = { __typename?: 'Mutation', updateTodoByUuid?: { __typename?: 'UpdateTodoPayload', query?: { __typename?: 'Query', allTodos?: { __typename?: 'TodosConnection', nodes: Array<{ __typename?: 'Todo', uuid: any, done: boolean, title?: string | null, content?: string | null, createdAt: any }> } | null } | null } | null };

type AccountByEmailQueryVariables = Exact<{
  email: Scalars['String'];
}>;


type AccountByEmailQuery = { __typename?: 'Query', accountByEmail?: { __typename?: 'Account', uuid: any, email: string, lastName?: string | null, firstName?: string | null } | null };

type TodosQueryVariables = Exact<{ [key: string]: never; }>;


type TodosQuery = { __typename?: 'Query', allTodos?: { __typename?: 'TodosConnection', nodes: Array<{ __typename?: 'Todo', uuid: any, done: boolean, title?: string | null, content?: string | null, createdAt: any }> } | null };

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
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

export type Account = Node & {
  __typename?: 'Account';
  createdAt: Scalars['Datetime'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  updatedAt: Scalars['Datetime'];
  uuid: Scalars['UUID'];
};

/** A condition to be used against `Account` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AccountCondition = {
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `uuid` field. */
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** An input for mutations affecting `Account` */
export type AccountInput = {
  createdAt?: InputMaybe<Scalars['Datetime']>;
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** Represents an update to a `Account`. Fields that are set will be updated. */
export type AccountPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** A connection to a list of `Account` values. */
export type AccountsConnection = {
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
export type AccountsEdge = {
  __typename?: 'AccountsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Account` at the end of the edge. */
  node: Account;
};

/** Methods to use when ordering `Account`. */
export enum AccountsOrderBy {
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UuidAsc = 'UUID_ASC',
  UuidDesc = 'UUID_DESC'
}

/** All input for the create `Account` mutation. */
export type CreateAccountInput = {
  /** The `Account` to be created by this mutation. */
  account: AccountInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
};

/** The output of our create `Account` mutation. */
export type CreateAccountPayload = {
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
export type CreateAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the create `Todo` mutation. */
export type CreateTodoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The `Todo` to be created by this mutation. */
  todo: TodoInput;
};

/** The output of our create `Todo` mutation. */
export type CreateTodoPayload = {
  __typename?: 'CreateTodoPayload';
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
export type CreateTodoPayloadTodoEdgeArgs = {
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};

export type CustomQueryInput = {
  message: Scalars['String'];
};

export type CustomQueryResult = {
  __typename?: 'CustomQueryResult';
  message: Scalars['String'];
};

/** All input for the `deleteAccountByEmail` mutation. */
export type DeleteAccountByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
};

/** All input for the `deleteAccountByUuid` mutation. */
export type DeleteAccountByUuidInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  uuid: Scalars['UUID'];
};

/** All input for the `deleteAccount` mutation. */
export type DeleteAccountInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Account` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Account` mutation. */
export type DeleteAccountPayload = {
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
export type DeleteAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `deleteTodoByUuid` mutation. */
export type DeleteTodoByUuidInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  uuid: Scalars['UUID'];
};

/** All input for the `deleteTodo` mutation. */
export type DeleteTodoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Todo` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Todo` mutation. */
export type DeleteTodoPayload = {
  __typename?: 'DeleteTodoPayload';
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
export type DeleteTodoPayloadTodoEdgeArgs = {
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
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
export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountArgs = {
  input: DeleteAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByEmailArgs = {
  input: DeleteAccountByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteAccountByUuidArgs = {
  input: DeleteAccountByUuidInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTodoArgs = {
  input: DeleteTodoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTodoByUuidArgs = {
  input: DeleteTodoByUuidInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountArgs = {
  input: UpdateAccountInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByEmailArgs = {
  input: UpdateAccountByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateAccountByUuidArgs = {
  input: UpdateAccountByUuidInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTodoArgs = {
  input: UpdateTodoInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTodoByUuidArgs = {
  input: UpdateTodoByUuidInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
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
export type Query = Node & {
  __typename?: 'Query';
  /** Reads a single `Account` using its globally unique `ID`. */
  account?: Maybe<Account>;
  accountByEmail?: Maybe<Account>;
  accountByUuid?: Maybe<Account>;
  /** Reads and enables pagination through a set of `Account`. */
  allAccounts?: Maybe<AccountsConnection>;
  /** Reads and enables pagination through a set of `Todo`. */
  allTodos?: Maybe<TodosConnection>;
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
export type QueryAccountArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountByEmailArgs = {
  email: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAccountByUuidArgs = {
  uuid: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAllAccountsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<AccountCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTodosArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<TodoCondition>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCustomQueryArgs = {
  input?: InputMaybe<CustomQueryInput>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTodoArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTodoByUuidArgs = {
  uuid: Scalars['UUID'];
};

export type Todo = Node & {
  __typename?: 'Todo';
  content?: Maybe<Scalars['String']>;
  createdAt: Scalars['Datetime'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['Datetime'];
  uuid: Scalars['UUID'];
};

/** A condition to be used against `Todo` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TodoCondition = {
  /** Checks for equality with the object’s `uuid` field. */
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** An input for mutations affecting `Todo` */
export type TodoInput = {
  content?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Datetime']>;
  title?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** Represents an update to a `Todo`. Fields that are set will be updated. */
export type TodoPatch = {
  content?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['Datetime']>;
  title?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['Datetime']>;
  uuid?: InputMaybe<Scalars['UUID']>;
};

/** A connection to a list of `Todo` values. */
export type TodosConnection = {
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
export type TodosEdge = {
  __typename?: 'TodosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Todo` at the end of the edge. */
  node: Todo;
};

/** Methods to use when ordering `Todo`. */
export enum TodosOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UuidAsc = 'UUID_ASC',
  UuidDesc = 'UUID_DESC'
}

/** All input for the `updateAccountByEmail` mutation. */
export type UpdateAccountByEmailInput = {
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
export type UpdateAccountByUuidInput = {
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
export type UpdateAccountInput = {
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
export type UpdateAccountPayload = {
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
export type UpdateAccountPayloadAccountEdgeArgs = {
  orderBy?: InputMaybe<Array<AccountsOrderBy>>;
};

/** All input for the `updateTodoByUuid` mutation. */
export type UpdateTodoByUuidInput = {
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
export type UpdateTodoInput = {
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
export type UpdateTodoPayload = {
  __typename?: 'UpdateTodoPayload';
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
export type UpdateTodoPayloadTodoEdgeArgs = {
  orderBy?: InputMaybe<Array<TodosOrderBy>>;
};

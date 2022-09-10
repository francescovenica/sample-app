import { gql } from "graphile-utils";


/**
 * Here we can define our custom schema
 */
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

/**
 *
 * I usually like to create a container folder with
 * the content of the page in order to keep in this
 * page only the server side implementation
 *
 */

import { gql } from "@apollo/client";
import { addApolloState } from "../lib/apolloClient";
import { TodosDocument } from "../generated/hooks";
import withAuth from "../lib/middleware/withAuth";
import TodoContainer from "../container/Todos";

export const getServerSideProps = withAuth(
  async ({ apolloClient }: ContextWithAuth) => {
    /**
     * The withAuth middleware provide us an instance of apollo client
     */
    await apolloClient.query<TodosQuery, TodosQueryVariables>({
      query: TodosDocument,
    });

    /**
     * this is an important part as here we are adding the result to apollo cache
     * this will help on client side as we will request this data from the cache on page load
     */
    return addApolloState(apolloClient, {
      props: {},
    });
  }
);

export default TodoContainer;

/**
 * This is the query wwe will run to get the todos
 */
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

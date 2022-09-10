import React, { useState } from "react";
import Layout from "../Layout";
import Form, { Field } from "../../components/Form";
import List from "../../components/List";
import {
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useTodosQuery,
  TodosDocument,
} from "../../generated/hooks";
import styles from "./styles.module.scss";
import { useAuthContext } from "../../context/auth";
import withAuthClient from "../../hoc/withAuthClient";

const loginFields: Field[] = [
  {
    name: "title",
    label: "Title",
    validation: { required: true },
  },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    validation: { required: true },
  },
];

type T = TodosQuery["allTodos"]["nodes"][0];

const TodoContainer = () => {
  const { account } = useAuthContext();
  /**
   * When we create a new todo we have different way to update the ui,
   * if the data can be changed by other user it is probably a good
   * options to just refetch the todo query using refetchQueries: [{ query: TODO_QUERY, variables: { here any variable to send with the request } }].
   */
  const [createTodo] = useCreateTodoMutation({
    onCompleted: () => setSelectedTodo(null),
    // refetchQueries:[{
    //   query: TodosDocument,
    //   variables: {
    //     foo: "bar"
    //   }
    // }],
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
  const [udpateTodo] = useUpdateTodoMutation({
    onCompleted: () => setSelectedTodo(null),
  });
  const [selectedTodo, setSelectedTodo] = useState(null);
  const { data } = useTodosQuery({
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: "network-only",
    fetchPolicy: "cache-only",
  });

  /**
   * If the payload containes a uuid we'll update the todo
   * otherwise we create a new todo
   */
  const onSubmit = ({ uuid, ...todo }) => {
    if (uuid) {
      udpateTodo({
        variables: {
          input: {
            uuid,
            todoPatch: todo,
          },
        },
      });
    } else {
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
    }
  };

  const onDone = (todo: T, isCompleted: boolean) =>
    udpateTodo({
      variables: {
        input: {
          uuid: todo.uuid,
          todoPatch: {
            done: isCompleted,
          },
        },
      },
    });

  /**
   * Here we are sending only the uuid and we search for this todo
   * from the list, we can also send the object
   */
  const onEdit = (todo: T) => setSelectedTodo(todo);

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
        <List todos={data.allTodos} onEdit={onEdit} onDone={onDone} />
      </div>
    </Layout>
  );
};

export default withAuthClient(TodoContainer, {
  returnTo: "/ciao",
});

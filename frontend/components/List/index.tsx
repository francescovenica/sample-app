import React from "react";
import Todo from "../Todo";
import styles from "./styles.module.scss";

type T = TodosQuery["allTodos"]["nodes"][0];

type Props = {
  todos: TodosQuery["allTodos"];
  onEdit: (todo: T) => void;
  onDone: (todo: T, isCompleted: boolean) => void;
};

const TodoList = ({ todos, onEdit, onDone }: Props) => (
  <div className={styles.list}>
    {todos.nodes.map((todo) => (
      <Todo key={todo.uuid} todo={todo} onEdit={onEdit} onDone={onDone} />
    ))}
  </div>
);

export default TodoList;
